// FilterModal.tsx
import {
	type KeyboardEvent as ReactKeyboardEvent,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react'
import { useTranslation } from 'react-i18next'

import { useFilterStore } from '@shared/api/types/Filter/FilterStore'
import { FilterChoose, FilterType } from '@shared/api/types/Filter/index'

import { CloseIcon } from '@assets/closeIcon'

import { ConfirmModal } from './ConfirmModal'

interface Props {
	isOpen: boolean
	onClose: () => void
	filters: FilterChoose[]
}

export const FilterModal = ({ isOpen, onClose, filters }: Props) => {
	const { t } = useTranslation()
	const savedFilters = useFilterStore(state => state.filters)
	const setFilters = useFilterStore(state => state.setFilters)

	const [localFilters, setLocalFilters] = useState(savedFilters)
	const [confirmOpen, setConfirmOpen] = useState(false)
	const [snapshotFilters, setSnapshotFilters] = useState(savedFilters)
	const modalRef = useRef<HTMLDivElement | null>(null)
	const lastActiveRef = useRef<HTMLElement | null>(null)

	useEffect(() => {
		if (isOpen) {
			setLocalFilters(savedFilters)
			setSnapshotFilters(savedFilters)
		}
	}, [isOpen, savedFilters])

	const handleApply = () => setConfirmOpen(true)

	const handleConfirm = () => {
		setFilters(localFilters)
		setConfirmOpen(false)
		onClose()
	}

	const handleReset = () => {
		setLocalFilters(snapshotFilters)
		setConfirmOpen(false)
	}

	const handleToggle = (filterId: string, optionId: string) => {
		setLocalFilters(prev => {
			const existing = prev.find(filterItem => filterItem.id === filterId)
			if (existing) {
				const isSelected = existing.optionsIds.includes(optionId)
				return prev.map(filterItem =>
					filterItem.id === filterId
						? {
								...filterItem,
								optionsIds: isSelected
									? filterItem.optionsIds.filter(id => id !== optionId)
									: [...filterItem.optionsIds, optionId]
							}
						: filterItem
				)
			}
			return [
				...prev,
				{ id: filterId, type: FilterType.OPTION, optionsIds: [optionId] }
			]
		})
	}

	const handleClear = () => {
		setLocalFilters([])
	}

	const selectedByFilter = useMemo(() => {
		const map = new Map<string, Set<string>>()
		localFilters.forEach(filterItem => {
			map.set(filterItem.id, new Set(filterItem.optionsIds))
		})
		return map
	}, [localFilters])

	useEffect(() => {
		if (!isOpen || confirmOpen) {
			return
		}

		lastActiveRef.current = document.activeElement as HTMLElement | null

		const modal = modalRef.current
		if (modal) {
			modal.focus()
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				event.stopPropagation()
				onClose()
			}
		}

		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [confirmOpen, isOpen, onClose])

	useEffect(() => {
		if (isOpen) {
			return
		}

		lastActiveRef.current?.focus()
	}, [isOpen])

	const handleTrapFocus = (event: ReactKeyboardEvent<HTMLDivElement>) => {
		if (confirmOpen) {
			return
		}
		if (event.key !== 'Tab') {
			return
		}

		const modal = modalRef.current
		if (!modal) {
			return
		}

		const focusables = Array.from(
			modal.querySelectorAll<HTMLElement>(
				'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
			)
		).filter(
			el =>
				!el.hasAttribute('disabled') &&
				el.getAttribute('aria-hidden') !== 'true'
		)

		if (focusables.length === 0) {
			event.preventDefault()
			return
		}

		const first = focusables[0]
		const last = focusables[focusables.length - 1]
		const active = document.activeElement as HTMLElement | null

		if (event.shiftKey) {
			if (active === first || !active || !modal.contains(active)) {
				event.preventDefault()
				last.focus()
			}
			return
		}

		if (active === last || !active || !modal.contains(active)) {
			event.preventDefault()
			first.focus()
		}
	}

	if (!isOpen) {
		return null
	}

	return (
		<>
			<div className="fixed inset-0 z-50 flex items-center justify-center p-[80px]">
				<div
					className={`absolute inset-0 bg-black/50 ${confirmOpen ? 'pointer-events-none' : ''}`}
					onClick={onClose}
				/>
				<div
					ref={modalRef}
					role="dialog"
					aria-modal="true"
					aria-labelledby="filter-modal-title"
					aria-hidden={confirmOpen}
					tabIndex={-1}
					onKeyDown={handleTrapFocus}
					className={`flex max-h-[80vh] relative z-10 w-full overflow-auto rounded-[16px] bg-white px-8 py-[40px] items-center flex-col ${confirmOpen ? 'pointer-events-none' : ''}`}
				>
					<div className="mb-[25px] w-full relative">
						<h2
							id="filter-modal-title"
							className="text-[40px] font-medium"
						>
							{t('Filter')}
						</h2>
						<button
							type="button"
							aria-label={t('Close', { defaultValue: 'Close' })}
							className="absolute top-[0px] right-[0px] rounded-full hover:bg-gray-200 transition"
							onClick={onClose}
						>
							<CloseIcon />
						</button>
					</div>
					<hr className="w-full border-t-[#B4B4B4] border-t-2" />
					{filters.map(filter => (
						<div
							key={filter.id}
							className="flex mt-[64px] w-full items-start flex-col"
						>
							<h3 className="text-[24px] font-medium mb-6">{filter.name}</h3>
							<div className="grid grid-cols-3 gap-2 w-full">
								{filter.options.map(option => (
									<label
										key={option.id}
										className="flex items-center"
									>
										<input
											type="checkbox"
											checked={Boolean(
												selectedByFilter.get(filter.id)?.has(option.id)
											)}
											onChange={() => handleToggle(filter.id, option.id)}
										/>
										<span className="ml-4">{t(option.name)}</span>
									</label>
								))}
							</div>
							<hr className="w-full border-t-[#B4B4B4] border-t-2 mt-8" />
						</div>
					))}

					<div className="mt-6 w-full relative flex items-center">
						<button
							onClick={handleApply}
							className="px-17.5 py-6.5 rounded-[16px] bg-[#FF5F00] leading-[12px] text-white mx-auto"
						>
							{t('Apply')}
						</button>
						<button
							onClick={handleClear}
							className="text-[#078691] underline absolute right-0 top-1/2 -translate-y-1/2"
						>
							{t('Clear all parameters')}
						</button>
					</div>
				</div>
			</div>

			<ConfirmModal
				isOpen={confirmOpen}
				title={t('Do you want to apply new filters', {
					defaultValue: 'Do you want to apply new filters'
				})}
				onConfirm={handleConfirm}
				onReset={handleReset}
				onClose={() => setConfirmOpen(false)}
			/>
		</>
	)
}

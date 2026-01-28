// FilterModal.tsx
import { useEffect, useState } from 'react'
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
	const clearFiltersStore = useFilterStore(state => state.clearFilters)

	const [localFilters, setLocalFilters] = useState(savedFilters)
	const [confirmOpen, setConfirmOpen] = useState(false)
	const [snapshotFilters, setSnapshotFilters] = useState(savedFilters)

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
		clearFiltersStore()
		setLocalFilters([])
	}

	if (!isOpen) {
		return null
	}

	return (
		<>
			<div className="fixed inset-0 z-50 flex items-center justify-center p-[80px]">
				<div
					className="absolute inset-0 bg-black/50"
					onClick={onClose}
				/>
				<div className="flex max-h-[80vh] relative z-10 w-full overflow-auto rounded-[16px] bg-white px-8 py-[40px] items-center flex-col">
					<div className="mb-[25px] w-full relative">
						<h2 className="text-[40px] font-medium">{t('Filter')}</h2>
						<button
							type="button"
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
												localFilters
													.find(filterItem => filterItem.id === filter.id)
													?.optionsIds?.includes(option.id)
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
				title="Do you want to apply new filters"
				onConfirm={handleConfirm}
				onReset={handleReset}
				onClose={() => setConfirmOpen(false)}
			/>
		</>
	)
}

import {
	type KeyboardEvent as ReactKeyboardEvent,
	useEffect,
	useRef
} from 'react'
import { useTranslation } from 'react-i18next'

import { CloseIcon } from '@assets/closeIcon'

interface ConfirmModalProps {
	isOpen: boolean
	title?: string
	onConfirm: () => void
	onReset: () => void
	onClose: () => void
}

export const ConfirmModal = ({
	isOpen,
	title,
	onConfirm,
	onReset,
	onClose
}: ConfirmModalProps) => {
	const { t } = useTranslation()
	const modalRef = useRef<HTMLDivElement | null>(null)
	const lastActiveRef = useRef<HTMLElement | null>(null)

	useEffect(() => {
		if (!isOpen) {
			return
		}

		lastActiveRef.current = document.activeElement as HTMLElement | null
		modalRef.current?.focus()

		return () => {
			lastActiveRef.current?.focus()
		}
	}, [isOpen])

	const handleTrapFocus = (event: ReactKeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Escape') {
			event.stopPropagation()
			onClose()
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
		<div className="fixed inset-0 z-50 flex items-center justify-center p-[80px]">
			<div
				className="absolute inset-0 bg-black/50"
				onClick={onReset}
			/>

			<div
				ref={modalRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby={title ? 'confirm-modal-title' : undefined}
				aria-label={
					title
						? undefined
						: t('Confirm dialog', { defaultValue: 'Confirm dialog' })
				}
				tabIndex={-1}
				onKeyDown={handleTrapFocus}
				className="relative z-10 w-full rounded-[16px] bg-white p-8 flex flex-col items-center"
			>
				{title && (
					<h2
						id="confirm-modal-title"
						className="text-[40px] font-medium mb-[120px]"
					>
						{title}
					</h2>
				)}
				<button
					type="button"
					aria-label={t('Close', { defaultValue: 'Close' })}
					className="absolute top-[44px] right-[32px] rounded-full hover:bg-gray-200 transition"
					onClick={onClose}
				>
					<CloseIcon />
				</button>

				<div className="flex gap-8">
					<button
						onClick={onReset}
						className="w-[280px] py-6.5 bg-white text-black rounded-[16px] border-[#B4B4B4] font-semibold border-2 leading-3"
					>
						{t('Use old filter')}
					</button>
					<button
						onClick={onConfirm}
						className="w-[280px] py-6.5 bg-[#FF5F00] text-white rounded-[16px] font-semibold leading-3"
					>
						{t('Apply new filter')}
					</button>
				</div>
			</div>
		</div>
	)
}

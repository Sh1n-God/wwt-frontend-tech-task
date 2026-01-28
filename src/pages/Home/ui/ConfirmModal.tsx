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

	if (!isOpen) {
		return null
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-[80px]">
			<div
				className="absolute inset-0 bg-black/50"
				onClick={onReset}
			/>

			<div className="relative z-10 w-full rounded-[16px] bg-white p-8 flex flex-col items-center">
				{title && (
					<h2 className="text-[40px] font-medium mb-[120px]">{title}</h2>
				)}
				<button
					type="button"
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

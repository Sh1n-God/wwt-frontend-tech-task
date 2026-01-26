import { useTranslation } from 'react-i18next'

interface Props {
	onClose: () => void
}

export const FilterModal = ({ onClose }: Props) => {
	const { t } = useTranslation()

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="absolute inset-0 bg-black/50"
				onClick={onClose}
			/>

			<div className="relative z-10 w-[600px] max-h-[80vh] overflow-auto rounded-xl bg-white p-6">
				<h2 className="text-xl font-semibold mb-4">{t('filterstitle')}</h2>

				<div className="mt-6 flex justify-end gap-3">
					<button
						className="px-4 py-2 rounded border"
						onClick={onClose}
					>
						{t('cancel')}
					</button>

					<button className="px-4 py-2 rounded bg-blue-600 text-white">
						{t('apply')}
					</button>
				</div>
			</div>
		</div>
	)
}

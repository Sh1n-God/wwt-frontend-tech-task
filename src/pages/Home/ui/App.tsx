import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useQuery } from '@tanstack/react-query'

import { getFilterData } from '@/shared/api/getFilterData'
import { useFilterStore } from '@/shared/api/types/Filter/FilterStore'

import { FilterModal } from './FilterModal'

export const App = () => {
	const { t } = useTranslation()
	const [isOpen, setIsOpen] = useState(false)
	const { data: filters } = useQuery({
		queryKey: ['filters'],
		queryFn: getFilterData
	})

	const selectedFilters = useFilterStore(state => state.filters) // глобальные выбранные фильтры

	return (
		<section className="w-full h-dvh flex flex-col items-center justify-center gap-4">
			<button
				className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
				onClick={() => setIsOpen(true)}
			>
				{t('openFilter')}
			</button>

			{/* Вывод выбранных фильтров текстом */}
			{filters && selectedFilters.length > 0 && (
				<div>
					<h3>{t('Chosen filters:')}</h3>
					<ul>
						{selectedFilters.map(filter =>
							filter.optionsIds.map(id => (
								<li key={`${filter.id}-${id}`}>
									{
										filters
											.find(filt => filt.id === filter.id)
											?.options.find(option => option.id === id)?.name
									}
								</li>
							))
						)}
					</ul>
				</div>
			)}

			{/* Модалка */}
			{filters && isOpen && (
				<FilterModal
					isOpen
					onClose={() => setIsOpen(false)}
					filters={filters}
				/>
			)}
		</section>
	)
}

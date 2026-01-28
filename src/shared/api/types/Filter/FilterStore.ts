import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { FilterType } from '@/shared/api/types/Filter'
import { SearchRequestFilter } from '@/shared/api/types/SearchRequest/SearchRequestFilter'

interface FilterStore {
	filters: SearchRequestFilter
	setFilters: (filters: SearchRequestFilter) => void
	toggleOption: (filterId: string, optionId: string) => void
	clearFilters: () => void
}

export const useFilterStore = create(
	persist(
		immer<FilterStore>(set => ({
			filters: [],

			setFilters: filters =>
				set(state => {
					state.filters = filters
				}),

			toggleOption: (filterId, optionId) =>
				set(state => {
					const existing = state.filters.find(filter => filter.id === filterId)

					if (existing) {
						const index = existing.optionsIds.indexOf(optionId)
						if (index > -1) {
							existing.optionsIds.splice(index, 1)
						} else {
							existing.optionsIds.push(optionId)
						}
					} else {
						state.filters.push({
							id: filterId,
							type: FilterType.OPTION,
							optionsIds: [optionId]
						})
					}
				}),

			clearFilters: () =>
				set(state => {
					state.filters = []
				})
		})),
		{ name: 'filter-storage' }
	)
)

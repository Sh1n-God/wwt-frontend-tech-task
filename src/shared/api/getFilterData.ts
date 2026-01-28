import data from '../temp/filterData.json'
import { mapFilterData } from './mapFilterData'
import { FilterChoose } from './types/Filter/index'

export const getFilterData = async (): Promise<FilterChoose[]> => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(mapFilterData(data.filterItems))
		}, 500)
	})
}

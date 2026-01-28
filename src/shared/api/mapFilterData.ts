import { FilterChoose, FilterType } from './types/Filter/index'

interface RawFilter {
	id: string
	name: string
	options: Array<{ id: string; name: string; description?: string }>
}

export const mapFilterData = (items: RawFilter[]): FilterChoose[] => {
	return items.map(item => ({
		...item,
		type: FilterType.OPTION
	}))
}

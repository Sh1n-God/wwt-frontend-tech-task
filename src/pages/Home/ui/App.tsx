import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FilterModal } from './FilterModal'

export const App = () => {
	const { t } = useTranslation()
	const [isOpen, setIsOpen] = useState(false)
	return (
		<section className="w-full h-dvh flex items-center justify-center">
			<button
				className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
				onClick={() => setIsOpen(true)}
			>
				{t('openFilter')}
			</button>
			<pre></pre>
			{isOpen && <FilterModal onClose={() => setIsOpen(false)} />}
		</section>
	)
}

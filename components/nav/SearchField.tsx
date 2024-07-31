'use client'

import { SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const SearchField = () => {
	const [searchInput, setSearchInput] = useState<string | null>(null)
	const router = useRouter()

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (searchInput?.trim())
			router.push('/?search=' + encodeURIComponent(searchInput!))
	}

	return (
		<>
			<form
				onSubmit={handleSubmit}
				className='flex items-center border border-neutral-300 dark:border-white/40  rounded-full gap-2 px-4 py-2 max-w-[350px] w-full'
			>
				<input
					onChange={(e) => setSearchInput(e.target.value)}
					type='text'
					placeholder='What do you want to read ...'
					className='border-none bg-transparent outline-none w-full flex-1'
				/>
				<button type='submit' className='border-none outline-none'>
					<SearchIcon className='size-5 cursor-pointer text-neutral-600 dark:text-white' />
				</button>
			</form>
		</>
	)
}

export default SearchField

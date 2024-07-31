'use client'

import { SearchIcon } from 'lucide-react'
import { useState } from 'react'

const SearchField = () => {
	return (
		<>
			<form className='flex items-center border border-neutral-300 dark:border-white/40  rounded-full gap-2 px-4 py-2 max-w-[350px] w-full'>
				<input
					type='text'
					className='border-none bg-transparent outline-none w-full flex-1'
				/>
				<button className='border-none outline-none'>
					<SearchIcon className='size-5 cursor-pointer text-neutral-600 dark:text-white' />
				</button>
			</form>
		</>
	)
}

export default SearchField

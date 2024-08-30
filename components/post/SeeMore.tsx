'use client'

import { useState } from 'react'

type SeeMoreProps = {
	text: string
	className?: string
}

const SeeMore = ({ text, className }: SeeMoreProps) => {
	const [seeMore, setseeMore] = useState(false)
	return (
		<p
			onClick={() => setseeMore((prev) => !prev)}
			className={`select-none ${className}`}
		>
			{text.length > 100 && !seeMore ? text.slice(0, 100) : text}{' '}
			{text.length > 100 && !seeMore && (
				<span
					onClick={(e) => {
						e.stopPropagation()
						setseeMore((prev) => !prev)
					}}
					className='text-blue-500 ml-1 cursor-pointer text-sm'
				>
					see more ...
				</span>
			)}
		</p>
	)
}

export default SeeMore

'use client'

import { useState } from 'react'
import Markdown from 'react-markdown'
import {formatPostBodyHashtag} from "@/lib/utils";

type SeeMoreProps = {
	text: string
	className?: string
}

const SeeMore = ({ text, className }: SeeMoreProps) => {
	const [seeMore, setSeeMore] = useState(false)
	return (
		<div
			onClick={() => setSeeMore((prev) => !prev)}
			className={`select-none ${className}`}
		>
			{/*{text.length > 100 && !seeMore ? <Markdown>{formatPostBodyHashtag(text.slice(0,100)) + ' ...'}</Markdown> : <Markdown>{formatPostBodyHashtag(text)}</Markdown> }{' '}*/}
			{text.length > 100 && !seeMore ? formatPostBodyHashtag(text.slice(0,100)) :formatPostBodyHashtag(text)  }{' '}
			{text.length > 100 && !seeMore && (
				<span
					onClick={(e) => {
						e.stopPropagation()
						setSeeMore((prev) => !prev)
					}}
					className='text-blue-500 ml-1 cursor-pointer text-sm'
				>
					see more ...
				</span>
			)}
		</div>
	)
}

export default SeeMore

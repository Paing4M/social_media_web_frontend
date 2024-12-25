'use client'

import { useState } from 'react'
import Markdown from 'react-markdown'
import {formatPostBodyHashtag} from "@/lib/utils";
import rehypeRaw from "rehype-raw";

type SeeMoreProps = {
	text: string
	className?: string
}

const CustomText = ({text} : {text: string}) => {
	return <p className='felx flex-wrap w-full'>{formatPostBodyHashtag(text)}</p>
}

const SeeMore = ({ text, className }: SeeMoreProps) => {
	const [seeMore, setSeeMore] = useState(false)


	return (
		<div
			onClick={() => setSeeMore((prev) => !prev)}
			className={`select-none ${className}`}
		>
			{/*{text.length > 100 && !seeMore ? <Markdown rehypePlugins={[rehypeRaw]}  >{formatPostBodyHashtag(text.slice(0,100)) + ' ...' }</Markdown> : <Markdown rehypePlugins={[rehypeRaw]} >{formatPostBodyHashtag(text)}</Markdown> }{' '}*/}

			{text.length > 100 && !seeMore ?
				<Markdown
					skipHtml
					children={formatPostBodyHashtag(text.slice(0, 100)) + ' ...'}
					components={{
						p: ({ node, ...props }) => <p className="flex flex-wrap gap-x-2" {...props} />
					}}
					rehypePlugins={[rehypeRaw]} /> :
				<Markdown
					skipHtml
					children={formatPostBodyHashtag(text)}
					components={{
						p: ({ node, ...props }) => <p className="flex flex-wrap gap-2" {...props} />
					}}
					rehypePlugins={[rehypeRaw]} />
			}

			{text.length > 100 && !seeMore && (
				<span
					onClick={(e) => {
						e.stopPropagation()
						setSeeMore((prev) => !prev)
					}}
					className='text-blue-500 ml-1 cursor-pointer text-sm'
				>
					see more
				</span>
			)}
		</div>
	)
}

export default SeeMore

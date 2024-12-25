import {type ClassValue, clsx} from 'clsx'
import {twMerge} from 'tailwind-merge'
import moment from 'moment'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function isImage(att: PostAttachmentInterface | File) {
	let mime
	if ('mime' in att) {
		mime = att.mime
	} else if ('type' in att) {
		mime = att.type
	}

	const res = mime?.toLowerCase().split('/')
	return res?.[0] === 'image'
}

export function formatDate(date: string): string {
	return moment(date).fromNow()
}

export async function readFile(file: File) {
	return new Promise((res, rej) => {
		if (isImage(file)) {
			const reader = new FileReader()
			reader.onload = () => {
				res(reader.result)
			}
			reader.onerror = rej
			reader.readAsDataURL(file)
		} else {
			res(null)
		}
	})
}

export function formatPostBodyHashtag (body:string){
	return body.replace(/(?:(\s+) | <p>) ((#\w+) (?![^<]*<\/a>))/g, (match, group1, group2) => {
		const encodeGroup = encodeURIComponent(group2)
		return `${group1 || ''}<a href="/search/${encodeGroup}" class="hashtag">${group2}</a>`
	})
}
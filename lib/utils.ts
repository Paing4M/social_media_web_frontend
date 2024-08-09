import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface Att {
	mime?: string
	type?: string
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function isImage(att: Att) {
	const mime = att?.mime || att?.type
	const res = mime?.split('/')
}

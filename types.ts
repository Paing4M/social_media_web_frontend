interface UserInterface {
	id?: number
	name?: string
	email?: string
	username?: string
	avatar_path?: string | null
	cover_path?: string | null
	avatar_url?: string | null
	cover_url?: string | null
	email_verified_at?: string | null
	token?: string | null
	created_at?: string
	updated_at?: string
}

type ApiResponse<T> = {
	data: T
	links?: Links
	meta?: Meta
}

type Post = {
	id: number
	body: string
	group: any | null
	user: UserInterface
	attachments?: PostAttachmentInterface[] | null
	reaction_count: number
	reacted_by_user: boolean
	comments: CommentType[]
	created_at?: string
}

type CommentType = {
	id: number
	user: CmtUserType
	comment: string
	created_at: string
}

type CmtUserType = {
	username: string
	avatar_url: string
}

type Links = {
	first: string | null
	last: string | null
	prev: string | null
	next: string | null
}

type Meta = {
	path: string | null
	per_page: number
	next_cursor: string | null
	prev_cursor: string | null
}

interface PostAttachmentInterface {
	id?: number
	post_id: number
	name: string
	path?: string
	url?: string
	mime?: string
	created_by?: string
	created_at?: string
	updated_at?: string
}

interface QueryDataInterface<T> {
	pageParams: [string] | null
	pages: [ApiResponse<T>]
}

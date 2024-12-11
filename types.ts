interface UserInterface extends  BaseUserInterface{
	token?: string | null
}

interface BaseUserInterface {
	id:number
	name:string
	email:string
	username:string
	avatar_path?:string | null
	cover_path?:string | null
	created_at:string
	avatar_url?: string | null
	cover_url?: string | null
	isFollowedByCurrentUser:boolean | null
}

interface GpUserInterface extends BaseUserInterface {
	userRoleInGroup?:string
}

type ApiResponse<T> = {
	data: T
	links?: Links
	meta?: Meta
}

type Post = {
	id: number
	body: string
	group: PostGroupType
	user: BaseUserInterface
	attachments?: PostAttachmentInterface[] | null
	reaction_count: number
	reacted_by_user: boolean
	comments: CommentType[]
	comment_count: number
	created_at?: string
}

type PostGroupType = {
	id:number ,
	name:string,
	slug:string
}

type CommentType = {
	id: number
	user: CmtUserType
	comment: string
	comments: CommentType[] | []
	reaction_count: number
	reacted_by_user: boolean
	created_at: string
}

type CmtUserType = {
	id: number
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


interface GroupInterface {
	about?: string;
	auto_approval: boolean;
	cover_url?: string;
	created_at: string;
	current_user_role: string;
	id: number;
	name: string;
	slug: string;
	thumbnail_url?: string;
	user_id: number;
	is_current_user_in_group:boolean
	// groupUsers:GpUserInterface[]
	// requestGroupUsers:GpUserInterface[]
}

interface GroupUserInterface {
	id:number
	username:string
	avatar_url:string
	role:string
	status:string
	group_id:number
}

interface GroupProfileInterface {
	group : GroupInterface
	gpUsers:GroupUserInterface[]
	gpRequestUsers:BaseUserInterface[]
	// gpPosts:Post[]
}


import { formatDate } from '@/lib/utils'
import UserAvatar from '../avatar/UserAvatar'

interface PostCommentProps {
	comment: CommentType
}

const PostCommentItem = ({ comment }: PostCommentProps) => {
	return (
		<div className='flex gap-2 items-start mb-2 last-of-type:mb-0'>
			<UserAvatar
				name={comment?.user?.username}
				src={comment?.user?.avatar_url!}
			/>

			<div className='p-3 rounded-md bg-secondary rounded-tl-none w-full'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<h3 className='font-semibold'>{comment?.user?.username}</h3>
						<span className='text-xs'>
							{formatDate(comment?.created_at)}
						</span>
					</div>
				</div>
				<p className='text-sm'>{comment?.comment}</p>
			</div>
		</div>
	)
}

export default PostCommentItem

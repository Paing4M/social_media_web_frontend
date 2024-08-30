import { formatDate } from '@/lib/utils'
import UserAvatar from '../avatar/UserAvatar'
import SeeMore from './SeeMore'

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

				<SeeMore text={comment?.comment!} className='text-sm' />
			</div>
		</div>
	)
}

export default PostCommentItem

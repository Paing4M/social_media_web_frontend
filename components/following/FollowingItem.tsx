import Link from 'next/link'
import UserAvatar from '../avatar/UserAvatar'

type FollowingItemProps = {
	user:BaseUserInterface
}

const FollowingItem = ({user}:FollowingItemProps) => {
	return (
		<Link href={'/profile/' + user.username} className='flex items-center gap-x-3'>
			<UserAvatar name={user.username} src={user.avatar_url!} />
			<h4 className='text-[16px] tracking-wide'>{user.username}</h4>
		</Link>
	)
}

export default FollowingItem

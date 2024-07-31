import Link from 'next/link'
import UserAvatar from '../avatar/UserAvatar'

const FollowingItem = () => {
	return (
		<Link href={'/'} className='flex items-center gap-x-2'>
			<UserAvatar name='test' />

			<h4 className='text-[16px] tracking-wide'>Title</h4>
		</Link>
	)
}

export default FollowingItem

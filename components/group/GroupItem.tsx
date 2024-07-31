import Link from 'next/link'
import UserAvatar from '../avatar/UserAvatar'

const GroupItem = () => {
	return (
		<Link href={'/'} className='flex items-start gap-x-3'>
			<UserAvatar name='test' />
			<div>
				<h4 className='text-[16px] tracking-wide'>Title</h4>
				<p className='text-sm leading-4 text-muted-foreground'>
					Lorem ipsum dolor sit amet consectetur adipisicing elit.{' '}
				</p>
			</div>
		</Link>
	)
}

export default GroupItem

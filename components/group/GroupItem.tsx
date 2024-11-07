import Link from 'next/link'
import UserAvatar from '../avatar/UserAvatar'
import group from "@/components/group/Group";

interface GroupItemProps {
	group:GroupInterface
}

const GroupItem = ({group}:GroupItemProps) => {
	return (
		<Link href={'/group/' + group.slug} className='flex items-start gap-x-3'>
			<UserAvatar name={group.name!} />
			<div>
				<h4 className='text-[16px] tracking-wide'>{group.name}</h4>
				<p className='text-xs leading-4 text-muted-foreground'>
					{group.about}{' '}
				</p>
			</div>
		</Link>
	)
}

export default GroupItem

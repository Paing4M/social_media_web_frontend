import { BellIcon, HomeIcon } from 'lucide-react'
import Link from 'next/link'

interface SidebarProps {
	className?: string
}

const Sidebar = ({ className }: SidebarProps) => {
	return (
		<div className={className}>
			<Link href={'/'} className='flex items-center gap-2 p-2'>
				<HomeIcon className='size-5' />
				<span className='hidden sm:inline-block'>Home</span>
			</Link>

			<Link href={'/notifications'} className='flex items-center gap-2 p-2'>
				<BellIcon className='size-5' />
				<span className='hidden sm:inline-block'>Notificatios</span>
			</Link>

			<Link href={'/'} className='flex items-center gap-2 p-2'>
				<HomeIcon className='size-5' />
				<span className='hidden sm:inline-block'>Home</span>
			</Link>
		</div>
	)
}

export default Sidebar

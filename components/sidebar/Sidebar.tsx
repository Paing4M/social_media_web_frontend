import { HomeIcon } from 'lucide-react'
import Link from 'next/link'

interface SidebarProps {
	className?: string
}

const Sidebar = ({ className }: SidebarProps) => {
	return (
		<div className={className}>
			<Link href={'/'} className='flex items-center gap-2 px-2 py-1 '>
				<HomeIcon className='size-5' />
				<span className=''>Home</span>
			</Link>
		</div>
	)
}

export default Sidebar

import Image from 'next/image'
import UserDropdown from './UserDropdown'
import Link from 'next/link'

const Navbar = () => {
	return (
		<div className=' h-[80px] border-b shadow-md bg-white'>
			<div className='mx-auto flex h-full items-center justify-between px-6 max-w-[1366px]'>
				<Link href={'/'} className='text-xl font-semibold tracking-wide'>
					Social
				</Link>
				<div>
					<UserDropdown />
				</div>
			</div>
		</div>
	)
}

export default Navbar

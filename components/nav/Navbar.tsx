import Image from 'next/image'
import UserDropdown from './UserDropdown'
import Link from 'next/link'
import SearchField from './SearchField'

const Navbar = () => {
	return (
		<div className='h-auto xs:h-[70px] border-b shadow-md bg-background z-[20] sticky top-0'>
			<div className='py-3 xs-py-0 mx-auto flex h-full items-center justify-center flex-wrap xs:flex-nowrap gap-x-4 gap-y-2 px-6 max-w-[1366px] '>
				<Link href={'/'} className='text-xl font-semibold tracking-wide'>
					Social
				</Link>

				<SearchField />

				<div className='sm:ml-auto'>
					<UserDropdown />
				</div>
			</div>
		</div>
	)
}

export default Navbar

import Navbar from '@/components/nav/Navbar'

import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Profile',
	description: 'Profile page.',
}

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<Navbar />
			<div className='max-w-[900px] mx-auto py-5 px-6'>{children}</div>
		</>
	)
}

export default ProfileLayout

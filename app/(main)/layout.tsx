import Navbar from '@/components/nav/Navbar'
import Sidebar from '@/components/sidebar/Sidebar'
import { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
	title: 'Home',
	description: 'Welcome to Social-App.',
}

const MainLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<Navbar />
			<div className='grid grid-cols-12 py-5 px-6'>
				<div className='col-span-3'>
					<Sidebar />
				</div>
				<div className='col-span-6'>{children}</div>
				<div className='col-span-3'>2</div>
			</div>

			<Toaster />
		</>
	)
}

export default MainLayout

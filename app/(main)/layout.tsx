import Navbar from '@/components/nav/Navbar'
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
			{children}

			<Toaster />
		</>
	)
}

export default MainLayout

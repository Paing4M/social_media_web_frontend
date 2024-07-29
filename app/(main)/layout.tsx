import Navbar from '@/components/nav/Navbar'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Home',
	description: 'Welcome to Social-App.',
}

const MainLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<Navbar />
			{children}
		</>
	)
}

export default MainLayout

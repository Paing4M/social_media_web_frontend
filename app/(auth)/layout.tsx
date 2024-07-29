import { Metadata } from 'next'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='w-full flex items-center justify-center min-h-screen bg-secondary'>
			{children}
		</div>
	)
}

export default AuthLayout

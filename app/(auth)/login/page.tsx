import LoginForm from '@/components/auth/LoginForm'

const LoginPage = () => {
	return (
		<div className='w-full bg-background rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 border'>
			<div className='p-6 space-y-1 md:space-y-3 sm:p-8'>
				<h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
					Login to your account
				</h1>

				<LoginForm />
			</div>
		</div>
	)
}

export default LoginPage

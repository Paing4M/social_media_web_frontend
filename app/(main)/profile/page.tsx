import { auth } from '@/app/api/auth/[...nextauth]/auth'
import ProfileUserInfo from '@/components/profile/ProfileUserInfo'

const ProfilePage = async () => {
	const session = await auth()

	return (
		<div className='px-6'>
			<div className='py-6 w-full max-w-[800px] mx-auto'>
				<ProfileUserInfo user={session?.user!} />
			</div>
		</div>
	)
}

export default ProfilePage

import { auth } from '@/app/api/auth/[...nextauth]/auth'
import ProfileContainer from '@/components/profile/ProfileContainer'
import axios from 'axios'

interface ProfileParams {
	params: { username?: string }
}

async function getUser(username: string, token: string) {
	const res = await axios.get(
		process.env.NEXT_PUBLIC_API_URL + '/api/user/' + username,
		{
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
			},
		}
	)
	return res.data
}

const ProfilePage = async ({ params }: ProfileParams) => {
	const session = await auth()
	const user = await getUser(params?.username!, session?.user.token!)

	if (!user && !session) return

	return (
		<>
			<ProfileContainer username={params?.username!} user={user!} />
		</>
	)
}

export default ProfilePage

import { auth } from '@/app/api/auth/[...nextauth]/auth'
import ProfileContainer from '@/components/profile/ProfileContainer'
import axios from 'axios'
import GroupContainer from "@/components/group/GroupContainer";

interface GroupProfileParams {
	params: { slug?: string }
}

async function getGroup(slug: string, token: string) {
	const res = await axios.get(
		process.env.NEXT_PUBLIC_API_URL + '/api/group/' + slug,
		{
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
			},
		}
	)
	return res.data
}

const ProfilePage = async ({ params }: GroupProfileParams) => {
	const session = await auth()
	const group = await getGroup(params?.slug!, session?.user.token!)

	return (
		<>
			<GroupContainer group={group!} />
		</>
	)
}

export default ProfilePage

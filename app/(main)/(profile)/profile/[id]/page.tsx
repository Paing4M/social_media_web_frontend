import ProfileHeader from '@/components/profile/ProfileHeader'

interface ProfileParams {
	params: { id?: string | number }
}

const ProfilePage = ({ params }: ProfileParams) => {
	return (
		<>
			<ProfileHeader id={params?.id!} />
		</>
	)
}

export default ProfilePage

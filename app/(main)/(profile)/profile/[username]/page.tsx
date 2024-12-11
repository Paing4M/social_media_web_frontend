import {auth} from '@/app/api/auth/[...nextauth]/auth'
import ProfileContainer from '@/components/profile/ProfileContainer'


interface ProfileParams {
  params: { username?: string }
}


const ProfilePage = async ({params}: ProfileParams) => {
  const session = await auth()


  if (!session) return

  return (
    <ProfileContainer username={params?.username!}/>
  )
}

export default ProfilePage

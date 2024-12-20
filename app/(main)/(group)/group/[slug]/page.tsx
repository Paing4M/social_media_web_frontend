import { auth } from '@/app/api/auth/[...nextauth]/auth'
import ProfileContainer from '@/components/profile/ProfileContainer'
import axios from 'axios'
import GroupContainer from "@/components/group/GroupContainer";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {getPosts} from "@/actions/post";
import {getGroup} from "@/actions/group";

interface GroupProfileParams {
	params: { slug?: string }
}

// async function getGroup(slug: string, token: string) {
// 	const res = await axios.get(
// 		process.env.NEXT_PUBLIC_API_URL + '/api/group/' + slug,
// 		{
// 			headers: {
// 				Authorization: `Bearer ${token}`,
// 				Accept: 'application/json',
// 			},
// 		}
// 	)
// 	return res.data
// }

const ProfilePage = async ({ params }: GroupProfileParams) => {
	// const session = await auth()

	const queryClient = new QueryClient()

	await queryClient.prefetchQuery({
		queryKey: ['getGpBySlug' , params.slug],
		queryFn:()=>getGroup(params.slug!)
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<GroupContainer slug={params.slug!} />
		</HydrationBoundary>
	)
}

export default ProfilePage

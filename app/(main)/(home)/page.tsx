import PostTextEditor from '@/components/post/PostTextEditor'
import { auth } from '../../api/auth/[...nextauth]/auth'
import PostList from '@/components/post/PostList'
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query'
import { getPosts } from '@/actions/post'

interface SearchParamsInterace {
	search?: string
}

export default async function Home() {
	const session = await auth()

	const queryClient = new QueryClient()

	await queryClient.prefetchQuery({
		queryKey: ['get', 'getPosts'],
		queryFn: () => getPosts(),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PostTextEditor user={session?.user!} />
			<PostList />
		</HydrationBoundary>
	)
}

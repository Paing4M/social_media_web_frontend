import PostTextEditor from '@/components/post/PostTextEditor'
import { auth } from '../../api/auth/[...nextauth]/auth'
import PostList from '@/components/post/PostList'
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query'
import { getPosts } from '@/actions/post'
import { Suspense } from 'react'
import Loading from '@/components/Loading'

interface SearchParamsInterace {
	search?: string
}

export default async function Home({ search }: SearchParamsInterace) {
	const session = await auth()

	const queryClient = new QueryClient()

	await queryClient.prefetchQuery({
		queryKey: ['get', 'getPosts'],
		queryFn: () => getPosts(),
	})

	return (
		<>
			<PostTextEditor user={session?.user!} />
			<HydrationBoundary state={dehydrate(queryClient)}>
				<PostList />
			</HydrationBoundary>
		</>
	)
}

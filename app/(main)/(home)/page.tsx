import PostTextEditor from '@/components/post/PostTextEditor'
import { auth } from '../../api/auth/[...nextauth]/auth'
import PostList from '@/components/post/PostList'

interface SearchParamsInterace {
	search?: string
}

export default async function Home({ searchParams }: SearchParamsInterace) {
	const session = await auth()

	console.log('se', searchParams)

	return (
		<>
			<PostTextEditor user={session?.user!} />
			<PostList />
		</>
	)
}

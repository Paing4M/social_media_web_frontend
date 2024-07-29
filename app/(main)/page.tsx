import { getSession } from 'next-auth/react'
import { auth } from '../api/auth/[...nextauth]/auth'

export default async function Home() {
	const session = await auth()
	console.log('home', { session })
	console.log('home', session?.user.token)

	return <h1>hello</h1>
}

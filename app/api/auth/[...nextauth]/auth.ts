import axios from 'axios'
import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'

declare module 'next-auth' {
	export interface Session {
		user: SessionUser
		expires: string
	}
}

interface SessionUser extends UserInterface {
	token?: string | null
}

export const { auth, handlers, signIn, signOut } = NextAuth({
	pages: {
		signIn: '/login',
	},

	// provider
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: {},
				password: {},
			},

			async authorize(credentials) {
				try {
					const res = await axios.post(
						process.env.NEXT_PUBLIC_API_URL + '/api/login',
						credentials
					)

					// console.log(res?.data?.data)

					if (res?.data?.data) {
						return res?.data?.data
					} else {
						return null
					}
				} catch (error) {
					console.log('err>>', error)
				}
			},
		}),
	],

	// callback
	callbacks: {
		// jwt
		async jwt({ user, token, trigger, session }) {
			// update session
			if (trigger === 'update' && session) {
				const user = {
					...(token.user as object),
					...session,
				} as SessionUser

				token = { ...token, user: user }
			}

			if (user) {
				token.user = user
			}

			return token
		},

		// session
		async session({
			token,
			user,
			session,
		}: {
			token: JWT
			user: any
			session: any
		}) {
			session.user = token.user as SessionUser
			return session
		},

		// authorized({ req, auth }) {
		// 	return !!auth
		// },
	},
})

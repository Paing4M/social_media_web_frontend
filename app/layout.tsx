import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import { SessionProvider } from 'next-auth/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: {
		template: 'Social-App | %s',
		default: 'Social-App',
	},
	description: 'Welcome to Social-App.',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body
				className={inter.className + ' bg-primary-foreground'}
				suppressHydrationWarning
			>
				<ReactQueryProvider>
					<SessionProvider>{children}</SessionProvider>
				</ReactQueryProvider>
			</body>
		</html>
	)
}

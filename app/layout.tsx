import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import MainProvider from '@/providers/MainProvider'
import { Toaster } from 'react-hot-toast'

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
				className={inter.className + ' bg-muted h-full'}
				suppressHydrationWarning
			>
				<MainProvider>{children}</MainProvider>
				<Toaster />
			</body>
		</html>
	)
}

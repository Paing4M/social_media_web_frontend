'use client'

import { Toaster } from 'react-hot-toast'
import AuthProvider from './AuthProvider'
import ReactQueryProvider from './ReactQueryProvider'
import { ThemeProvider } from './ThemeProvider'

const MainProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<AuthProvider>
			<ReactQueryProvider>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</ReactQueryProvider>
			<Toaster />
		</AuthProvider>
	)
}

export default MainProvider

'use client'

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
		</AuthProvider>
	)
}

export default MainProvider

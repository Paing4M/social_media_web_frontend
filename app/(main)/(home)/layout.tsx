import Following from '@/components/following/Following'
import Group from '@/components/group/Group'
import Navbar from '@/components/nav/Navbar'
import { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import React from "react";
import {auth} from "@/app/api/auth/[...nextauth]/auth";

export const metadata: Metadata = {
	title: 'Home',
	description: 'Welcome to Social-App.',
}

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
	
	const session = await auth()

	if (!session) return

	return (
		<>
			<Navbar />
			<div className='max-w-[1366px] mx-auto grid grid-cols-12 gap-3 py-5 px-6'>
				<div className='hidden md:block col-span-5 lg:col-span-3 '>
					<Group />
				</div>

				<div className='col-span-12 md:col-span-7 lg:col-span-6 '>
					{children}
				</div>

				<div className='hidden lg:block col-span-3 '>
					<Following username={session?.user.username} />
				</div>
			</div>

			<Toaster />
		</>
	)
}

export default MainLayout

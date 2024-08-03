'use client'

import Image from 'next/image'
import UserAvatar from '../avatar/UserAvatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import ProfileUserInfo from './ProfileUserInfo'
import { useSession } from 'next-auth/react'
import { ImageIcon, PencilIcon } from 'lucide-react'
import { Button } from '../ui/button'

interface ProfileHeaderProps {
	id: string | number
	user: UserInterface
}

const ProfileHeader = ({ id, user }: ProfileHeaderProps) => {
	const { data } = useSession()

	if (!data) return

	return (
		<>
			<div className='relative'>
				<Image
					src='https://images.unsplash.com/photo-1722232581651-d87e4099561b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8'
					width={1366}
					height={200}
					className='w-full h-[300px] object-cover rounded-t-lg'
					alt='user-cover-img'
				/>

				<button className='flex items-center gap-2 outline-none border-none uppercase text-xs tracking-wide absolute top-4 right-4 px-3 py-2 bg-muted rounded-md hover:bg-muted/80 shadow-sm'>
					<ImageIcon className='size-4' />
					Update Cover Image
				</button>
			</div>

			<Tabs
				defaultValue={data?.user.id === id ? 'about' : 'posts'}
				className='flex flex-col gap-y-5'
			>
				<div className='bg-background shadow-sm rounded-b-lg relative  px-6'>
					<div className='border-b'>
						<div className='absolute top-[-40px] shadow-sm  rounded-full border'>
							<UserAvatar profile size='xl' name='hello' />
						</div>
						<div className='flex items-center p-2 justify-between'>
							<h2 className='text-xl font-bold ml-24'>Hello</h2>

							<Button className='uppercase flex items-center gap-2 tracking-wide'>
								<PencilIcon className='size-4' />
								edit profile
							</Button>
						</div>
					</div>

					<div className='mt-2 pb-4'>
						<TabsList className='flex items-center gap-1'>
							{data?.user?.id == id && (
								<TabsTrigger
									value='about'
									className='px-4 py-1 data-[state=active]:border-b-2  data-[state=active]:border-blue-400 data-[state=active]:text-blue-400'
								>
									About
								</TabsTrigger>
							)}

							<TabsTrigger
								value='posts'
								className='px-4 py-1 data-[state=active]:border-b-2  data-[state=active]:border-blue-400 data-[state=active]:text-blue-400'
							>
								Posts
							</TabsTrigger>

							<TabsTrigger
								value='followers'
								className='px-4 py-1 data-[state=active]:border-b-2  data-[state=active]:border-blue-400 data-[state=active]:text-blue-400'
							>
								Followers
							</TabsTrigger>

							<TabsTrigger
								value='followings'
								className='px-4 py-1 data-[state=active]:border-b-2  data-[state=active]:border-blue-400 data-[state=active]:text-blue-400'
							>
								Followings
							</TabsTrigger>

							<TabsTrigger
								value='photos'
								className='px-4 py-1 data-[state=active]:border-b-2  data-[state=active]:border-blue-400 data-[state=active]:text-blue-400'
							>
								Photos
							</TabsTrigger>
						</TabsList>
					</div>
				</div>

				{data?.user?.id == id && (
					<TabsContent value='about'>
						<ProfileUserInfo user={data?.user!} />
					</TabsContent>
				)}

				<TabsContent value='posts'>posts</TabsContent>
				<TabsContent value='followers'>followers</TabsContent>
				<TabsContent value='followings'>followings</TabsContent>
				<TabsContent value='photos'>photos</TabsContent>
			</Tabs>
		</>
	)
}

export default ProfileHeader

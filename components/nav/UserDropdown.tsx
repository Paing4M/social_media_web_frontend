'use client'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'
import { signOut, useSession } from 'next-auth/react'
import UserAvatar from '../avatar/UserAvatar'
import Link from 'next/link'

const UserDropdown = () => {
	const { useLogoutMutation } = useAuth()
	const { mutateAsync } = useLogoutMutation()
	const { data } = useSession()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		console.log('logout')

		try {
			await mutateAsync(undefined, {
				onSuccess: (res) => {
					console.log(res)
					if (res.status === 200) {
						signOut({ callbackUrl: '/login' })
					}
				},
			})
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className='outline-none border-none'>
				<UserAvatar
					src={data?.user?.avatar_path!}
					name={data?.user?.name!}
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-36'>
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<Link href={'/profile'}>Profile</Link>
					</DropdownMenuItem>

					<DropdownMenuItem>
						<form onSubmit={handleSubmit} action=''>
							<button type='submit'>Logout</button>
						</form>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default UserDropdown

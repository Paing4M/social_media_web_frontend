'use client'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'
import { signOut, useSession } from 'next-auth/react'
import UserAvatar from '../avatar/UserAvatar'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import {
	CheckIcon,
	LogOutIcon,
	MonitorCogIcon,
	MoonIcon,
	SettingsIcon,
	SunIcon,
	UserIcon,
} from 'lucide-react'

const UserDropdown = () => {
	const { useLogoutMutation } = useAuth()
	const { mutateAsync } = useLogoutMutation()
	const { data } = useSession()
	const { theme, setTheme } = useTheme()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

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
					src={data?.user?.avatar_url!}
					name={data?.user?.username!}
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='min-w-fit'>
				<DropdownMenuLabel asChild>
					<p className='tracking-wide font-normal'>
						Logged in as{' '}
						<span className='font-semibold'>{data?.user?.username}</span>
					</p>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link
							className='flex cursor-pointer items-center gap-2'
							href={'/profile/' + data?.user?.username}
						>
							<UserIcon className='size-4' />
							Profile
						</Link>
					</DropdownMenuItem>

					<DropdownMenuSub>
						<DropdownMenuSubTrigger className='flex items-center gap-2'>
							<SettingsIcon className='size-4' />
							Theme
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuItem
									onClick={() => setTheme('system')}
									className='flex items-center justify-between'
								>
									<div className='flex gap-x-2 items-center'>
										<MonitorCogIcon className='text-neutral-700 dark:text-white size-4' />
										System
									</div>
									{theme === 'system' && (
										<CheckIcon className='size-4' />
									)}
								</DropdownMenuItem>

								<DropdownMenuItem
									onClick={() => setTheme('light')}
									className='flex items-center justify-between'
								>
									<div className='flex gap-x-2 items-center'>
										<SunIcon className='text-neutral-700 dark:text-white size-4' />
										Light
									</div>
									{theme === 'light' && (
										<CheckIcon className='size-4' />
									)}
								</DropdownMenuItem>

								<DropdownMenuItem
									onClick={() => setTheme('dark')}
									className='flex items-center justify-between'
								>
									<div className='flex gap-x-2 items-center'>
										<MoonIcon className='text-neutral-700 dark:text-white size-4' />
										Dark
									</div>
									{theme === 'dark' && (
										<CheckIcon className='size-4' />
									)}
								</DropdownMenuItem>
								<DropdownMenuSeparator />
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>

					<DropdownMenuSeparator />

					<DropdownMenuItem>
						<form
							onSubmit={handleSubmit}
							className='flex items-center gap-2'
							action=''
						>
							<LogOutIcon className='size-4' />
							<button type='submit'>Logout</button>
						</form>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default UserDropdown

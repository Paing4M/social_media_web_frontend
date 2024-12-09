'use client'

import { useState } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { ChangeProfile } from '@/actions/profile'
import { useProfile } from '@/hooks/useProfile'
import InputError from '@/app/(auth)/InputError'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

interface ProfileUserInfoProps {
	user: UserInterface
}

type Error = ChangeProfile

const ProfileUserInfo: React.FC<ProfileUserInfoProps> = ({ user }) => {
	const [data, setData] = useState<ChangeProfile>({
		name: user?.name,
		username: user?.username,
	})
	const [errors, setErrors] = useState<Error | null>(null)

	const { useProfileInfoMutation } = useProfile()
	const { mutateAsync, isPending } = useProfileInfoMutation()
	const { update } = useSession()
	const router = useRouter()

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (
			data.name?.trim() == user.name &&
			data.username?.trim() == user.username
		)
			return

		try {
			await mutateAsync(data, {
				onSuccess: (res) => {
					// console.log(res)
					if (res?.status === 200) {
						toast.success(res?.message)
						update(res?.user)
						setErrors(null)
						router.push(`/profile/${res.user.username}`)
					}
				},
				onError: (err: any) => {
					// console.log(err)
					if (err?.response.status === 422) {
						setErrors(err?.response?.data?.errors)
					}
				},
			})
		} catch (error) {
			return error
		}
	}

	return (
		<div className='rounded-md border shadow-md bg-background p-4 '>
			<h2 className='text-lg font-semibold '>User Info</h2>
			<p className='text-sm text-neutral-400'>
				Change your user information here.
			</p>
			<div className='mt-4'>
				<form onSubmit={handleSubmit} className='space-y-3'>
					<div>
						<Label htmlFor='name'>Name</Label>
						<Input
							onChange={handleInput}
							id='name'
							name='name'
							value={data?.name!}
						/>
						{errors?.name && <InputError error={errors?.name?.[0]} />}
					</div>

					<div>
						<Label htmlFor='username'>Username</Label>
						<Input
							onChange={handleInput}
							id='username'
							name='username'
							value={data?.username!}
						/>
						{errors?.username && (
							<InputError error={errors?.username?.[0]} />
						)}
					</div>

					{/* <div>
						<Label htmlFor='email'>Email (email cannot be changed)</Label>
						<Input disabled id='email' name='email' value={user?.email} />
					</div> */}

					<div>
						<Button
							disabled={isPending}
							type='submit'
							className={`min-w-[140px] ${
								isPending
									? 'bg-primary'
									: 'bg-primary dark:bg-accent text-white'
							}`}
						>
							Save
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default ProfileUserInfo

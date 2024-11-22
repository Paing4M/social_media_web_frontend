'use client'

import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { CheckIcon, ImageIcon, XIcon } from 'lucide-react'
import React, { useState } from 'react'
import ProfileTabs from './ProfileTabs'
import { useProfile } from '@/hooks/useProfile'
import InputError from '@/app/(auth)/InputError'
import ProfileUserInfo from './ProfileUserInfo'
import toast from 'react-hot-toast'

interface ProfileContainerProps {
	username: string | number
	user: UserInterface
}

interface Error {
	avatar: [string] | null
	cover: [string] | null
}

function Btn({
	children,
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			{...props}
			className={`outline-none border-none text-xs tracking-wide  px-3 cursor-pointer py-2 bg-muted rounded-md hover:bg-muted/80 flex items-center gap-1 shadow-sm ${props.className}`}
		>
			{children}
		</button>
	)
}
const ProfileContainer = ({ username, user }: ProfileContainerProps) => {
	const [coverFile, setCoverFile] = useState<File | null>(null)
	const [coverUrl, setCoverUrl] = useState<string | null>(null)
	const [avatarFile, setAvatarFile] = useState<File | null>(null)
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

	const { data, update } = useSession()
	const { useProfileImageMutation } = useProfile()
	const { mutateAsync, isPending } = useProfileImageMutation()
	const [errors, setErrors] = useState<Error | null>(null)

	if (!data) return

	const handleUpload = (
		e: React.ChangeEvent<HTMLInputElement>,
		setUrl: (url: string) => void,
		setFile: (file: File) => void
	) => {
		let file = e?.target?.files?.[0]
		let reader = new FileReader()

		if (file) {
			setFile(file)
			reader.onload = () => {
				let url = reader.result as string
				setUrl(url)
			}
			reader.readAsDataURL(file)
		}
	}

	async function handleSubmit() {
		try {
			await mutateAsync(
				{ cover: coverFile, avatar: avatarFile },
				{
					onSuccess: async (res) => {
						// console.log('success', res)
						await update(res?.user)
						clearAvatar()
						clearCover()
						toast.success(res?.message)
					},
				}
			)
		} catch (err: any) {
			console.log(err)
			if (err?.response?.status == 422) {
				setErrors(err?.response?.data?.errors)
			}
		}
	}

	function clearCover() {
		setCoverUrl(null)
		setCoverFile(null)
	}

	function clearAvatar() {
		setAvatarUrl?.(null)
		setAvatarFile?.(null)
	}

	return (
		<>
			<div className='relative'>
				<div className='rounded-t-lg bg-background'>
					{errors?.avatar ||
						(errors?.cover && (
							<InputError
								error={errors?.avatar?.[0] || errors?.cover?.[0]}
							/>
						))}
					<Image
						src={
							coverUrl ||
							(data?.user.username === user.username
								? data?.user?.cover_url!
								: user.cover_url!) ||
							'/assets/default-cover.jpg'
						}
						priority={false}
						width={1366}
						height={200}
						className='w-full h-[300px] object-cover rounded-t-lg'
						alt='user-cover-img'
					/>
				</div>

				{user?.username === data?.user?.username && (
					<>
						{!coverUrl && (
							<label
								htmlFor='cover_img'
								className='flex items-center gap-2 outline-none border-none uppercase text-xs tracking-wide absolute top-4 right-4 px-3 cursor-pointer py-2 bg-muted rounded-md hover:bg-muted/80 shadow-sm'
							>
								<ImageIcon className='size-4' />
								Choose Cover Image
								<input
									onChange={(e) =>
										handleUpload(e, setCoverUrl, setCoverFile)
									}
									type='file'
									id='cover_img'
									hidden
								/>
							</label>
						)}

						{coverUrl && (
							<div className='absolute top-4 right-4'>
								<Btn
									onClick={clearCover}
									className='!bg-destructive !hover:bg-destructive/80 text-white'
								>
									<XIcon className='size-4' />
									Cancel
								</Btn>
							</div>
						)}
					</>
				)}
			</div>

			<ProfileTabs
				data={data}
				user={user}
				handleUpload={handleUpload}
				avatarUrl={avatarUrl}
				setAvatarUrl={setAvatarUrl}
				setAvatarFile={setAvatarFile}
				onSubmit={handleSubmit}
				loading={isPending}
				clearAvatar={clearAvatar}
			/>
		</>
	)
}

export default ProfileContainer

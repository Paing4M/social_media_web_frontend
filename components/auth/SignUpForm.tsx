'use client'

import { SignUpData } from '@/actions/auth'
import InputError from '@/app/(auth)/InputError'
import { useAuth } from '@/hooks/useAuth'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'

interface ErrorInterface {
	name?: string[]
	email?: string[]
	password?: string[]
}

const SignUpForm = () => {
	const [data, setData] = useState<SignUpData | null>(null)
	const [errors, setErrors] = useState<ErrorInterface | null>(null)
	const { useSignUpMutation } = useAuth()
	const { mutateAsync, isPending } = useSignUpMutation()

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setData(
			(prevData) =>
				({
					...prevData,
					[e.target.name]: e.target.value,
				} as SignUpData)
		)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		try {
			await mutateAsync(data!, {
				onSuccess: (res) => {
					if (res.status == 200) {
						setErrors(null)
						signIn('credentials', {
							email: res.data.email,
							password: data?.password,
							callbackUrl: '/',
						})
					}
				},
			})
		} catch (err: any) {
			// console.log(err)
			if (err?.response?.status == 422) {
				setErrors(err?.response?.data?.errors)
			}
		}
	}

	return (
		<form onSubmit={handleSubmit} className='space-y-1 md:space-y-3'>
			<div>
				<label
					htmlFor='name'
					className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
				>
					Name
				</label>
				<input
					onChange={handleInput}
					type='text'
					name='name'
					id='name'
					className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
					placeholder='name'
				/>
				{errors?.name && <InputError error={errors?.name[0]} />}
			</div>

			<div>
				<label
					htmlFor='email'
					className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
				>
					Email
				</label>
				<input
					onChange={handleInput}
					type='text'
					name='email'
					id='email'
					className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
					placeholder='name@company.com'
				/>
				{errors?.email && <InputError error={errors?.email[0]} />}
			</div>
			<div>
				<label
					htmlFor='password'
					className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
				>
					Password
				</label>
				<input
					onChange={handleInput}
					type='password'
					name='password'
					id='password'
					placeholder='••••••••'
					className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
				/>
				{errors?.password && <InputError error={errors?.password[0]} />}
			</div>
			<div>
				<label
					htmlFor='password_confirmation'
					className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
				>
					Confirm Password
				</label>
				<input
					onChange={handleInput}
					type='password'
					name='password_confirmation'
					id='password_confirmation'
					placeholder='••••••••'
					className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
				/>
			</div>

			<button
				disabled={isPending}
				type='submit'
				className={`w-full  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
					isPending ? 'bg-secondary/80' : 'bg-secondary'
				}`}
			>
				{isPending ? 'Processing...' : 'Sign Up'}
			</button>
			<p className='text-sm font-light text-gray-500 dark:text-gray-400'>
				Already have an account yet?{' '}
				<Link
					href='/login'
					className='font-medium text-primary-600 hover:underline dark:text-primary-500'
				>
					Login
				</Link>
			</p>
		</form>
	)
}

export default SignUpForm

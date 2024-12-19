'use client'

import {SearchIcon} from 'lucide-react'
import {useRouter, useSearchParams} from 'next/navigation'
import React, {useEffect, useState} from 'react'

const SearchField = () => {
  const searchParam = useSearchParams()
  const [searchInput, setSearchInput] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    setSearchInput(searchParam.get('search'))
  }, [searchParam])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput?.trim()) {
      router.push('/?search=' + encodeURIComponent(searchInput!))
    } else {
      router.push('/')
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className='flex items-center border border-neutral-300 dark:border-white/40  rounded-full gap-2 px-4 py-2 max-w-[350px] w-full'
      >
        <input
          value={searchInput! || ''}
          onChange={(e) => setSearchInput(e.target.value)}
          type='text'
          placeholder='What do you want to read ...'
          className='border-none bg-transparent outline-none w-full flex-1'
        />
        <button type='submit' className='border-none outline-none'>
          <SearchIcon className='size-5 cursor-pointer text-neutral-600 dark:text-white'/>
        </button>
      </form>
    </>
  )
}

export default SearchField

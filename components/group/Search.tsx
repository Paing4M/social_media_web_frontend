import React from 'react'

interface SearchProps {
  handleSearchUser: (e:React.ChangeEvent<HTMLInputElement>) => void
}

const Search = ({handleSearchUser}:SearchProps) => {
  return (
    <div className={'w-full mb-4'}>
      <input onChange={handleSearchUser} type="text" placeholder={'Search user'}
             className={'px-4 py-2 rounded-md w-full'}/>
    </div>
  )
}
export default Search

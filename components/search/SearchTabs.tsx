import React from 'react'
import {Tabs, TabsList, TabsTrigger} from "@radix-ui/react-tabs";

const SearchTabs = () => {
  return (
    <Tabs defaultValue='posts' className='bg-background shadow-md rounded-lg py-2 px-4'>
      <TabsList className='flex w-full items-center flex-wrap gap-1 justify-around'>

          <TabsTrigger
            value='posts'
            className='px-4 py-1 data-[state=active]:border-b-2  data-[state=active]:border-blue-400 data-[state=active]:text-blue-400'
          >
            Posts
          </TabsTrigger>


        <TabsTrigger
          value='users'
          className='px-4 py-1 data-[state=active]:border-b-2  data-[state=active]:border-blue-400 data-[state=active]:text-blue-400'
        >
          Users
        </TabsTrigger>

        <TabsTrigger
          value='groups'
          className='px-4 py-1 data-[state=active]:border-b-2  data-[state=active]:border-blue-400 data-[state=active]:text-blue-400'
        >
          Groups
        </TabsTrigger>


      </TabsList>
    </Tabs>
  )
}
export default SearchTabs

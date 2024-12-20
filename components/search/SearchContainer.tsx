import {Tabs, TabsContent, TabsList, TabsTrigger} from "@radix-ui/react-tabs";
import PostList from "@/components/post/PostList";
import React from "react";

type SearchContainerProps = {
  search?: string
}

const SearchContainer = ({search}: SearchContainerProps) => {
  return (
    <div>
      <Tabs defaultValue='posts'>
        <div className='w-full'>
          <TabsList
            className='bg-background shadow-md rounded-lg py-2 px-4 flex w-full items-center flex-wrap gap-1 justify-around'>

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
        </div>


        <div className='mt-4'>
          <TabsContent value='posts'>
            <PostList search={search}/>
          </TabsContent>

        </div>
      </Tabs>
    </div>
  )
}
export default SearchContainer

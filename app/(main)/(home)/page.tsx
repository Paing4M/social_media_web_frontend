import PostTextEditor from '@/components/post/PostTextEditor'
import {auth} from '../../api/auth/[...nextauth]/auth'
import PostList from '@/components/post/PostList'
import PostSearchContainer from "@/components/post/PostSearchContainer";


interface PageProps {
  searchParams: {
    search: string
  }
}

export default async function Home({searchParams}: PageProps) {
  const session = await auth()
  console.log(searchParams)


  return (
    <>
      {searchParams?.search ?
        <PostSearchContainer search={searchParams.search}/>
        :
        <>
          <PostTextEditor user={session?.user!}/>
          <div className='mt-5'>
            <PostList/>
          </div>
        </>
      }

    </>
  )
}

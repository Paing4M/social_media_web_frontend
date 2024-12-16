import PostTextEditor from '@/components/post/PostTextEditor'
import {auth} from '../../api/auth/[...nextauth]/auth'
import PostList from '@/components/post/PostList'


interface SearchParamsInterace {
  search?: string
}

export default async function Home() {
  const session = await auth()


  return (
    <>
      <PostTextEditor user={session?.user!}/>
      <div className='mt-5'>
        <PostList/>
      </div>
    </>
  )
}

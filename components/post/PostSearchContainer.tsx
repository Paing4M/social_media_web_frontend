import PostList from "@/components/post/PostList";

type PostSearchContainerProps = {
  search?:string
}

const PostSearchContainer = ({search}:PostSearchContainerProps) => {
  return (
    <div>
      <PostList search={search}/>
    </div>
  )
}
export default PostSearchContainer

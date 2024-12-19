import PostList from "@/components/post/PostList";
import SearchTabs from "@/components/search/SearchTabs";

type SearchContainerProps = {
  search?: string
}

const SearchContainer = ({search}: SearchContainerProps) => {
  return (
    <div className='space-y-4'>
      <SearchTabs/>


      <PostList search={search}/>
    </div>
  )
}
export default SearchContainer

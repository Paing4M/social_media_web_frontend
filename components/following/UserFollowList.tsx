import UserFollowItem from "@/components/following/UserFollowItem";

type UserFollowListProps = {
  data:BaseUserInterface[]
}


const UserFollowList = ({data}:UserFollowListProps) => {
  return (
    <div className='grid grid-col-1 md:grid-cols-2 gap-2'>
      {data.map(user => (
        <UserFollowItem key={`${user.id}-${user.username}`} data={user}/>
      ))}
    </div>
  )
}
export default UserFollowList

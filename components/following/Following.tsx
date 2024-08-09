import { Input } from '../ui/input'
import FollowerItem from './FollowingItem'

const Following = () => {
	return (
		<div className='sticky top-[calc(70px+1.3rem)] bg-background p-4 rounded-lg shadow-sm border flex flex-col overflow-hidden h-fit max-h-[400px] gap-y-2 '>
			<h2 className='text-xl font-semibold'>Following</h2>

			<div>
				<Input type='text' className='py-1 ' placeholder='Search ...' />
			</div>

			<div className='mt-4 flex flex-col gap-y-2 overflow-y-auto'>
				<FollowerItem />
				<FollowerItem />
				<FollowerItem />
				<FollowerItem />
				<FollowerItem />
			</div>
		</div>
	)
}

export default Following

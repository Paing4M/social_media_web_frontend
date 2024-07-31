import { Input } from '../ui/input'
import GroupItem from './GroupItem'

const Group = () => {
	return (
		<div className='bg-background sticky top-[calc(70px+1.25rem)] p-4 rounded-lg shadow-sm border flex flex-col overflow-hidden h-fit max-h-[400px] gap-y-2 '>
			<h2 className='text-xl font-semibold'>My Groups</h2>

			<div>
				<Input
					type='text'
					className='py-1 '
					placeholder='Search group ...'
				/>
			</div>

			<div className='mt-4 flex flex-col gap-y-2 overflow-y-auto'>
				<GroupItem />
				<GroupItem />
				<GroupItem />
				<GroupItem />
				<GroupItem />
			</div>
		</div>
	)
}

export default Group

import { Input } from '../ui/input'
import { Label } from '../ui/label'

interface ProfileUserInfoProps {
	user: UserInterface
}

const ProfileUserInfo: React.FC<ProfileUserInfoProps> = ({ user }) => {
	return (
		<div className='rounded-md border shadow-md bg-white p-4 '>
			<h2 className='text-lg font-semibold '>User Info</h2>
			<p className='text-sm text-neutral-400'>
				Change your user information here.
			</p>
			<div className='mt-4'>
				<form action='' className='space-y-3'>
					<div>
						<Label htmlFor='name'>Name</Label>
						<Input id='name' name='name' value={user?.name} />
					</div>

					<div>
						<Label htmlFor='username'>Username</Label>
						<Input id='username' name='name' value={user?.username} />
					</div>

					<div>
						<Label htmlFor='email'>Email (email cannot be changed)</Label>
						<Input disabled id='email' name='email' value={user?.email} />
					</div>

					<div>
						<button
							type='submit'
							className='bg-primary py-2 px-4 min-w-[140px] rounded-md text-white'
						>
							Save
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default ProfileUserInfo

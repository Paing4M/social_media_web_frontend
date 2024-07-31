import UserAvatar from '../avatar/UserAvatar'

const PostItem = () => {
	return (
		<div className='p-4 rounded-lg bg-background shadow-sm border'>
			<div className='flex items-start gap-3'>
				<UserAvatar name='banana' />
				<div>
					<h3 className='text-[16px] font-semibold tracking-wide '>
						Banana
					</h3>
					<p className='text-muted-foreground text-[13px] leading-4'>
						2024, 03, 01
					</p>
				</div>
			</div>

			<p className='mt-2'>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam eius
				voluptas incidunt illum! Commodi, necessitatibus facilis, deserunt
				consectetur culpa sed autem expedita, beatae quis placeat fuga
				asperiores nulla esse nostrum?
			</p>
		</div>
	)
}

export default PostItem

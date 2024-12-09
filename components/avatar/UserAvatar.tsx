import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface UserAvatarProps {
	src?: string
	name: string
}

const UserAvatar: React.FC<UserAvatarProps> = ({ src, name = 'md' }) => {
	return (
		<Avatar>
			<AvatarImage src={src} alt='@shadcn' />
			<AvatarFallback className={`border`}>
				{name?.slice(0, 2)}
			</AvatarFallback>
		</Avatar>
	)
}

export default UserAvatar

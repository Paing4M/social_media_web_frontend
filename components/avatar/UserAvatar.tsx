import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface UserAvatarProps {
	src?: string
	name: string
	size?: string
}

const UserAvatar: React.FC<UserAvatarProps> = ({ src, name, size = 'md' }) => {
	return (
		<Avatar className={`${size == 'lg' && 'w-12 h-12'}`}>
			<AvatarImage src={src} alt='@shadcn' />
			<AvatarFallback className={`${size == 'lg' && 'text-lg'} bg-muted`}>
				{name?.slice(0, 2)}
			</AvatarFallback>
		</Avatar>
	)
}

export default UserAvatar

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface UserAvatarProps {
	src?: string
	name: string
	size?: string
	profile?: boolean
}

const UserAvatar: React.FC<UserAvatarProps> = ({
	src,
	name,
	size = 'md',
	profile,
}) => {
	return (
		<Avatar
			className={`${size == 'lg' && 'w-12 h-12'} ${
				size === 'xl' && 'w-20 h-20'
			}`}
		>
			<AvatarImage src={src} alt='@shadcn' />
			<AvatarFallback
				className={`${size == 'lg' && 'text-lg'} bg-muted ${
					size === 'xl' && 'text-4xl'
				} border `}
			>
				{name?.slice(0, 2)}
			</AvatarFallback>
		</Avatar>
	)
}

export default UserAvatar

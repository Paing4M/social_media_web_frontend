import { cn } from '@/lib/utils'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '../ui/dialog'

interface ModalProps extends React.PropsWithChildren {
	open: boolean
	title?: string
	closeModal: () => void
	className?: string
}

const Modal = ({
	children,
	open,
	closeModal,
	title,
	className,
}: ModalProps) => {
	return (
		<Dialog open={open} onOpenChange={closeModal}>
			<DialogContent
				onInteractOutside={(e) => {
					e.preventDefault()
				}}
				className={cn('overflow-y-auto max-h-screen', className)}
			>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>

					<DialogDescription asChild>{children}</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}

export default Modal

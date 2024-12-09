import { useInView } from 'react-intersection-observer'
import React from "react";

interface InfiniteScrollContainer extends React.PropsWithChildren {
	isOnBottom: () => void
	className: string
}

const InfiniteScrollContainer = ({
	isOnBottom,
	children,
	className,
}: InfiniteScrollContainer) => {
	const { ref } = useInView({
		rootMargin: '200px',
		onChange(inView) {
			if (inView) isOnBottom()
		},
	})

	return (
		<div className={className}>
			{children}
			<div ref={ref} />
		</div>
	)
}

export default InfiniteScrollContainer

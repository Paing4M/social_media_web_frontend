import React from 'react'
import {Button, buttonVariants} from "@/components/ui/button";
import type {VariantProps} from "class-variance-authority";

interface GpButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> , VariantProps<typeof buttonVariants>{
  children?: React.ReactNode
}

const GpButton = ({children, variant = 'default', ...props}: GpButtonProps) => {
  return (
    <Button {...props} variant={variant!}>{children}</Button>
  )
}
export default GpButton

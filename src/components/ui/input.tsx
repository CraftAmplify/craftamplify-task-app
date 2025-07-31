import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "file:text-foreground placeholder:text-gray-250 selection:bg-primary selection:text-primary-foreground border border-gray-250 flex w-full min-w-0 rounded-[7px] !bg-white text-base font-inter font-normal leading-6 shadow-none transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-craft-pink focus-visible:ring-craft-pink/10 focus-visible:ring-2 aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      inputSize: {
        default: "h-9 px-3 py-2",
        sm: "h-8 px-3 py-1.5",
        lg: "h-10 px-3 py-2",
      },
    },
    defaultVariants: {
      inputSize: "default",
    },
  }
)

export type InputVariantProps = VariantProps<typeof inputVariants>

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    InputVariantProps {}

function Input({ className, type, inputSize, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ inputSize, className }))}
      {...props}
    />
  )
}

export { Input }

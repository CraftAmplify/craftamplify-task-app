import { cn } from "@/lib/utils"
import { forwardRef } from "react"

const Typography = {
  h1: forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
      <h1
        ref={ref}
        className={cn("gradient-text font-montserrat text-4xl font-normal leading-9 tracking-tight inline-block", className)}
        {...props}
      />
    )
  ),
  h2: forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
      <h2
        ref={ref}
        className={cn("font-montserrat text-base font-normal text-gray-500 leading-7 tracking-tight", className)}
        {...props}
      />
    )
  ),
  h3: forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
      <h3
        ref={ref}
        className={cn("font-montserrat text-sm font-medium text-gray-500 leading-6", className)}
        {...props}
      />
    )
  ),
  p: forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
      <p
        ref={ref}
        className={cn("text-gray-500", className)}
        {...props}
      />
    )
  ),
  span: forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
    ({ className, ...props }, ref) => (
      <span
        ref={ref}
        className={cn("font-inter text-base leading-6", className)}
        {...props}
      />
    )
  ),
}

Typography.h1.displayName = "Typography.h1"
Typography.h2.displayName = "Typography.h2"
Typography.h3.displayName = "Typography.h3"
Typography.p.displayName = "Typography.p"
Typography.span.displayName = "Typography.span"

export { Typography } 
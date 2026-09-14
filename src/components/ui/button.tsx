import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap rounded-md select-none transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#1E4B8F] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed shadow-none border cursor-pointer [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#D97706] text-white border-[#D97706] hover:bg-[#B45309] hover:border-[#B45309] hover:-translate-y-[1px] active:translate-y-0 active:bg-[#92400E]",
        primary:
          "bg-[#D97706] text-white border-[#D97706] hover:bg-[#B45309] hover:border-[#B45309] hover:-translate-y-[1px] active:translate-y-0 active:bg-[#92400E]",
        secondary:
          "border border-[#1E4B8F] text-[#1E4B8F] bg-transparent hover:bg-[#EFF3FA] hover:-translate-y-[1px] active:translate-y-0",
        outline:
          "border border-[#E8E4DD] bg-[#FFFFFF] text-[#1A1F1D] hover:bg-[#FBF8F3] hover:border-[#D9D3C9] hover:-translate-y-[1px] active:translate-y-0",
        ghost:
          "border-transparent bg-transparent text-[#1A1F1D] hover:bg-[#FBF8F3] hover:-translate-y-[1px] active:translate-y-0",
        destructive:
          "bg-[#C8362E] text-white border-[#C8362E] hover:bg-[#9F2B24] hover:border-[#9F2B24] hover:-translate-y-[1px] active:translate-y-0",
        link:
          "border-transparent bg-transparent text-[#1E4B8F] underline-offset-4 hover:underline p-0 h-auto font-normal",
      },
      size: {
        default: "h-9 px-4 py-2 text-sm gap-2",
        sm: "h-8 px-3 py-1.5 text-xs gap-1.5",
        md: "h-9 px-4 py-2 text-sm gap-2",
        lg: "h-11 px-6 py-3 text-base gap-2.5 font-semibold",
        icon: "size-9 p-0",
        "icon-sm": "size-7 p-0",
        "icon-lg": "size-11 p-0",
      },
      block: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      block: false,
    },
  }
)

export interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  block?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

function Button({
  className,
  variant = "default",
  size = "default",
  block = false,
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <ButtonPrimitive
      data-slot="button"
      disabled={isDisabled}
      className={cn(buttonVariants({ variant, size, block, className }))}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-current" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }


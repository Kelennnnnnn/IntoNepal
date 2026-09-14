import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors select-none [&_svg]:pointer-events-none [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-[#D97706] text-white border-transparent",
        secondary: "bg-[#FBF8F3] text-[#1E4B8F] border-[#E8E4DD]",
        outline: "border-[#E8E4DD] bg-[#FFFFFF] text-[#1A1F1D]",
        destructive: "bg-[#FDF0EF] text-[#C8362E] border-[#C8362E]/30",
        ghost: "border-transparent bg-transparent text-[#5F6B66]",
        // Into Nepal Tones
        verified: "bg-[#EDF6F2] text-[#1B7A5A] border-[#1B7A5A]/30",
        info: "bg-[#EFF3FA] text-[#1E4B8F] border-[#1E4B8F]/30",
        promo: "bg-[#FEF4E7] text-[#B45309] border-[#D97706]/35 font-bold",
        urgent: "bg-[#FDF0EF] text-[#C8362E] border-[#C8362E]/35 font-bold",
        neutral: "bg-[#FBF8F3] text-[#5F6B66] border-[#E8E4DD]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  tone?: "verified" | "info" | "promo" | "urgent" | "neutral"
  icon?: React.ReactNode
}

function Badge({
  className,
  variant,
  tone,
  icon,
  children,
  ...props
}: BadgeProps) {
  const selectedVariant = tone || variant || "default"

  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant: selectedVariant }), className)}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
    </span>
  )
}

export { Badge, badgeVariants }


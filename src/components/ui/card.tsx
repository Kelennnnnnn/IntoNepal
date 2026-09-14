import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.ComponentProps<"div"> {
  size?: "default" | "sm"
  interactive?: boolean
}

function Card({
  className,
  size = "default",
  interactive = false,
  ...props
}: CardProps) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-interactive={interactive}
      className={cn(
        "group/card flex flex-col rounded-lg border border-[#E8E4DD] bg-[#FFFFFF] text-sm text-[#1A1F1D] shadow-none transition-all duration-200",
        interactive &&
          "cursor-pointer hover:-translate-y-[3px] hover:shadow-md hover:border-[#D9D3C9]",
        size === "sm" ? "p-3 gap-2" : "p-4 sm:p-5 gap-3",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col gap-1.5 pb-2 border-b border-[#E8E4DD]/60",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn(
        "font-serif text-base sm:text-lg font-bold text-[#1A1F1D] tracking-tight leading-snug",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-xs sm:text-sm text-[#5F6B66] leading-relaxed", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("self-start justify-self-end", className)}
      {...props}
    />
  )
}

export interface CardContentProps extends React.ComponentProps<"div"> {
  compact?: boolean
}

function CardContent({ className, compact = false, ...props }: CardContentProps) {
  return (
    <div
      data-slot="card-content"
      className={cn(compact ? "p-0" : "", className)}
      {...props}
    />
  )
}

// CardBody alias for convenient usage
const CardBody = CardContent

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center pt-3 border-t border-[#E8E4DD] text-xs text-[#5F6B66]",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardBody,
}


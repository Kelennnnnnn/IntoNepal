import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  label?: string
  error?: string
  helperText?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

function Input({
  className,
  type,
  id,
  label,
  error,
  helperText,
  hint,
  leftIcon,
  rightIcon,
  ...props
}: InputProps) {
  const effectiveHint = hint || helperText
  const generatedId = React.useId()
  const inputId = id || (label ? `input-${generatedId}` : undefined)

  const inputElement = (
    <div className="relative w-full">
      {leftIcon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5F6B66]">
          {leftIcon}
        </div>
      )}
      <InputPrimitive
        id={inputId}
        type={type}
        data-slot="input"
        className={cn(
          "h-9 w-full min-w-0 rounded-md border border-[#E8E4DD] bg-[#FFFFFF] px-3 py-1.5 text-sm text-[#1A1F1D] shadow-none placeholder:text-[#8E9994] transition-colors outline-none",
          "focus-visible:border-[#1E4B8F] focus-visible:ring-1 focus-visible:ring-[#1E4B8F]",
          "disabled:cursor-not-allowed disabled:bg-[#FBF8F3] disabled:text-[#8E9994] disabled:border-[#E8E4DD]",
          error && "border-[#C8362E] focus-visible:border-[#C8362E] focus-visible:ring-[#C8362E]",
          leftIcon ? "pl-9" : "",
          rightIcon ? "pr-9" : "",
          className
        )}
        {...props}
      />
      {rightIcon && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#5F6B66]">
          {rightIcon}
        </div>
      )}
    </div>
  )

  if (!label && !error && !effectiveHint) {
    return inputElement
  }

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-[#1A1F1D]"
        >
          {label}
        </label>
      )}
      {inputElement}
      {error && <p className="text-xs text-[#C8362E] font-medium">{error}</p>}
      {!error && effectiveHint && (
        <p className="text-xs text-[#5F6B66]">{effectiveHint}</p>
      )}
    </div>
  )
}

export { Input }


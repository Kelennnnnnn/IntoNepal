import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  label?: string
  error?: string
  helperText?: string
  hint?: string
}

function Textarea({
  className,
  id,
  label,
  error,
  helperText,
  hint,
  ...props
}: TextareaProps) {
  const effectiveHint = hint || helperText
  const generatedId = React.useId()
  const textareaId = id || (label ? `textarea-${generatedId}` : undefined)

  const textareaElement = (
    <textarea
      id={textareaId}
      data-slot="textarea"
      className={cn(
        "flex min-h-20 w-full rounded-md border border-[#E8E4DD] bg-[#FFFFFF] px-3 py-2 text-sm text-[#1A1F1D] shadow-none placeholder:text-[#8E9994] transition-colors outline-none",
        "focus-visible:border-[#1E4B8F] focus-visible:ring-1 focus-visible:ring-[#1E4B8F]",
        "disabled:cursor-not-allowed disabled:bg-[#FBF8F3] disabled:text-[#8E9994] disabled:border-[#E8E4DD]",
        error && "border-[#C8362E] focus-visible:border-[#C8362E] focus-visible:ring-[#C8362E]",
        className
      )}
      {...props}
    />
  )

  if (!label && !error && !effectiveHint) {
    return textareaElement
  }

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-xs font-semibold text-[#1A1F1D]"
        >
          {label}
        </label>
      )}
      {textareaElement}
      {error && <p className="text-xs text-[#C8362E] font-medium">{error}</p>}
      {!error && effectiveHint && (
        <p className="text-xs text-[#5F6B66]">{effectiveHint}</p>
      )}
    </div>
  )
}

export { Textarea }


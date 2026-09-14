"use client"

import { Toaster as Sonner, toast, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ theme = "light", ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "#FFFFFF",
          "--normal-text": "#1A1F1D",
          "--normal-border": "#E8E4DD",
          "--border-radius": "0.5rem",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "border border-[#E8E4DD] bg-[#FFFFFF] text-[#1A1F1D] shadow-none rounded-lg font-sans",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }

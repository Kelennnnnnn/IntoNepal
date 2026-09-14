import * as React from "react"
import { cn } from "@/lib/utils"

export interface TableProps extends React.ComponentProps<"table"> {
  caption?: string
}

function Table({ className, caption, children, ...props }: TableProps) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm text-[#1A1F1D]", className)}
        {...props}
      >
        {children}
        {caption && <TableCaption>{caption}</TableCaption>}
      </table>
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b border-[#E8E4DD]", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t border-[#E8E4DD] bg-[#FBF8F3] font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

export interface TableRowProps extends React.ComponentProps<"tr"> {
  highlight?: boolean
}

function TableRow({ className, highlight, ...props }: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-[#E8E4DD] transition-colors hover:bg-[#FBF8F3]/70 data-[state=selected]:bg-[#FBF8F3] table-row-stack",
        highlight && "bg-[#FEF4E7]/40 font-medium",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-3 text-left align-middle font-semibold text-xs text-[#5F6B66] uppercase tracking-wider whitespace-nowrap",
        className
      )}
      {...props}
    />
  )
}

export interface TableCellProps extends React.ComponentProps<"td"> {
  dataLabel?: string
  "data-label"?: string
}

function TableCell({
  className,
  dataLabel,
  "data-label": dataLabelAttr,
  ...props
}: TableCellProps) {
  const effectiveLabel = dataLabel ?? dataLabelAttr
  return (
    <td
      data-slot="table-cell"
      data-label={effectiveLabel}
      className={cn("p-3 align-middle text-sm text-[#1A1F1D] table-cell-stack", className)}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-xs text-[#5F6B66]", className)}
      {...props}
    />
  )
}

/**
 * ResponsiveTable:
 * Standard table on desktop (>=720px).
 * On screens below 720px, it stacks rows into independent cards and displays
 * the column heading as a label via data-label attributes.
 */
export interface ResponsiveTableProps extends React.ComponentProps<"table"> {
  containerClassName?: string
}

function ResponsiveTable({
  className,
  containerClassName,
  children,
  ...props
}: ResponsiveTableProps) {
  return (
    <div
      data-slot="responsive-table-container"
      className={cn("w-full overflow-x-auto", containerClassName)}
    >
      <table
        className={cn(
          "w-full text-left text-sm border-collapse table-responsive-stack",
          className
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  )
}

// Compatibility aliases
const TableHeadCell = TableHead
const Row = TableRow
const Cell = TableCell

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  ResponsiveTable,
  TableHeadCell,
  Row,
  Cell,
}


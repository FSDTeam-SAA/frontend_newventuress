import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface ContactMessage {
  _id: string
  fullName: string
  email: string
  subject: string
  message: string
  adminResponse: string
  createdAt: string
  updatedAt: string
}

export const contactListColumns: ColumnDef<ContactMessage>[] = [
  {
    header: "Subject",
    cell: ({ row }) => {
      return <div className="max-w-[200px] truncate font-medium">{row.original.subject}</div>
    },
  },
  {
    header: "Message",
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[250px] truncate text-[16px] font-normal text-[#444444]">
                {row.original.message}
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[400px] whitespace-normal">
              <p>{row.original.message}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    header: "Admin Response",
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[250px] truncate text-[16px] font-normal text-[#444444]">
                {row.original.adminResponse || "No response yet"}
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[400px] whitespace-normal">
              <p>{row.original.adminResponse || "No response yet"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    header: "Sent Time",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      return (
        <div>
          <span className="text-[16px] font-normal text-[#444444]">{format(date, "PPp")}</span>
        </div>
      )
    },
  },
]


"use client"

import { Checkbox } from "@/components/ui/checkbox"
import type { ColumnDef } from "@tanstack/react-table"
import { ImagePlus, MoreHorizontal } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import type { Product } from "@/types/vendorstore"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import EditProductDialog from "./edit-product-dialog"

const ActionCell = ({ product }: { product: Product }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const handleDelete = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/product/${product._id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["auction_listing"] })
      toast.success(`${product.title} has been successfully deleted.`)
    } catch (error) {
      console.error("Error deleting product:", error)
      toast("Failed to delete product. Please try again.")
    }
  }

  return (
    <div className="py-[41px] flex items-center justify-center ">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 dark:!text-[#6841A5] dark:hover:bg-[#482D721A]"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-white h-auto w-[110px] rounded-lg shadow-[4px_4px_8px_0px_#0000000D,-4px_-4px_8px_0px_#0000000D] "
        >
          <DropdownMenuItem
            className="p-[8px] hover:bg-[#E6EEF6] dark:hover:bg-[#482D721A] focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer dark:!text-[#6841A5] rounded-t-[8px]"
            onClick={() => setIsEditDialogOpen(true)}
          >
            Edit
          </DropdownMenuItem>
          {/* <DropdownMenuItem className="p-[8px] hover:bg-[#E6EEF6] dark:hover:bg-[#482D721A] focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer dark:!text-[#6841A5]">
            Details
          </DropdownMenuItem> */}
          <DropdownMenuItem
            className="p-[8px] text-red-600 hover:bg-[#E6EEF6] dark:hover:bg-[#482D721A] rounded-b-[8px] focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      {isEditDialogOpen && (
        <EditProductDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} product={product} />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product &ldquo;{product.title}&rdquo;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export const AuctionListingColumns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "name",
    header: () => (
      <div className="ml-[-250px] flex items-center justify-center gap-2 ">
        <ImagePlus className="w-[16px] h-[16px]" />
        <span> Name</span>
      </div>
    ),
    cell: ({ row }) => (
      <div>
        <div className="flex  items-center gap-x-[8px] ">
          <div className="h-[80px] w-[90px] 2xl:h-[110px] 2xl:w-[110px] relative rounded-[12px]">
            <Image src={row.original.photos[0] || "/placeholder.svg"} fill alt="product" className="rounded-[12px]" />
          </div>
          <div className="flex flex-col gap-y-[8px]">
            <h3 className="text-[15px] 2xl:text-[18px] leading-[21.6px] font-semibold text-gradient dark:text-gradient-pink ml-5">
              {row.original.title}
            </h3>
          </div>
        </div>
      </div>
    ),
  },
  {
    header: "SKU",
    cell: ({ row }) => (
      <div className="text-[#444444] font-normal text-[16px] leading-[19.2px] ">{row.original.sku}</div>
    ),
  },
  {
    header: "Regular Price",
    cell: ({ row }) => (
      <h4 className="text-base text-[#444444] font-normal leading-[19.2px] ">${row.original.regularPrice}</h4>
    ),
  },
  {
    header: "Selling Price",
    cell: ({ row }) => (
      <h4 className="text-base text-[#444444] font-normal leading-[19.2px] ">${row.original.selllingPrice}</h4>
    ),
  },
  {
    header: "Quantity",
    cell: ({ row }) => (
      <h4 className="text-base text-[#444444] font-normal leading-[19.2px] ">{row.original.quantity}</h4>
    ),
  },
  {
    id: "actions", // Unique ID for the actions column
    header: "Actions", // Column header
    cell: ({ row }) => <ActionCell product={row.original} />,
  },
]


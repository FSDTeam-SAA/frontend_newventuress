"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { AuctionDataType } from "@/types/vendorAuction";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useState } from "react";
import EditAuctionDialog from "./edit-auction-form";
import DeleteAuctionDialog from "./delete-auction-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const ActionCell = ({ auction }: { auction: AuctionDataType }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <div>
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
          className="bg-white h-auto w-[110px] rounded-lg shadow-[4px_4px_8px_0px_#0000000D,-4px_-4px_8px_0px_#0000000D]"
        >
          <DropdownMenuItem
            className="p-[8px] hover:bg-[#E6EEF6] dark:hover:bg-[#482D721A] focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer dark:!text-[#6841A5] rounded-t-[8px]"
            onClick={() => setEditDialogOpen(true)}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="p-[8px] text-red-600 hover:bg-[#E6EEF6] dark:hover:bg-[#482D721A] rounded-b-[8px] focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <EditAuctionDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} auction={auction} />

      {/* Delete Dialog */}
      <DeleteAuctionDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} auctionId={auction._id} auctionTitle={auction.title} />
    </div>
  );
};

export const ActionColumn: ColumnDef<AuctionDataType>[] = [
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
      <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Product",
    cell: ({ row }) => (
      <div className="flex items-center gap-4">
        <div>
          <Image
            src={row.original.images[0] || "/placeholder.svg"}
            height={142}
            width={110}
            alt="img"
            className="rounded-[8px] h-24 w-36"
          />
        </div>
        <div>
          <h4 className="text-[18px] text-gradient font-semibold dark:text-gradient-pink">{row.original.title}</h4>
        </div>
      </div>
    ),
  },
  {
    header: "Starting Price",
    cell: ({ row }) => <span className="text-[16px] text-[#444444] font-normal">${row.original.openingPrice || 0}</span>,
  },
  {
    header: "Starting Date & Time",
    cell: ({ row }) => <span className="text-[16px] text-[#444444] font-normal">{moment(row.original.startingDateAndTime).format("DD-MM-YYYY")}</span>,
  },
  {
    header: "Ending Date & Time",
    cell: ({ row }) => <span className="text-[16px] text-[#444444] font-normal">{moment(row.original.endingDateAndTime).format("DD-MM-YYYY")}</span>,
  },
  {
    header: "Actions",
    cell: ({ row }) => <ActionCell auction={row.original} />,
  },
];

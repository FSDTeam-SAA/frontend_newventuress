"use client";

import { DemoTableItemsType } from "@/data/demo";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react"; // Make sure to import the MoreHorizontal icon from lucide-react
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"; // Import your dropdown components
import { TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const MediaColumns: ColumnDef<DemoTableItemsType>[] = [
  
  {
    id: "select",
    header: () => null,
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
      />
    ),
    enableSorting: false,
    enableResizing: false,
    size: 50,
  },
  {
    header: "Image",
    cell: ({ row }) => {
      return (
        <Image
          src={row.original.image}
          height={50}
          width={74}
          alt="img"
          className="rounded-[8px]"
        />
      );
    },
  },
  {
    accessorKey: "Associate",
    header: "Associate",
  },
  {
    accessorKey: "Store",
    header: "Store",
  },
  {
    accessorKey: "Size",
    header: "Size",
  },
  {
    id: "actions", // Unique ID for the actions column
    header: "Actions", // Column header
    cell: ({ row }) => {
      const handleEdit = () => {
        console.log("Edit clicked for row:", row.original);
        // Add logic to open a form or modal for editing
      };

      const handleDelete = () => {
        console.log("Delete clicked for row:", row.original);
        // Add logic to confirm and delete the row
      };

      return (
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit} className="text-blue-500">Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-500">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      );
    },
    enableSorting: false, // Disable sorting for the actions column
    size: 100, // Optional: Set a fixed width for this column
  },
];

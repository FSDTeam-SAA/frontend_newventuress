"use client";
// import { Checkbox } from "@/components/ui/checkbox";
import { MembershipPlan } from "@/types/membership";
import { ColumnDef } from "@tanstack/react-table";

export const Column: ColumnDef<MembershipPlan>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    header: "Title",
    cell: ({ row }) => {
      return (
        <div>
          <div className="text-center">
            <span className="text-[12px] font-medium leading-[14.4px] text-[#F9FAFD] py-[10px] px-[33px] bg-primary dark:bg-pinkGradient rounded-[12px] text-center">
            {row.original.sponsoredListingPlanID ? row.original.sponsoredListingPlanID.planTitle : (row.original.membershipPlanID ? row.original.membershipPlanID.planType : "Free")}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    header: "Pay Method",
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <p className="text-base text-[#444444] font-normal leading-[19.2px]">
            {row.original.paymentMethod || "Credit Card"  }
          </p>
        </div>
      );
    },
  },
  {
    header: "Status",
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <p className="text-[18px] font-bold text-gradient dark:text-gradient-pink">
            {row.original.status ? String(row.original.status).charAt(0).toUpperCase() + String(row.original.status).slice(1).toLowerCase() : "Pending"}
          </p>
        </div>
      );
    },
  },
  {
    header: "Purchase Date",
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <p className="text-base font-normal text-[#444444]">
            {row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString() : "One time"}
          </p>
        </div>
      );
    },
  },

 
];

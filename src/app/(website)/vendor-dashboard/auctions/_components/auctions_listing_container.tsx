"use client";

// Packages
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

// Local imports
import { DataTable } from "@/components/ui/data-table";
import ErrorContainer from "@/components/ui/error-container";
import PacificPagination from "@/components/ui/PacificPagination";
import SkeletonWrapper from "@/components/ui/skeleton-wrapper";
import { Product, VendorAuctionListingResponse } from "@/types/vendorstore";
import { useQuery } from "@tanstack/react-query";
import { AuctionListingColumns } from "./auctions_listing_column";

const AuctionListingContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const {data, isLoading, isError, error} = useQuery<VendorAuctionListingResponse>({
    queryKey: ["auction_listing", currentPage],
    queryFn: () => fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/product?page=${currentPage}&limit=5`).then((res) => res.json())
  })

  

  let content;

  if(isLoading || data) {
    content = <SkeletonWrapper isLoading={isLoading}>
       <section className="w-full">
      <div className="w-full shadow-[0px_0px_22px_8px_#C1C9E4] h-auto  rounded-[24px] bg-white">
        <TableContainer
          data={data?.data ?? []}
          columns={AuctionListingColumns}
        />
      </div>
      <div className="my-[40px] mb-[80px] w-full  flex justify-between">
        <p className="font-normal text-[16px] leading-[19.2px] text-[#444444]">
          Showing 1 to {data?.meta.totalProducts ?? 0} in first entries
        </p>
        <div>
          <PacificPagination
            currentPage={currentPage}
            totalPages={data?.meta.totalPages ?? 1}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </section>
    </SkeletonWrapper>
  } else if(isError) {
    content = <ErrorContainer message={error?.message ?? ""} />
  }



  return content;
};

export default AuctionListingContainer;

interface TableContainerProps {
  data: Product[];
  columns: ColumnDef<Product>[];
}
const TableContainer = ({ data, columns }: TableContainerProps) => {
  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable({
    data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });
  return (
    <>
      <DataTable
        table={table}
        columns={columns}
        title="Regular Listing"
        titleClass="h-[78px] flex items-center text-[28px] leading-[33.6px] font-semibold"
      />
    </>
  );
};

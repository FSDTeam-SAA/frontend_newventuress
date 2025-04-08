"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useSession } from "next-auth/react";


const MembershipContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
 
  const session = useSession();
  const token = session.data?.user.token;
  const userId = session.data?.user.id;
  // console.log({ token });

  const { data, isError, isLoading, error } = useQuery<MembershipResponse>({
    queryKey: ["membership"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/membership/user/get/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
  });

  console.log("response data:", data);

  let content;
  if (isLoading) {
    content = (
      <div className="w-full p-4">
        <TableSkeletonWrapper count={5} width="100%" height="120px" className="bg-[#b4b3b3]"/>
      </div>
    );
  } else if (isError) {
    content = (
      <div className="w-full h-[400px]">
        <ErrorContainer message={error?.message || "Something went Wrong"} />
      </div>
    );
  } else if (data && data.data && data.data.length === 0) {
    content = (
      <NotFound message="Oops! No data available. Modify your filters or check your internet connection." />
    );
  } else if (data && data.data && data.data.length > 0) {
    content = <TableContainer columns={Column} data={data.data} />;
  }


  return (
    <section className="w-full">
      <div className="w-full shadow-[0px_0px_22px_8px_#C1C9E4] h-auto  rounded-[24px] bg-white">
        {content}
      </div>
      <div className="my-[40px] w-full  flex justify-between">
        <p className="font-normal text-[16px] leading-[19.2px] text-[#444444]">
          Showing 1 to 25 in first entries
        </p>
        <div>
          <PacificPagination
            currentPage={currentPage}
            totalPages={10}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </section>
  );
};

export default MembershipContainer;

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import PacificPagination from "@/components/ui/PacificPagination";
import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import TableSkeletonWrapper from "@/components/shared/TableSkeletonWrapper/TableSkeletonWrapper";
import ErrorContainer from "@/components/shared/ErrorContainer/ErrorContainer";
import NotFound from "@/components/shared/NotFound/NotFound";
import { MembershipPlan, MembershipResponse,  } from "@/types/membership";
import { Column } from "./membership-column";

const TableContainer = ({
  data,
  columns,
}: {
  data: any[];
  columns: ColumnDef<MembershipPlan>[];
}) => {
  const table = useReactTable({
    data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <>
      <DataTable table={table} columns={columns} title="My Plans" />
    </>
  );
};

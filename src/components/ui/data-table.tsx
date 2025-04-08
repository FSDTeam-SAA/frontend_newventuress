"use client";

import {
  ColumnDef,
  flexRender,
  Table as ReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]; // Columns for the table
  table: ReactTable<TData>; // Correctly typed table instance
  title?: string;
  titleClass?: string;
}

export function DataTable<TData, TValue>({
  columns,
  table,
  title = "Data Table",
  titleClass,
}: DataTableProps<TData, TValue>) {
  return (
    <div className="rounded-[24px] bg-white dark:!bg-[482D721A] px-[16px] pt-[24px]">
      <div
        className={cn(
          titleClass,
          "flex h-[78px] font-bold items-center rounded-t-[24px] bg-primary dark:!bg-pinkGradient px-4 py-3 text-[25px] 2xl:text-[32px] text-white pl-[32px] mx-[12px]",
        )}
      >
        {title}
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              style={{
                boxShadow: "none",
              }}
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="text-center text-[#444444]"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="text-center "
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
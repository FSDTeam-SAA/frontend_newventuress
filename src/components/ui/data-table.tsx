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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]; // Columns for the table
  table: ReactTable<TData>; // Correctly typed table instance
  title?: string;
}

export function DataTable<TData, TValue>({
  columns,
  table,
  title = "Data Table"
}: DataTableProps<TData, TValue>) {
  return (
    <div className="rounded-md border py-[32px] bg-white">
      <div className="bg-primary px-4 py-3 mx-[32px] rounded-t-lg">
        <h2 className="text-[28px] font-semibold text-[#FFFFFF]">{title}</h2>
      </div>
      <Table className="">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  
                  <TableHead key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
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

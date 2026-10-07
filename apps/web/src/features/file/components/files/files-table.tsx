import {
  functionalUpdate,
  useTable,
  type ColumnDef,
  type RowData,
  type RowSelectionState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@dropin/ui/components/table";

import { features, type DataTableFeatures } from "./features";
import { useState } from "react";

interface FilesTable<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[];
  onSelectionChange: (rows: TData[]) => void;
}

export function FilesTable<TData extends RowData>({
  columns,
  data,
  onSelectionChange,
}: FilesTable<TData>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useTable({
    features,
    data,
    columns,
    onRowSelectionChange: (updater) => {
      const next = functionalUpdate(updater, rowSelection);
      setRowSelection(next);

      const selected = Object.keys(next)
        .filter((id) => next[id])
        .map((id) => table.getRow(id).original);

      onSelectionChange?.(selected);
    }, //hoist up the row selection state to your own scope
    state: {
      rowSelection, //pass the row selection state back to the table instance
    },
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border *:data-[slot=table-container]:min-h-0 *:data-[slot=table-container]:flex-1 *:data-[slot=table-container]:scrollbar-none *:data-[slot=table-container]:overflow-auto *:data-[slot=table-container]:overscroll-none">
      <Table>
        <TableHeader className="sticky top-0 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={header.column.columnDef.meta?.className}
                  >
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
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
                onClick={row.getToggleSelectedHandler()}
              >
                {row.getAllCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cell.column.columnDef.meta?.className}
                  >
                    <table.FlexRender cell={cell} />
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

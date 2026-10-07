import "@tanstack/react-table";
import type { CellData, RowData, TableFeatures } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<
    in out TFeatures extends TableFeatures,
    in out TData extends RowData,
    TValue extends CellData = CellData,
  > {
    /** Classes applied to this column's header and body cells (e.g. widths). */
    className?: string;
  }
}

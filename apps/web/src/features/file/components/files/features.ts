import {
  rowSelectionFeature,
  tableFeatures,
  columnFilteringFeature,
  createFilteredRowModel,
  filterFn_includesString,
} from "@tanstack/react-table";

export const features = tableFeatures({
  columnFilteringFeature,
  // columnVisibilityFeature,
  // rowPaginationFeature,
  rowSelectionFeature,
  filteredRowModel: createFilteredRowModel(),
  // paginatedRowModel: createPaginatedRowModel(),
  filterFns: { includesString: filterFn_includesString },
});

export type DataTableFeatures = typeof features;

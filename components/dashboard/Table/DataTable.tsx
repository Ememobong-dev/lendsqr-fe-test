"use client";

import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import styles from "./DataTable.module.scss";

type DataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  showFooterPagination?: boolean;
  pageSizeOptions?: number[];
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
};

export default function DataTable<T>({
  data,
  columns,
  showFooterPagination = true,
  pageSizeOptions = [10, 25, 50, 100],
  pagination,
  onPaginationChange,
}: DataTableProps<T>) {
  const controlledPagination = pagination ?? {
    pageIndex: 0,
    pageSize: 10,
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination: controlledPagination,
    },
    onPaginationChange: (updater) => {
      if (!onPaginationChange) return;

      const nextValue =
        typeof updater === "function"
          ? updater(controlledPagination)
          : updater;

      onPaginationChange(nextValue);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className={styles.emptyState} colSpan={columns.length}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showFooterPagination && (
        <div className={styles.footer}>
          <div className={styles.pageInfo}>
            <span>Showing</span>

            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className={styles.select}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <span>out of {data.length}</span>
          </div>

          <div className={styles.pagination}>
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={styles.paginationButton}
            >
              ‹
            </button>

            <span className={styles.pageNumber}>{currentPage}</span>
            <span className={styles.pageDivider}>of</span>
            <span className={styles.pageNumber}>{totalPages || 1}</span>

            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={styles.paginationButton}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
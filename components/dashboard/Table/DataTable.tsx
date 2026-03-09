"use client";

import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import styles from "./DataTable.module.scss";

type DataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  showFooterPagination?: boolean;
  pageSizeOptions?: number[];
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
  manualPagination?: boolean;
  totalItems?: number;
  totalPages?: number;
};

function buildChunkedPagination(currentPage: number, totalPages: number, chunkSize = 5) {
  const chunkIndex = Math.floor((currentPage - 1) / chunkSize);
  const startPage = chunkIndex * chunkSize + 1;
  const endPage = Math.min(startPage + chunkSize - 1, totalPages);

  const pages: (number | string)[] = [];

  if (startPage > 1) {
    pages.push(1);

    if (startPage > 2) {
      pages.push("...");
    }
  }

  for (let page = startPage; page <= endPage; page += 1) {
    pages.push(page);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);
  }

  return pages;
}

export default function DataTable<T>({
  data,
  columns,
  showFooterPagination = true,
  pageSizeOptions = [10, 25, 50, 100],
  pagination,
  onPaginationChange,
  manualPagination = false,
  totalItems = data.length,
  totalPages,
}: DataTableProps<T>) {
  const computedTotalPages =
    totalPages ?? Math.max(1, Math.ceil(totalItems / pagination.pageSize));

  const currentPage = pagination.pageIndex + 1;

  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(pagination) : updater;
      onPaginationChange(next);
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination,
    pageCount: computedTotalPages,
  });

  const paginationRange = buildChunkedPagination(currentPage, computedTotalPages, 5);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableScroll}>
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
              {data.length > 0 ? (
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
      </div>

      {showFooterPagination && (
        <div className={styles.footer}>
          <div className={styles.pageInfo}>
            <span>Showing</span>

            <select
              value={pagination.pageSize}
              onChange={(e) =>
                onPaginationChange({
                  pageIndex: 0,
                  pageSize: Number(e.target.value),
                })
              }
              className={styles.select}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <span>out of {totalItems}</span>
          </div>

          <div className={styles.pagination}>
            <button
              type="button"
              className={styles.paginationButton}
              disabled={currentPage <= 1}
              onClick={() =>
                onPaginationChange({
                  pageIndex: pagination.pageIndex - 1,
                  pageSize: pagination.pageSize,
                })
              }
              aria-label="Previous page"
            >
              ‹
            </button>

            <div className={styles.paginationNumbers}>
              {paginationRange.map((item, index) => {
                if (item === "...") {
                  return (
                    <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                      ...
                    </span>
                  );
                }

                const isActive = item === currentPage;

                return (
                  <button
                    key={item}
                    type="button"
                    className={`${styles.pageNumber} ${
                      isActive ? styles.activePage : ""
                    }`}
                    onClick={() =>
                      onPaginationChange({
                        pageIndex: (item as number) - 1,
                        pageSize: pagination.pageSize,
                      })
                    }
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className={styles.paginationButton}
              disabled={currentPage >= computedTotalPages}
              onClick={() =>
                onPaginationChange({
                  pageIndex: pagination.pageIndex + 1,
                  pageSize: pagination.pageSize,
                })
              }
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
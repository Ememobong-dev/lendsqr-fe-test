"use client";

import {
  type ColumnDef,
  type PaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import styles from "./DataTable.module.scss";
import { buildPaginationRange } from "@/lib/utils/table-utils";

type DataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  showFooterPagination?: boolean;
  pageSizeOptions?: number[];
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
  manualPagination?: boolean;
  totalItems?: number;
  totalPages?: number;
};


export default function DataTable<TData>({
  data,
  columns,
  showFooterPagination = true,
  pageSizeOptions = [10, 25, 50, 100],
  pagination,
  onPaginationChange,
  manualPagination = false,
  totalItems = data.length,
  totalPages,
}: DataTableProps<TData>) {
  const computedTotalPages =
    totalPages ?? Math.max(1, Math.ceil(totalItems / pagination.pageSize));

  const currentPage = pagination.pageIndex + 1;
  const paginationRange = buildPaginationRange(
    currentPage,
    computedTotalPages,
    5
  );

  const handlePageChange = (page: number): void => {
    onPaginationChange({
      pageIndex: page - 1,
      pageSize: pagination.pageSize,
    });
  };

  const handlePreviousPage = (): void => {
    onPaginationChange({
      pageIndex: pagination.pageIndex - 1,
      pageSize: pagination.pageSize,
    });
  };

  const handleNextPage = (): void => {
    onPaginationChange({
      pageIndex: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    });
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    onPaginationChange({
      pageIndex: 0,
      pageSize: Number(event.target.value),
    });
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: (updater) => {
      const nextPagination =
        typeof updater === "function" ? updater(pagination) : updater;

      onPaginationChange(nextPagination);
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination,
    pageCount: computedTotalPages,
  });

  return (
    <div className={styles.tableBlock}>
      <div className={styles.tableBlock__scroll}>
        <div className={styles.tableBlock__container}>
          <table className={styles.tableBlock__table}>
            <thead className={styles.tableBlock__head}>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className={styles.tableBlock__headRow}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className={styles.tableBlock__headCell}>
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

            <tbody className={styles.tableBlock__body}>
              {data.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className={styles.tableBlock__bodyRow}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className={styles.tableBlock__bodyCell}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr className={styles.tableBlock__bodyRow}>
                  <td
                    className={styles.tableBlock__emptyState}
                    colSpan={columns.length}
                  >
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showFooterPagination ? (
        <div className={styles.tableBlock__footer}>
          <div className={styles.tableBlock__pageInfo}>
            <span>Showing</span>

            <select
              value={pagination.pageSize}
              onChange={handlePageSizeChange}
              className={styles.tableBlock__select}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <span>out of {totalItems}</span>
          </div>

          <div className={styles.tableBlock__pagination}>
            <button
              type="button"
              className={styles.tableBlock__paginationButton}
              disabled={currentPage <= 1}
              onClick={handlePreviousPage}
              aria-label="Previous page"
            >
              ‹
            </button>

            <div className={styles.tableBlock__paginationNumbers}>
              {paginationRange.map((item, index) => {
                if (item === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className={styles.tableBlock__ellipsis}
                    >
                      ...
                    </span>
                  );
                }

                const isActive = item === currentPage;

                return (
                  <button
                    key={item}
                    type="button"
                    className={`${styles.tableBlock__pageNumber} ${
                      isActive ? styles["tableBlock__pageNumber--active"] : ""
                    }`}
                    onClick={() => handlePageChange(item)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className={styles.tableBlock__paginationButton}
              disabled={currentPage >= computedTotalPages}
              onClick={handleNextPage}
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import DataTable from "@/components/dashboard/Table/DataTable";

type RowData = {
  name: string;
  email: string;
};

const columns: ColumnDef<RowData>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: (info) => info.getValue(),
  },
];

const rows: RowData[] = [
  { name: "John Doe", email: "john@example.com" },
  { name: "Jane Doe", email: "jane@example.com" },
];

describe("DataTable", () => {
  it("renders headers and rows", () => {
    const onPaginationChange = vi.fn();

    render(
      <DataTable
        data={rows}
        columns={columns}
        pagination={{ pageIndex: 0, pageSize: 10 }}
        onPaginationChange={onPaginationChange}
        totalItems={2}
        totalPages={1}
      />
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("shows empty state when there are no records", () => {
    const onPaginationChange = vi.fn();

    render(
      <DataTable
        data={[]}
        columns={columns}
        pagination={{ pageIndex: 0, pageSize: 10 }}
        onPaginationChange={onPaginationChange}
        totalItems={0}
        totalPages={1}
      />
    );

    expect(screen.getByText(/no records found/i)).toBeInTheDocument();
  });

  it("calls onPaginationChange when next page is clicked", async () => {
    const user = userEvent.setup();
    const onPaginationChange = vi.fn();
    const pagination: PaginationState = { pageIndex: 0, pageSize: 10 };

    render(
      <DataTable
        data={rows}
        columns={columns}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        totalItems={25}
        totalPages={3}
      />
    );

    await user.click(screen.getByRole("button", { name: /next page/i }));

    expect(onPaginationChange).toHaveBeenCalledWith({
      pageIndex: 1,
      pageSize: 10,
    });
  });

  it("calls onPaginationChange when previous page is clicked", async () => {
    const user = userEvent.setup();
    const onPaginationChange = vi.fn();
    const pagination: PaginationState = { pageIndex: 1, pageSize: 10 };

    render(
      <DataTable
        data={rows}
        columns={columns}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        totalItems={25}
        totalPages={3}
      />
    );

    await user.click(screen.getByRole("button", { name: /previous page/i }));

    expect(onPaginationChange).toHaveBeenCalledWith({
      pageIndex: 0,
      pageSize: 10,
    });
  });

  it("resets to page 0 when page size changes", async () => {
    const user = userEvent.setup();
    const onPaginationChange = vi.fn();

    render(
      <DataTable
        data={rows}
        columns={columns}
        pagination={{ pageIndex: 2, pageSize: 10 }}
        onPaginationChange={onPaginationChange}
        totalItems={50}
        totalPages={5}
      />
    );

    await user.selectOptions(screen.getByRole("combobox"), "25");

    expect(onPaginationChange).toHaveBeenCalledWith({
      pageIndex: 0,
      pageSize: 25,
    });
  });

  it("hides footer pagination when disabled", () => {
    const onPaginationChange = vi.fn();

    render(
      <DataTable
        data={rows}
        columns={columns}
        pagination={{ pageIndex: 0, pageSize: 10 }}
        onPaginationChange={onPaginationChange}
        showFooterPagination={false}
      />
    );

    expect(screen.queryByText(/showing/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /next page/i })
    ).not.toBeInTheDocument();
  });
});
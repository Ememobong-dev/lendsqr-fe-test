"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import DataTable from "../Table/DataTable";
import styles from "./UsersTable.module.scss";
import { fetchUsers } from "@/lib/api/users";
import { saveUserDetails, saveUsersCache } from "@/lib/storage/user.storage";
import { UserRecord, UserStatus } from "@/types/user";

type FilterState = {
  organization: string;
  username: string;
  email: string;
  date: string;
  phoneNumber: string;
  status: string;
};


type UserAction =
  | "view-details"
  | "blacklist-user"
  | "activate-user"
  | "deactivate-user";

const defaultFilters: FilterState = {
  organization: "",
  username: "",
  email: "",
  date: "",
  phoneNumber: "",
  status: "",
};

function statusClassName(status: UserStatus) {
  switch (status) {
    case "Active":
      return styles.active;
    case "Pending":
      return styles.pending;
    case "Blacklisted":
      return styles.blacklisted;
    default:
      return styles.inactive;
  }
}

function getActionItems(status: UserStatus): UserAction[] {
  switch (status) {
    case "Active":
      return ["view-details", "blacklist-user", "deactivate-user"];
    case "Blacklisted":
      return ["view-details", "activate-user"];
    case "Inactive":
      return ["view-details", "blacklist-user", "activate-user"];
    case "Pending":
    default:
      return ["view-details", "blacklist-user", "activate-user"];
  }
}

export default function UsersTable() {
  const [data, setData] = useState<UserRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const actionMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target as Node)
      ) {
        setOpenActionMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        setError("");

        const response = await fetchUsers({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          ...filters,
        });

        setData(response.data);
        setTotal(response.total);
        saveUsersCache(response.data);
      } catch {
        setError("Unable to load users.");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [pagination.pageIndex, pagination.pageSize, filters]);

  const columns = useMemo<ColumnDef<UserRecord>[]>(
    () => [
      {
        accessorKey: "organization",
        header: () => (
          <button
            type="button"
            className={styles.headerButton}
            onClick={() => setShowFilter((prev) => !prev)}
          >
            ORGANIZATION
            <span className={styles.filterIcon}>
              <Image src="/icons/users-dash/filter-icon.svg" width={14} height={14} alt="filter icon" />
            </span>
          </button>
        ),
      },
      {
        accessorKey: "username",
        header: () => (
          <div className={styles.headerLabel}>
            USERNAME
            <span className={styles.filterIcon}>
              <Image src="/icons/users-dash/filter-icon.svg" width={14} height={14} alt="filter icon" />
            </span>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: () => (
          <div className={styles.headerLabel}>
            EMAIL
            <span className={styles.filterIcon}>
              <Image src="/icons/users-dash/filter-icon.svg" width={14} height={14} alt="filter icon" />
            </span>
          </div>
        ),
      },
      {
        accessorKey: "phoneNumber",
        header: () => (
          <div className={styles.headerLabel}>
            PHONE NUMBER
            <span className={styles.filterIcon}>
              <Image src="/icons/users-dash/filter-icon.svg" width={14} height={14} alt="filter icon" />
            </span>
          </div>
        ),
      },
      {
        accessorKey: "dateJoined",
        header: () => (
          <div className={styles.headerLabel}>
            DATE JOINED
            <span className={styles.filterIcon}>
              <Image src="/icons/users-dash/filter-icon.svg" width={14} height={14} alt="filter icon" />
            </span>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: () => (
          <div className={styles.headerLabel}>
            STATUS
            <span className={styles.filterIcon}>
              <Image src="/icons/users-dash/filter-icon.svg" width={14} height={14} alt="filter icon" />
            </span>
          </div>
        ),
        cell: ({ row }) => (
          <span className={`${styles.statusBadge} ${statusClassName(row.original.status)}`}>
            {row.original.status}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const user = row.original;
          const isOpen = openActionMenuId === user.id;
          const actionItems = getActionItems(user.status);

          return (
            <div className={styles.actionCell} ref={isOpen ? actionMenuRef : null}>
              <button
                type="button"
                className={styles.actionButton}
                onClick={() => setOpenActionMenuId((prev) => (prev === user.id ? null : user.id))}
              >
                <Image
                  src="/icons/users-dash/vertical-elipse.svg"
                  alt="actions"
                  width={16}
                  height={16}
                />
              </button>

              {isOpen && (
                <div className={styles.actionMenu}>
                  {actionItems.includes("view-details") && (
                    <Link
                      href={`/users/${user.slug}`}
                      className={styles.actionMenuItem}
                      onClick={() => {
                        saveUserDetails(user);
                        setOpenActionMenuId(null);
                      }}
                    >
                      <Image src="/icons/eye.svg" alt="" width={16} height={16} />
                      <span>View Details</span>
                    </Link>
                  )}

                  {actionItems.includes("blacklist-user") && (
                    <button type="button" className={styles.actionMenuItem}>
                      <Image src="/icons/blacklist-user.svg" alt="" width={16} height={16} />
                      <span>Blacklist User</span>
                    </button>
                  )}

                  {actionItems.includes("activate-user") && (
                    <button type="button" className={styles.actionMenuItem}>
                      <Image src="/icons/activate-user.svg" alt="" width={16} height={16} />
                      <span>Activate User</span>
                    </button>
                  )}

                  {actionItems.includes("deactivate-user") && (
                    <button type="button" className={styles.actionMenuItem}>
                      <Image src="/icons/blacklist-user.svg" alt="" width={16} height={16} />
                      <span>Deactivate User</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        },
      },
    ],
    [openActionMenuId]
  );

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const totalPages = Math.max(1, Math.ceil(total / pagination.pageSize));

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableArea}>
        {showFilter && (
          <div className={styles.filterCard}>
            <div className={styles.field}>
              <label>Organization</label>
              <input type="text" placeholder="Select" value={filters.organization} onChange={(e) => handleFilterChange("organization", e.target.value)} />
            </div>

            <div className={styles.field}>
              <label>Username</label>
              <input type="text" placeholder="User" value={filters.username} onChange={(e) => handleFilterChange("username", e.target.value)} />
            </div>

            <div className={styles.field}>
              <label>Email</label>
              <input type="email" placeholder="Email" value={filters.email} onChange={(e) => handleFilterChange("email", e.target.value)} />
            </div>

            <div className={styles.field}>
              <label>Date</label>
              <input type="text" placeholder="Date" value={filters.date} onChange={(e) => handleFilterChange("date", e.target.value)} />
            </div>

            <div className={styles.field}>
              <label>Phone Number</label>
              <input type="text" placeholder="Phone Number" value={filters.phoneNumber} onChange={(e) => handleFilterChange("phoneNumber", e.target.value)} />
            </div>

            <div className={styles.field}>
              <label>Status</label>
              <select value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)}>
                <option value="">Select</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
                <option value="Blacklisted">Blacklisted</option>
                <option value="Active">Active</option>
              </select>
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.resetButton} onClick={handleReset}>
                Reset
              </button>

              <button type="button" className={styles.filterButton} onClick={() => setShowFilter(false)}>
                Filter
              </button>
            </div>
          </div>
        )}

        {error ? (
          <div className={styles.feedbackState}>{error}</div>
        ) : loading ? (
          <div className={styles.feedbackState}>Loading users...</div>
        ) : (
          <DataTable
            data={data}
            columns={columns}
            showFooterPagination
            pageSizeOptions={[10, 25, 50, 100]}
            pagination={pagination}
            onPaginationChange={setPagination}
            totalItems={total}
            totalPages={totalPages}
            manualPagination
          />
        )}
      </div>
    </div>
  );
}
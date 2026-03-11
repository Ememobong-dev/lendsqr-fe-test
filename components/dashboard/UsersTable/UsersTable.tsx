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
  phoneNumber: string;
  dateJoined: string;
  status: string;
};

type FilterFieldKey = keyof FilterState;

type UserAction =
  | "view-details"
  | "blacklist-user"
  | "activate-user"
  | "deactivate-user";

type FilterFieldConfig = {
  key: FilterFieldKey;
  label: string;
  type: "text" | "email" | "select";
  placeholder?: string;
  options?: string[];
};

const defaultFilters: FilterState = {
  organization: "",
  username: "",
  email: "",
  phoneNumber: "",
  dateJoined: "",
  status: "",
};

const filterFieldConfigs: FilterFieldConfig[] = [
  {
    key: "organization",
    label: "Organization",
    type: "text",
    placeholder: "Select",
  },
  {
    key: "username",
    label: "Username",
    type: "text",
    placeholder: "User",
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "Email",
  },
  {
    key: "dateJoined",
    label: "Date Joined",
    type: "text",
    placeholder: "Date",
  },
  {
    key: "phoneNumber",
    label: "Phone Number",
    type: "text",
    placeholder: "Phone Number",
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: ["Inactive", "Pending", "Blacklisted", "Active"],
  },
];

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

function reorderFilterFields(
  fields: FilterFieldConfig[],
  priorityKey: FilterFieldKey | null
) {
  if (!priorityKey) return fields;

  const priorityField = fields.find((field) => field.key === priorityKey);
  const remainingFields = fields.filter((field) => field.key !== priorityKey);

  return priorityField ? [priorityField, ...remainingFields] : fields;
}

export default function UsersTable() {
  const [data, setData] = useState<UserRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilterField, setActiveFilterField] =
    useState<FilterFieldKey | null>("organization");
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [filterLeft, setFilterLeft] = useState(14);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const actionMenuRef = useRef<HTMLDivElement | null>(null);
  const filterCardRef = useRef<HTMLDivElement | null>(null);
  const tableAreaRef = useRef<HTMLDivElement | null>(null);
  const headerButtonRefs = useRef<Partial<Record<FilterFieldKey, HTMLButtonElement | null>>>({});

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(target)
      ) {
        setOpenActionMenuId(null);
      }

      if (showFilter) {
        const clickedInsideFilter =
          filterCardRef.current?.contains(target) ?? false;

        const clickedAnyHeader = Object.values(headerButtonRefs.current).some(
          (button) => button?.contains(target)
        );

        if (!clickedInsideFilter && !clickedAnyHeader) {
          setShowFilter(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilter]);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        setError("");

        const response = await fetchUsers({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          organization: filters.organization,
          username: filters.username,
          email: filters.email,
          phoneNumber: filters.phoneNumber,
          date: filters.dateJoined,
          status: filters.status,
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

  const orderedFilterFields = useMemo(
    () => reorderFilterFields(filterFieldConfigs, activeFilterField),
    [activeFilterField]
  );

  const openFilterForField = (
    fieldKey: FilterFieldKey,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const containerRect = tableAreaRef.current?.getBoundingClientRect();

    setActiveFilterField(fieldKey);
    setShowFilter(true);

    if (!containerRect) return;

    const nextLeft = buttonRect.left - containerRect.left;
    setFilterLeft(nextLeft);
  };

  const columns = useMemo<ColumnDef<UserRecord>[]>(
    () => [
      {
        accessorKey: "organization",
        header: () => (
          <button
            ref={(element) => {
              headerButtonRefs.current.organization = element;
            }}
            type="button"
            className={styles.headerButton}
            onClick={(event) => openFilterForField("organization", event)}
          >
            ORGANIZATION
            <span className={styles.filterIcon}>
              <Image
                src="/icons/users-dash/filter-icon.svg"
                width={14}
                height={14}
                alt="filter icon"
              />
            </span>
          </button>
        ),
      },
      {
        accessorKey: "username",
        header: () => (
          <button
            ref={(element) => {
              headerButtonRefs.current.username = element;
            }}
            type="button"
            className={styles.headerButton}
            onClick={(event) => openFilterForField("username", event)}
          >
            USERNAME
            <span className={styles.filterIcon}>
              <Image
                src="/icons/users-dash/filter-icon.svg"
                width={14}
                height={14}
                alt="filter icon"
              />
            </span>
          </button>
        ),
      },
      {
        accessorKey: "email",
        header: () => (
          <button
            ref={(element) => {
              headerButtonRefs.current.email = element;
            }}
            type="button"
            className={styles.headerButton}
            onClick={(event) => openFilterForField("email", event)}
          >
            EMAIL
            <span className={styles.filterIcon}>
              <Image
                src="/icons/users-dash/filter-icon.svg"
                width={14}
                height={14}
                alt="filter icon"
              />
            </span>
          </button>
        ),
      },
      {
        accessorKey: "phoneNumber",
        header: () => (
          <button
            ref={(element) => {
              headerButtonRefs.current.phoneNumber = element;
            }}
            type="button"
            className={styles.headerButton}
            onClick={(event) => openFilterForField("phoneNumber", event)}
          >
            PHONE NUMBER
            <span className={styles.filterIcon}>
              <Image
                src="/icons/users-dash/filter-icon.svg"
                width={14}
                height={14}
                alt="filter icon"
              />
            </span>
          </button>
        ),
      },
      {
        accessorKey: "dateJoined",
        header: () => (
          <button
            ref={(element) => {
              headerButtonRefs.current.dateJoined = element;
            }}
            type="button"
            className={styles.headerButton}
            onClick={(event) => openFilterForField("dateJoined", event)}
          >
            DATE JOINED
            <span className={styles.filterIcon}>
              <Image
                src="/icons/users-dash/filter-icon.svg"
                width={14}
                height={14}
                alt="filter icon"
              />
            </span>
          </button>
        ),
      },
      {
        accessorKey: "status",
        header: () => (
          <button
            ref={(element) => {
              headerButtonRefs.current.status = element;
            }}
            type="button"
            className={styles.headerButton}
            onClick={(event) => openFilterForField("status", event)}
          >
            STATUS
            <span className={styles.filterIcon}>
              <Image
                src="/icons/users-dash/filter-icon.svg"
                width={14}
                height={14}
                alt="filter icon"
              />
            </span>
          </button>
        ),
        cell: ({ row }) => (
          <span
            className={`${styles.statusBadge} ${statusClassName(
              row.original.status
            )}`}
          >
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
                onClick={() =>
                  setOpenActionMenuId((prev) => (prev === user.id ? null : user.id))
                }
              >
                <Image
                  src="/icons/users-dash/vertical-elipse.svg"
                  alt="actions"
                  width={16}
                  height={16}
                />
              </button>

              {isOpen && (
                <div
                  className={`${styles.actionMenu} ${
                    row.index >= data.length - 2 ? styles.actionMenuUp : ""
                  }`}
                >
                  {actionItems.includes("view-details") && (
                    <Link
                      href={`/users/${user.slug}`}
                      className={styles.actionMenuItem}
                      onClick={() => {
                        saveUserDetails(user);
                        setOpenActionMenuId(null);
                      }}
                    >
                      <Image
                        src="/icons/eye.svg"
                        alt=""
                        width={16}
                        height={16}
                      />
                      <span>View Details</span>
                    </Link>
                  )}

                  {actionItems.includes("blacklist-user") && (
                    <button type="button" className={styles.actionMenuItem}>
                      <Image
                        src="/icons/blacklist-user.svg"
                        alt=""
                        width={16}
                        height={16}
                      />
                      <span>Blacklist User</span>
                    </button>
                  )}

                  {actionItems.includes("activate-user") && (
                    <button type="button" className={styles.actionMenuItem}>
                      <Image
                        src="/icons/activate-user.svg"
                        alt=""
                        width={16}
                        height={16}
                      />
                      <span>Activate User</span>
                    </button>
                  )}

                  {actionItems.includes("deactivate-user") && (
                    <button type="button" className={styles.actionMenuItem}>
                      <Image
                        src="/icons/blacklist-user.svg"
                        alt=""
                        width={16}
                        height={16}
                      />
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
    [openActionMenuId, data.length]
  );

  const handleFilterChange = (key: FilterFieldKey, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  };

  const totalPages = Math.max(1, Math.ceil(total / pagination.pageSize));

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableArea} ref={tableAreaRef}>
        {showFilter && (
          <div
            ref={filterCardRef}
            className={styles.filterCard}
            style={{ left: `${filterLeft}px` }}
          >
            {orderedFilterFields.map((field) => (
              <div className={styles.field} key={field.key}>
                <label>{field.label}</label>

                {field.type === "select" ? (
                  <select
                    value={filters[field.key]}
                    onChange={(e) =>
                      handleFilterChange(field.key, e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={filters[field.key]}
                    onChange={(e) =>
                      handleFilterChange(field.key, e.target.value)
                    }
                  />
                )}
              </div>
            ))}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.resetButton}
                onClick={handleReset}
              >
                Reset
              </button>

              <button
                type="button"
                className={styles.filterButton}
                onClick={() => setShowFilter(false)}
              >
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
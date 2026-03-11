"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import DataTable from "../Table/DataTable";
import { fetchUsers } from "@/lib/api/users";
import { saveUserDetails, saveUsersCache } from "@/lib/storage/user.storage";
import type { UserRecord, UserStatus } from "@/types/user";
import styles from "./UsersTable.module.scss";

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

type ActionConfig = {
  key: UserAction;
  label: string;
  icon: string;
};

const DEFAULT_FILTERS: FilterState = {
  organization: "",
  username: "",
  email: "",
  phoneNumber: "",
  dateJoined: "",
  status: "",
};

const FILTER_FIELD_CONFIGS: FilterFieldConfig[] = [
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

const ACTION_CONFIG: Record<UserAction, ActionConfig> = {
  "view-details": {
    key: "view-details",
    label: "View Details",
    icon: "/icons/eye.svg",
  },
  "blacklist-user": {
    key: "blacklist-user",
    label: "Blacklist User",
    icon: "/icons/blacklist-user.svg",
  },
  "activate-user": {
    key: "activate-user",
    label: "Activate User",
    icon: "/icons/activate-user.svg",
  },
  "deactivate-user": {
    key: "deactivate-user",
    label: "Deactivate User",
    icon: "/icons/blacklist-user.svg",
  },
};

function getStatusVariant(status: UserStatus): string {
  switch (status) {
    case "Active":
      return styles["usersTable__statusBadge--active"];
    case "Pending":
      return styles["usersTable__statusBadge--pending"];
    case "Blacklisted":
      return styles["usersTable__statusBadge--blacklisted"];
    default:
      return styles["usersTable__statusBadge--inactive"];
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
): FilterFieldConfig[] {
  if (!priorityKey) {
    return fields;
  }

  const priorityField = fields.find((field) => field.key === priorityKey);
  const remainingFields = fields.filter((field) => field.key !== priorityKey);

  return priorityField ? [priorityField, ...remainingFields] : fields;
}

type ColumnHeaderProps = {
  label: string;
  fieldKey: FilterFieldKey;
  onOpen: (
    fieldKey: FilterFieldKey,
    event: ReactMouseEvent<HTMLButtonElement>
  ) => void;
  buttonRef: (element: HTMLButtonElement | null) => void;
};

function ColumnHeader({
  label,
  fieldKey,
  onOpen,
  buttonRef,
}: ColumnHeaderProps) {
  return (
    <button
      ref={buttonRef}
      type="button"
      className={styles.usersTable__headerButton}
      onClick={(event) => onOpen(fieldKey, event)}
    >
      <span className={styles.usersTable__headerLabel}>{label}</span>

      <span className={styles.usersTable__filterIcon}>
        <Image
          src="/icons/users-dash/filter-icon.svg"
          width={14}
          height={14}
          alt="filter icon"
        />
      </span>
    </button>
  );
}

export default function UsersTable() {
  const [data, setData] = useState<UserRecord[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [activeFilterField, setActiveFilterField] =
    useState<FilterFieldKey | null>("organization");
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [filterLeft, setFilterLeft] = useState<number>(14);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const actionMenuRef = useRef<HTMLDivElement | null>(null);
  const filterCardRef = useRef<HTMLDivElement | null>(null);
  const tableAreaRef = useRef<HTMLDivElement | null>(null);
  const headerButtonRefs =
    useRef<Partial<Record<FilterFieldKey, HTMLButtonElement | null>>>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
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

        const clickedHeaderButton = Object.values(headerButtonRefs.current).some(
          (button) => button?.contains(target)
        );

        if (!clickedInsideFilter && !clickedHeaderButton) {
          setShowFilter(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilter]);

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async (): Promise<void> => {
      try {
        setIsLoading(true);
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

        if (!isMounted) {
          return;
        }

        setData(response.data);
        setTotal(response.total);
        saveUsersCache(response.data);
      } catch (loadError) {
        console.error("Failed to load users:", loadError);

        if (!isMounted) {
          return;
        }

        setError("Unable to load users.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadUsers();

    return () => {
      isMounted = false;
    };
  }, [pagination.pageIndex, pagination.pageSize, filters]);

  const orderedFilterFields = useMemo(
    () => reorderFilterFields(FILTER_FIELD_CONFIGS, activeFilterField),
    [activeFilterField]
  );

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pagination.pageSize)),
    [total, pagination.pageSize]
  );

  const handleFilterOpen = (
    fieldKey: FilterFieldKey,
    event: ReactMouseEvent<HTMLButtonElement>
  ): void => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const containerRect = tableAreaRef.current?.getBoundingClientRect();

    setActiveFilterField(fieldKey);
    setShowFilter(true);

    if (!containerRect) {
      return;
    }

    setFilterLeft(buttonRect.left - containerRect.left);
  };

  const handleFilterChange = (
    key: FilterFieldKey,
    value: string
  ): void => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  };

  const handleResetFilters = (): void => {
    setFilters(DEFAULT_FILTERS);
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  };

  const columns = useMemo<ColumnDef<UserRecord>[]>(
    () => [
      {
        accessorKey: "organization",
        header: () => (
          <ColumnHeader
            label="ORGANIZATION"
            fieldKey="organization"
            onOpen={handleFilterOpen}
            buttonRef={(element) => {
              headerButtonRefs.current.organization = element;
            }}
          />
        ),
      },
      {
        accessorKey: "username",
        header: () => (
          <ColumnHeader
            label="USERNAME"
            fieldKey="username"
            onOpen={handleFilterOpen}
            buttonRef={(element) => {
              headerButtonRefs.current.username = element;
            }}
          />
        ),
      },
      {
        accessorKey: "email",
        header: () => (
          <ColumnHeader
            label="EMAIL"
            fieldKey="email"
            onOpen={handleFilterOpen}
            buttonRef={(element) => {
              headerButtonRefs.current.email = element;
            }}
          />
        ),
      },
      {
        accessorKey: "phoneNumber",
        header: () => (
          <ColumnHeader
            label="PHONE NUMBER"
            fieldKey="phoneNumber"
            onOpen={handleFilterOpen}
            buttonRef={(element) => {
              headerButtonRefs.current.phoneNumber = element;
            }}
          />
        ),
      },
      {
        accessorKey: "dateJoined",
        header: () => (
          <ColumnHeader
            label="DATE JOINED"
            fieldKey="dateJoined"
            onOpen={handleFilterOpen}
            buttonRef={(element) => {
              headerButtonRefs.current.dateJoined = element;
            }}
          />
        ),
      },
      {
        accessorKey: "status",
        header: () => (
          <ColumnHeader
            label="STATUS"
            fieldKey="status"
            onOpen={handleFilterOpen}
            buttonRef={(element) => {
              headerButtonRefs.current.status = element;
            }}
          />
        ),
        cell: ({ row }) => (
          <span
            className={`${styles.usersTable__statusBadge} ${getStatusVariant(
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
            <div
              className={styles.usersTable__actionCell}
              ref={isOpen ? actionMenuRef : null}
            >
              <button
                type="button"
                className={styles.usersTable__actionButton}
                onClick={() =>
                  setOpenActionMenuId((prev) =>
                    prev === user.id ? null : user.id
                  )
                }
              >
                <Image
                  src="/icons/users-dash/vertical-elipse.svg"
                  alt="actions"
                  width={16}
                  height={16}
                />
              </button>

              {isOpen ? (
                <div
                  className={`${styles.usersTable__actionMenu} ${
                    row.index >= data.length - 2
                      ? styles["usersTable__actionMenu--up"]
                      : ""
                  }`}
                >
                  {actionItems.map((actionKey) => {
                    const action = ACTION_CONFIG[actionKey];

                    if (action.key === "view-details") {
                      return (
                        <Link
                          key={action.key}
                          href={`/users/${user.id}`}
                          className={styles.usersTable__actionMenuItem}
                          onClick={() => {
                            saveUserDetails(user);
                            setOpenActionMenuId(null);
                          }}
                        >
                          <Image
                            src={action.icon}
                            alt=""
                            width={16}
                            height={16}
                          />
                          <span>{action.label}</span>
                        </Link>
                      );
                    }

                    return (
                      <button
                        key={action.key}
                        type="button"
                        className={styles.usersTable__actionMenuItem}
                      >
                        <Image
                          src={action.icon}
                          alt=""
                          width={16}
                          height={16}
                        />
                        <span>{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        },
      },
    ],
    [data.length, openActionMenuId]
  );

  return (
    <div className={styles.usersTable}>
      <div className={styles.usersTable__tableArea} ref={tableAreaRef}>
        {showFilter ? (
          <div
            ref={filterCardRef}
            className={styles.usersTable__filterCard}
            style={{ left: `${filterLeft}px` }}
          >
            {orderedFilterFields.map((field) => (
              <div className={styles.usersTable__field} key={field.key}>
                <label className={styles.usersTable__fieldLabel}>
                  {field.label}
                </label>

                {field.type === "select" ? (
                  <select
                    className={styles.usersTable__fieldControl}
                    value={filters[field.key]}
                    onChange={(event) =>
                      handleFilterChange(field.key, event.target.value)
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
                    className={styles.usersTable__fieldControl}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={filters[field.key]}
                    onChange={(event) =>
                      handleFilterChange(field.key, event.target.value)
                    }
                  />
                )}
              </div>
            ))}

            <div className={styles.usersTable__actions}>
              <button
                type="button"
                className={styles.usersTable__resetButton}
                onClick={handleResetFilters}
              >
                Reset
              </button>

              <button
                type="button"
                className={styles.usersTable__filterButton}
                onClick={() => setShowFilter(false)}
              >
                Filter
              </button>
            </div>
          </div>
        ) : null}

        {error ? (
          <div className={styles.usersTable__feedbackState}>{error}</div>
        ) : isLoading ? (
          <div className={styles.usersTable__feedbackState}>
            Loading users...
          </div>
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
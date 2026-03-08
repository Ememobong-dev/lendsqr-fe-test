"use client";

import { useMemo, useState } from "react";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import DataTable from "../Table/DataTable";
import styles from "./UsersTable.module.scss";
import Image from "next/image";

export type UserStatus = "Inactive" | "Pending" | "Blacklisted" | "Active";

export interface UserRow {
  organization: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateJoined: string;
  status: UserStatus;
}

const initialData: UserRow[] = [
  {
    organization: "Lendsqr",
    username: "Adedeji",
    email: "adedeji@lendsqr.com",
    phoneNumber: "08078903721",
    dateJoined: "May 15, 2020 10:00 AM",
    status: "Inactive",
  },
  {
    organization: "Irorun",
    username: "Debby Ogana",
    email: "debby2@irorun.com",
    phoneNumber: "08160780928",
    dateJoined: "Apr 30, 2020 10:00 AM",
    status: "Pending",
  },
  {
    organization: "Lendstar",
    username: "Grace Effiom",
    email: "grace@lendstar.com",
    phoneNumber: "07060780922",
    dateJoined: "Apr 30, 2020 10:00 AM",
    status: "Blacklisted",
  },
  {
    organization: "Lendsqr",
    username: "Tosin Dokunmu",
    email: "tosin@lendsqr.com",
    phoneNumber: "07003309226",
    dateJoined: "Apr 10, 2020 10:00 AM",
    status: "Pending",
  },
  {
    organization: "Lendstar",
    username: "Grace Effiom",
    email: "grace@lendstar.com",
    phoneNumber: "07060780922",
    dateJoined: "Apr 30, 2020 10:00 AM",
    status: "Active",
  },
  {
    organization: "Lendsqr",
    username: "Tosin Dokunmu",
    email: "tosin@lendsqr.com",
    phoneNumber: "08060780900",
    dateJoined: "Apr 10, 2020 10:00 AM",
    status: "Active",
  },
  {
    organization: "Lendstar",
    username: "Grace Effiom",
    email: "grace@lendstar.com",
    phoneNumber: "07060780922",
    dateJoined: "Apr 30, 2020 10:00 AM",
    status: "Blacklisted",
  },
  {
    organization: "Lendsqr",
    username: "Tosin Dokunmu",
    email: "tosin@lendsqr.com",
    phoneNumber: "08060780900",
    dateJoined: "Apr 10, 2020 10:00 AM",
    status: "Inactive",
  },
  {
    organization: "Lendstar",
    username: "Grace Effiom",
    email: "grace@lendstar.com",
    phoneNumber: "07060780922",
    dateJoined: "Apr 30, 2020 10:00 AM",
    status: "Inactive",
  },
];

type FilterState = {
  organization: string;
  username: string;
  email: string;
  date: string;
  phoneNumber: string;
  status: string;
};

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
    case "Inactive":
    default:
      return styles.inactive;
  }
}

export default function UsersTable() {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const filteredData = useMemo(() => {
    return initialData.filter((user) => {

      const matchesOrganization =
        !filters.organization ||
        user.organization.toLowerCase().includes(filters.organization.toLowerCase());

      const matchesUsername =
        !filters.username ||
        user.username.toLowerCase().includes(filters.username.toLowerCase());

      const matchesEmail =
        !filters.email ||
        user.email.toLowerCase().includes(filters.email.toLowerCase());

      const matchesDate =
        !filters.date ||
        user.dateJoined.toLowerCase().includes(filters.date.toLowerCase());

      const matchesPhone =
        !filters.phoneNumber ||
        user.phoneNumber.toLowerCase().includes(filters.phoneNumber.toLowerCase());

      const matchesStatus =
        !filters.status ||
        user.status.toLowerCase() === filters.status.toLowerCase();

      return (
        matchesOrganization &&
        matchesUsername &&
        matchesEmail &&
        matchesDate &&
        matchesPhone &&
        matchesStatus
      );
    });
  }, [filters]);

  const columns = useMemo<ColumnDef<UserRow>[]>(
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
              <Image src="/icons/users-dash/filter-icon.svg" width={14} height={14} alt="filter-icon" />
            </span>
          </button>
        ),
      },
      {
        accessorKey: "username",
        header: () => (
          <div className={styles.headerLabel}>
            USERNAME <span className={styles.filterIcon}>
              <Image src="/icons/users-dash/filter-icon.svg" width={14} height={14} alt="filter-icon" />
            </span>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: () => (
          <div className={styles.headerLabel}>
            EMAIL <span className={styles.filterIcon}>
              <Image src="/icons/users-dash/filter-icon.svg" width={14} height={14} alt="filter-icon" />
            </span>
          </div>
        ),
      },
      {
        accessorKey: "phoneNumber",
        header: () => (
          <div className={styles.headerLabel}>
            PHONE NUMBER <span className={styles.filterIcon}>
              <Image src="/icons/users-dash/filter-icon.svg" width={14} height={14} alt="filter-icon" />
            </span>
          </div>
        ),
      },
      {
        accessorKey: "dateJoined",
        header: () => (
          <div className={styles.headerLabel}>
            DATE JOINED <span className={styles.filterIcon}>
              <Image src="/icons/users-dash/filter-icon.svg" width={14} height={14} alt="filter-icon" />
            </span>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: () => (
          <div className={styles.headerLabel}>
            STATUS <span className={styles.filterIcon}>
              <Image src="/icons/users-dash/filter-icon.svg" width={14} height={14} alt="filter-icon" />
            </span>
          </div>
        ),
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <span className={`${styles.statusBadge} ${statusClassName(status)}`}>
              {status}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: () => <button className={styles.actionButton}><Image src={'/icons/users-dash/vertical-elipse.svg'} alt="icon" width={16} height={16} /></button>,
      },
    ],
    []
  );

  const handleFilterChange = (
    key: keyof FilterState,
    value: string
  ) => {
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
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableArea}>
        {showFilter && (
          <div className={styles.filterCard}>
            <div className={styles.field}>
              <label>Organization</label>
              <input
                type="text"
                placeholder="Select"
                value={filters.organization}
                onChange={(e) =>
                  handleFilterChange("organization", e.target.value)
                }
              />
            </div>

            <div className={styles.field}>
              <label>Username</label>
              <input
                type="text"
                placeholder="User"
                value={filters.username}
                onChange={(e) =>
                  handleFilterChange("username", e.target.value)
                }
              />
            </div>

            <div className={styles.field}>
              <label>Email</label>
              <input
                type="email"
                placeholder="Email"
                value={filters.email}
                onChange={(e) => handleFilterChange("email", e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label>Date</label>
              <input
                type="text"
                placeholder="Date"
                value={filters.date}
                onChange={(e) => handleFilterChange("date", e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label>Phone Number</label>
              <input
                type="text"
                placeholder="Phone Number"
                value={filters.phoneNumber}
                onChange={(e) =>
                  handleFilterChange("phoneNumber", e.target.value)
                }
              />
            </div>

            <div className={styles.field}>
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">Select</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
                <option value="Blacklisted">Blacklisted</option>
                <option value="Active">Active</option>
              </select>
            </div>

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

        <DataTable
          data={filteredData}
          columns={columns}
          showFooterPagination
          pageSizeOptions={[10, 25, 50, 100]}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
      </div>
    </div>
  );
}
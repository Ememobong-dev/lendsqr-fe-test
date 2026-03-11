"use client";

import { useEffect, useMemo, useState } from "react";
import UsersTable from "@/components/dashboard/UsersTable/UsersTable";
import StatCard from "@/components/dashboard/StatCard/StatCard";
import { fetchUsers } from "@/lib/api/users";
import { saveUsersCache } from "@/lib/storage/user.storage";
import type { UserRecord } from "@/types/user";
import styles from "./users.module.scss";

type UserStats = {
  total: number;
  active: number;
  withLoans: number;
  withSavings: number;
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isSubscribed = true;

    const loadUsers = async (): Promise<void> => {
      try {
        const response = await fetchUsers({ page: 1, limit: 500 });
        const records = response?.data ?? [];

        if (!isSubscribed) return;

        setUsers(records);
        saveUsersCache(records);
      } catch (error) {
        console.error("Failed to fetch users for stats", error);

        if (!isSubscribed) return;
        setUsers([]);
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    void loadUsers();

    return () => {
      isSubscribed = false;
    };
  }, []);

  const stats = useMemo<UserStats>(() => {
    return users.reduce(
      (acc, user) => {
        acc.total += 1;

        if (user.status === "Active") {
          acc.active += 1;
        }

        if (Number(user.educationEmployment?.loanRepayment) > 0) {
          acc.withLoans += 1;
        }

        if (Number(user.accountBalance) > 0) {
          acc.withSavings += 1;
        }

        return acc;
      },
      {
        total: 0,
        active: 0,
        withLoans: 0,
        withSavings: 0,
      }
    );
  }, [users]);

  const statCards = [
    {
      title: "Users",
      value: isLoading ? "..." : String(stats.total),
      icon: "/icons/users-dash/multiple-user.svg",
    },
    {
      title: "Active Users",
      value: isLoading ? "..." : String(stats.active),
      icon: "/icons/users-dash/active-users.svg",
    },
    {
      title: "Users With Loans",
      value: isLoading ? "..." : String(stats.withLoans),
      icon: "/icons/users-dash/loan-users.svg",
    },
    {
      title: "Users With Savings",
      value: isLoading ? "..." : String(stats.withSavings),
      icon: "/icons/users-dash/savings-users.svg",
    },
  ];

  return (
    <section className={styles.page}>
      <h1 className={styles.page__title}>Users</h1>

      <div className={styles.page__stats}>
        {statCards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
          />
        ))}
      </div>

      <UsersTable />
    </section>
  );
}
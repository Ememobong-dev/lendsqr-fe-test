// import StatCard from "@/components/dashboard/StatCard/StatCard";
// import UsersTable from "@/components/dashboard/UsersTable/UsersTable";
// import styles from "./users.module.scss";

// export default function UsersPage() {
//   return (
//     <div className={styles.page}>
//       <h1 className={styles.title}>Users</h1>

//       <div className={styles.stats}>
//         <StatCard title="Users" value="2,453" icon="/icons/users-dash/multiple-user.svg" />
//         <StatCard title="Active Users" value="2,453" icon="/icons/users-dash/active-users.svg" />
//         <StatCard title="Users With Loans" value="12,453" icon="/icons/users-dash/loan-users.svg" />
//         <StatCard title="Users With Savings" value="102,453" icon="/icons/users-dash/savings-users.svg" />
//       </div>

//       <UsersTable />
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import UsersTable from "@/components/dashboard/UsersTable/UsersTable";
import { fetchUsers } from "@/lib/api/users";
import { saveUsersCache } from "@/lib/storage/user.storage";
import { UserRecord } from "@/types/user";
import styles from "./users.module.scss";
import StatCard from "@/components/dashboard/StatCard/StatCard";

export default function UsersPage() {
  const [statsUsers, setStatsUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetchUsers({ page: 1, limit: 500 });
        setStatsUsers(response.data);
        saveUsersCache(response.data);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const activeUsers = statsUsers.filter((user) => user.status === "Active").length;
  const usersWithLoans = statsUsers.filter(
    (user) => Number(user.educationEmployment.loanRepayment) > 0
  ).length;
  const usersWithSavings = statsUsers.filter(
    (user) => Number(user.accountBalance) > 0
  ).length;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Users</h1>

      <div className={styles.stats}>
        <StatCard title="Users" value={loading ? "..." : String(statsUsers.length)} icon="/icons/users-dash/multiple-user.svg" />
        <StatCard title="Active Users" value={loading ? "..." : String(activeUsers)} icon="/icons/users-dash/active-users.svg" />
        <StatCard title="Users With Loans" value={loading ? "..." : String(usersWithLoans)} icon="/icons/users-dash/loan-users.svg" />
        <StatCard title="Users With Savings" value={loading ? "..." : String(usersWithSavings)} icon="/icons/users-dash/savings-users.svg" />
      </div>
      <UsersTable />
    </div>
  );
}
import StatCard from "@/components/dashboard/StatCard/StatCard";
import UsersTable from "@/components/dashboard/UsersTable/UsersTable";
import styles from "./users.module.scss";

export default function UsersPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Users</h1>

      <div className={styles.stats}>
        <StatCard title="Users" value="2,453" icon="/icons/users-dash/multiple-user.svg" />
        <StatCard title="Active Users" value="2,453" icon="/icons/users-dash/active-users.svg" />
        <StatCard title="Users With Loans" value="12,453" icon="/icons/users-dash/loan-users.svg" />
        <StatCard title="Users With Savings" value="102,453" icon="/icons/users-dash/savings-users.svg" />
      </div>

      <UsersTable />
    </div>
  );
}
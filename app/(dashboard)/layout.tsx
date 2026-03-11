import type { ReactNode } from "react";
import Sidebar from "@/components/dashboard/Sidebar/Sidebar";
import Topbar from "@/components/dashboard/Topbar/Topbar";
import styles from "./dashboard-layout.module.scss";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className={styles.layout}>
      <header className={styles.layout__topbar}>
        <Topbar />
      </header>

      <div className={styles.layout__body}>
        <aside className={styles.layout__sidebar}>
          <Sidebar />
        </aside>

        <main className={styles.layout__content}>{children}</main>
      </div>
    </div>
  );
}
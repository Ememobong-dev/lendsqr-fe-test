import Sidebar from "@/components/dashboard/Sidebar/Sidebar";
import Topbar from "@/components/dashboard/Topbar/Topbar";
import styles from "./dashboard-layout.module.scss";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layout}>
      <header className={styles.topbarPane}>
        <Topbar />
      </header>

      <div className={styles.bodyPane}>
        <aside className={styles.sidebarPane}>
          <Sidebar />
        </aside>

        <main className={styles.contentPane}>{children}</main>
      </div>
    </div>
  );
}
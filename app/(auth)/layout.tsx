import type { ReactNode } from "react";
import AuthIllustration from "@/components/auth/AuthIllustration";
import styles from "./auth-layout.module.scss";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className={styles.authLayout}>
      <section className={styles.leftPanel}>
        <AuthIllustration />
      </section>

      <section className={styles.rightPanel}>
        <div className={styles.formContainer}>{children}</div>
      </section>
    </main>
  );
}
import Image from "next/image";
import Link from "next/link";
import styles from "./Sidebar.module.scss";

type NavItem = {
  label: string;
  href?: string;
  icon: string;
  active?: boolean;
};

type NavSection = {
  title?: string;
  items: NavItem[];
};

const customerItems: NavItem[] = [
  { label: "Users", href: "/users", icon: "/icons/sidebar/users.svg", active: true },
  { label: "Guarantors", href: "#", icon: "/icons/sidebar/guarantors.svg" },
  { label: "Loans", href: "#", icon: "/icons/sidebar/loans.svg" },
  { label: "Decision Models", href: "#", icon: "/icons/sidebar/decision-models.svg" },
  { label: "Savings", href: "#", icon: "/icons/sidebar/savings.svg" },
  { label: "Loan Requests", href: "#", icon: "/icons/sidebar/loan-requests.svg" },
  { label: "Whitelist", href: "#", icon: "/icons/sidebar/whitelist.svg" },
  { label: "Karma", href: "#", icon: "/icons/sidebar/karma.svg" },
];

const businessItems: NavItem[] = [
  { label: "Organization", href: "#", icon: "/icons/sidebar/organization.svg" },
  { label: "Loan Products", href: "#", icon: "/icons/sidebar/loan-requests.svg" },
  { label: "Savings Products", href: "#", icon: "/icons/sidebar/savings-products.svg" },
  { label: "Fees and Charges", href: "#", icon: "/icons/sidebar/fees-charges.svg" },
  { label: "Transactions", href: "#", icon: "/icons/sidebar/transactions.svg" },
  { label: "Services", href: "#", icon: "/icons/sidebar/services.svg" },
  { label: "Service Account", href: "#", icon: "/icons/sidebar/service-account.svg" },
  { label: "Settlements", href: "#", icon: "/icons/sidebar/settlements.svg" },
  { label: "Reports", href: "#", icon: "/icons/sidebar/reports.svg" },
];

const settingItems: NavItem[] = [
  { label: "Preferences", href: "#", icon: "/icons/sidebar/preferences.svg" },
  { label: "Fees and Pricing", href: "#", icon: "/icons/sidebar/fees-pricing.svg" },
  { label: "Audit Logs", href: "#", icon: "/icons/sidebar/audit-logs.svg" },
];

const sections: NavSection[] = [
  { items: customerItems, title: "CUSTOMERS" },
  { items: businessItems, title: "BUSINESSES" },
  { items: settingItems, title: "SETTINGS" },
];

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.navScrollArea}>
        <button type="button" className={styles.switchOrg}>
          <span className={styles.iconWrap}>
            <Image
              src="/icons/sidebar/briefcase.svg"
              alt=""
              width={16}
              height={16}
            />
          </span>
          <span>Switch Organization</span>
          <span className={styles.chevron}>
            <Image
              src="/icons/sidebar/chevron-down.svg"
              alt=""
              width={14}
              height={14}
            />
          </span>
        </button>

        <div className={styles.dashboardLinkWrap}>
          <Link href="#" className={styles.dashboardLink}>
            <span className={styles.iconWrap}>
              <Image
                src="/icons/sidebar/home.svg"
                alt=""
                width={16}
                height={16}
              />
            </span>
            <span>Dashboard</span>
          </Link>
        </div>

        {sections.map((section) => (
          <div key={section.title} className={styles.section}>
            {section.title ? (
              <p className={styles.sectionTitle}>{section.title}</p>
            ) : null}

            <ul className={styles.menu}>
              {section.items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href ?? "#"}
                    className={item.active ? styles.activeItem : styles.item}
                  >
                    <span className={styles.iconWrap}>
                      <Image
                        src={item.icon}
                        alt=""
                        width={16}
                        height={16}
                      />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
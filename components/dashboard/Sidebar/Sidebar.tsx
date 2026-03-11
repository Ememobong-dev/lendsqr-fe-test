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
  {
    label: "Users",
    href: "/users",
    icon: "/icons/sidebar/users.svg",
    active: true,
  },
  {
    label: "Guarantors",
    href: "#",
    icon: "/icons/sidebar/guarantors.svg",
  },
  {
    label: "Loans",
    href: "#",
    icon: "/icons/sidebar/loans.svg",
  },
  {
    label: "Decision Models",
    href: "#",
    icon: "/icons/sidebar/decision-models.svg",
  },
  {
    label: "Savings",
    href: "#",
    icon: "/icons/sidebar/savings.svg",
  },
  {
    label: "Loan Requests",
    href: "#",
    icon: "/icons/sidebar/loan-requests.svg",
  },
  {
    label: "Whitelist",
    href: "#",
    icon: "/icons/sidebar/whitelist.svg",
  },
  {
    label: "Karma",
    href: "#",
    icon: "/icons/sidebar/karma.svg",
  },
];

const businessItems: NavItem[] = [
  {
    label: "Organization",
    href: "#",
    icon: "/icons/sidebar/briefcase.svg",
  },
  {
    label: "Loan Products",
    href: "#",
    icon: "/icons/sidebar/loan-requests.svg",
  },
  {
    label: "Savings Products",
    href: "#",
    icon: "/icons/sidebar/savings-products.svg",
  },
  {
    label: "Fees and Charges",
    href: "#",
    icon: "/icons/sidebar/fees-charges.svg",
  },
  {
    label: "Transactions",
    href: "#",
    icon: "/icons/sidebar/transactions.svg",
  },
  {
    label: "Services",
    href: "#",
    icon: "/icons/sidebar/services.svg",
  },
  {
    label: "Service Account",
    href: "#",
    icon: "/icons/sidebar/service-account.svg",
  },
  {
    label: "Settlements",
    href: "#",
    icon: "/icons/sidebar/settlements.svg",
  },
  {
    label: "Reports",
    href: "#",
    icon: "/icons/sidebar/reports.svg",
  },
];

const settingItems: NavItem[] = [
  {
    label: "Preferences",
    href: "#",
    icon: "/icons/sidebar/preferences.svg",
  },
  {
    label: "Fees and Pricing",
    href: "#",
    icon: "/icons/sidebar/fees-pricing.svg",
  },
  {
    label: "Audit Logs",
    href: "#",
    icon: "/icons/sidebar/audit-logs.svg",
  },
];

const sections: NavSection[] = [
  { title: "CUSTOMERS", items: customerItems },
  { title: "BUSINESSES", items: businessItems },
  { title: "SETTINGS", items: settingItems },
];

type SidebarLinkProps = {
  item: NavItem;
};

function SidebarLink({ item }: SidebarLinkProps) {
  const linkClassName = `${styles.sidebar__link} ${
    item.active ? styles["sidebar__link--active"] : ""
  }`;

  return (
    <Link href={item.href ?? "#"} className={linkClassName}>
      <span className={styles.sidebar__iconWrap}>
        <Image src={item.icon} alt="" width={16} height={16} />
      </span>
      <span className={styles.sidebar__linkLabel}>{item.label}</span>
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebar__scrollArea}>
        <button type="button" className={styles.sidebar__switchOrg}>
          <span className={styles.sidebar__iconWrap}>
            <Image
              src="/icons/sidebar/briefcase.svg"
              alt=""
              width={16}
              height={16}
            />
          </span>

          <span>Switch Organization</span>

          <span className={styles.sidebar__chevron}>
            <Image
              src="/icons/sidebar/chevron-down.svg"
              alt=""
              width={14}
              height={14}
            />
          </span>
        </button>

        <div className={styles.sidebar__dashboardLinkWrap}>
          <Link href="#" className={styles.sidebar__dashboardLink}>
            <span className={styles.sidebar__iconWrap}>
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
          <section key={section.title} className={styles.sidebar__section}>
            {section.title ? (
              <p className={styles.sidebar__sectionTitle}>{section.title}</p>
            ) : null}

            <ul className={styles.sidebar__menu}>
              {section.items.map((item) => (
                <li key={item.label} className={styles.sidebar__menuItem}>
                  <SidebarLink item={item} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </aside>
  );
}
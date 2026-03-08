"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./Topbar.module.scss";

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

const searchableItems = [
  "Users",
  "Guarantors",
  "Loans",
  "Savings",
  "Loan Requests",
  "Whitelist",
  "Karma",
  "Organization",
  "Reports",
  "Audit Logs",
];

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
  { label: "Organization", href: "#", icon: "/icons/sidebar/briefcase.svg" },
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

export default function Topbar() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const results = useMemo(() => {
    if (!submittedQuery.trim()) return [];
    return searchableItems.filter((item) =>
      item.toLowerCase().includes(submittedQuery.toLowerCase())
    );
  }, [submittedQuery]);

  const handleSearch = () => {
    setSubmittedQuery(query.trim());
  };

  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  useEffect(() => {
    if (!isDrawerOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isDrawerOpen]);

  return (
    <>
      <div className={styles.topbar}>
        <div className={styles.leftCluster}>
          <button
            type="button"
            className={styles.menuButton}
            aria-label={isDrawerOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={toggleDrawer}
          >
            <span className={styles.menuLine} />
            <span className={styles.menuLine} />
            <span className={styles.menuLine} />
          </button>

          <div className={styles.logoWrap}>
            <Image
              src="/brandlogo.svg"
              alt="Lendsqr"
              width={145}
              height={30}
              priority
            />
          </div>

          <div className={styles.searchArea}>
            <input
              type="text"
              placeholder="Search for anything"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.searchInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />

            <button
              type="button"
              onClick={handleSearch}
              className={styles.searchButton}
              aria-label="Search"
            >
              <Image
                src="/icons/search-icon.svg"
                alt=""
                width={14}
                height={14}
              />
            </button>

            {submittedQuery && (
              <div className={styles.searchDropdown}>
                {results.length > 0 ? (
                  results.map((result) => (
                    <button
                      type="button"
                      key={result}
                      className={styles.searchResult}
                    >
                      {result}
                    </button>
                  ))
                ) : (
                  <div className={styles.emptyResult}>No result found</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={styles.right}>
          <a href="#" className={styles.docsLink}>
            <p>Docs</p>
          </a>

          <button
            type="button"
            className={styles.notificationButton}
            aria-label="Notifications"
          >
            <Image
              src="/icons/bell.svg"
              alt=""
              width={24}
              height={24}
            />
          </button>

          <button type="button" className={styles.profileButton}>
            <Image
              src="/images/profile-img.png"
              alt="Adedeji"
              width={48}
              height={48}
              className={styles.avatar}
            />
            <span className={styles.profileName}>Adedeji</span>
            <Image
              src="/icons/chevron-dropdown.svg"
              alt=""
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>

      <div
        className={`${styles.drawerOverlay} ${isDrawerOpen ? styles.drawerOverlayOpen : ""}`}
        onClick={closeDrawer}
      />

      <aside className={`${styles.mobileDrawer} ${isDrawerOpen ? styles.mobileDrawerOpen : ""}`}>
        <div className={styles.mobileDrawerHeader}>
          <Image
            src="/brandlogo.svg"
            alt="Lendsqr"
            width={120}
            height={24}
          />

          <button
            type="button"
            className={styles.closeDrawerButton}
            onClick={closeDrawer}
            aria-label="Close navigation menu"
          >
            ×
          </button>
        </div>

        <div className={styles.mobileDrawerBody}>
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
            <Link href="#" className={styles.dashboardLink} onClick={closeDrawer}>
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
                      onClick={closeDrawer}
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
      </aside>
    </>
  );
}
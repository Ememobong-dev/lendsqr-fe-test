"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
] as const;

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

type MobileNavLinkProps = {
  item: NavItem;
  onNavigate: () => void;
};

function MobileNavLink({ item, onNavigate }: MobileNavLinkProps) {
  const linkClassName = `${styles.topbar__drawerLink} ${
    item.active ? styles["topbar__drawerLink--active"] : ""
  }`;

  return (
    <Link href={item.href ?? "#"} className={linkClassName} onClick={onNavigate}>
      <span className={styles.topbar__drawerIconWrap}>
        <Image src={item.icon} alt="" width={16} height={16} />
      </span>
      <span>{item.label}</span>
    </Link>
  );
}

export default function Topbar() {
  const router = useRouter();

  const [query, setQuery] = useState<string>("");
  const [submittedQuery, setSubmittedQuery] = useState<string>("");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);

  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const results = useMemo(() => {
    const normalizedQuery = submittedQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return searchableItems.filter((item) =>
      item.toLowerCase().includes(normalizedQuery)
    );
  }, [submittedQuery]);

  const handleSearch = (): void => {
    setSubmittedQuery(query.trim());
  };

  const handleToggleDrawer = (): void => {
    setIsDrawerOpen((prev) => !prev);
  };

  const handleCloseDrawer = (): void => {
    setIsDrawerOpen(false);
  };

  const handleToggleProfileMenu = (): void => {
    setIsProfileMenuOpen((prev) => !prev);
  };

  const handleCloseProfileMenu = (): void => {
    setIsProfileMenuOpen(false);
  };

  const handleLogout = (): void => {
    setIsProfileMenuOpen(false);
    router.push("/login");
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent): void => {
      const target = event.target as Node;

      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <>
      <div className={styles.topbar}>
        <div className={styles.topbar__leftCluster}>
          <button
            type="button"
            className={styles.topbar__menuButton}
            aria-label={
              isDrawerOpen ? "Close navigation menu" : "Open navigation menu"
            }
            onClick={handleToggleDrawer}
          >
            <span className={styles.topbar__menuLine} />
            <span className={styles.topbar__menuLine} />
            <span className={styles.topbar__menuLine} />
          </button>

          <div className={styles.topbar__logoWrap}>
            <Image
              src="/brandlogo.svg"
              alt="Lendsqr"
              width={145}
              height={30}
              priority
            />
          </div>

          <div className={styles.topbar__searchArea}>
            <input
              type="text"
              placeholder="Search for anything"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearch();
                }
              }}
              className={styles.topbar__searchInput}
            />

            <button
              type="button"
              onClick={handleSearch}
              className={styles.topbar__searchButton}
              aria-label="Search"
            >
              <Image
                src="/icons/search-icon.svg"
                alt=""
                width={14}
                height={14}
              />
            </button>

            {submittedQuery ? (
              <div className={styles.topbar__searchDropdown}>
                {results.length > 0 ? (
                  results.map((result) => (
                    <button
                      key={result}
                      type="button"
                      className={styles.topbar__searchResult}
                    >
                      {result}
                    </button>
                  ))
                ) : (
                  <div className={styles.topbar__emptyResult}>No result found</div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div className={styles.topbar__right}>
          <a href="#" className={styles.topbar__docsLink}>
            <p>Docs</p>
          </a>

          <button
            type="button"
            className={styles.topbar__notificationButton}
            aria-label="Notifications"
          >
            <Image src="/icons/bell.svg" alt="" width={24} height={24} />
          </button>

          <div
            className={styles.topbar__profileMenuWrap}
            ref={profileMenuRef}
          >
            <button
              type="button"
              className={styles.topbar__profileButton}
              onClick={handleToggleProfileMenu}
              aria-haspopup="menu"
              aria-expanded={isProfileMenuOpen}
            >
              <Image
                src="/images/profile-img.png"
                alt="Adedeji"
                width={48}
                height={48}
                className={styles.topbar__avatar}
              />
              <span className={styles.topbar__profileName}>Adedeji</span>
              <Image
                src="/icons/chevron-dropdown.svg"
                alt=""
                width={24}
                height={24}
              />
            </button>

            {isProfileMenuOpen ? (
              <div className={styles.topbar__profileDropdown} role="menu">
                <button
                  type="button"
                  className={styles.topbar__profileDropdownItem}
                  onClick={handleLogout}
                >
                  <span>Logout</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div
        className={`${styles.topbar__drawerOverlay} ${
          isDrawerOpen ? styles["topbar__drawerOverlay--open"] : ""
        }`}
        onClick={handleCloseDrawer}
      />

      <aside
        className={`${styles.topbar__mobileDrawer} ${
          isDrawerOpen ? styles["topbar__mobileDrawer--open"] : ""
        }`}
      >
        <div className={styles.topbar__mobileDrawerHeader}>
          <Image
            src="/brandlogo.svg"
            alt="Lendsqr"
            width={120}
            height={24}
          />

          <button
            type="button"
            className={styles.topbar__closeDrawerButton}
            onClick={handleCloseDrawer}
            aria-label="Close navigation menu"
          >
            ×
          </button>
        </div>

        <div className={styles.topbar__mobileDrawerBody}>
          <button type="button" className={styles.topbar__switchOrg}>
            <span className={styles.topbar__drawerIconWrap}>
              <Image
                src="/icons/sidebar/briefcase.svg"
                alt=""
                width={16}
                height={16}
              />
            </span>
            <span>Switch Organization</span>
            <span className={styles.topbar__chevron}>
              <Image
                src="/icons/sidebar/chevron-down.svg"
                alt=""
                width={14}
                height={14}
              />
            </span>
          </button>

          <div className={styles.topbar__dashboardLinkWrap}>
            <Link
              href="#"
              className={styles.topbar__dashboardLink}
              onClick={handleCloseDrawer}
            >
              <span className={styles.topbar__drawerIconWrap}>
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
            <section key={section.title} className={styles.topbar__drawerSection}>
              {section.title ? (
                <p className={styles.topbar__drawerSectionTitle}>
                  {section.title}
                </p>
              ) : null}

              <ul className={styles.topbar__drawerMenu}>
                {section.items.map((item) => (
                  <li
                    key={item.label}
                    className={styles.topbar__drawerMenuItem}
                  >
                    <MobileNavLink
                      item={item}
                      onNavigate={handleCloseDrawer}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </aside>
    </>
  );
}
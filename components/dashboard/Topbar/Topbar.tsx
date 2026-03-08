"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import styles from "./Topbar.module.scss";

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

export default function Topbar() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const results = useMemo(() => {
    if (!submittedQuery.trim()) return [];
    return searchableItems.filter((item) =>
      item.toLowerCase().includes(submittedQuery.toLowerCase())
    );
  }, [submittedQuery]);

  const handleSearch = () => {
    setSubmittedQuery(query);
  };

  return (
    <div className={styles.topbar}>
      <div className={styles.leftCluster}>
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

          {submittedQuery.trim() && (
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
          <p>
            Docs
          </p>
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
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchUserBySlug } from "@/lib/api/users";
import {
  getUserDetails,
  getUsersCache,
  saveUserDetails,
} from "@/lib/storage/user.storage";
import { formatCurrency } from "@/lib/mapper/user-mapper";
import type { UserRecord } from "@/types/user";
import styles from "./user-details.module.scss";

function renderStars(tier: number) {
  return Array.from({ length: 3 }, (_, index) => {
    const filled = index < tier;

    return (
      <Image
        key={index}
        src={
          filled
            ? "/icons/users-dash/star-filled.svg"
            : "/icons/users-dash/star-outline.svg"
        }
        alt=""
        width={16}
        height={16}
      />
    );
  });
}

const tabs = [
  "General Details",
  "Documents",
  "Bank Details",
  "Loans",
  "Savings",
  "App and System",
] as const;

export default function UserDetails({ slug }: { slug: string }) {
  const [user, setUser] = useState<UserRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("General Details");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        setError("");

        const storedUser = getUserDetails(slug);
        if (storedUser) {
          setUser(storedUser);
          return;
        }

        const cachedUsers = getUsersCache();
        const cachedMatch = cachedUsers.find((item) => item.slug === slug);

        if (cachedMatch) {
          setUser(cachedMatch);
          saveUserDetails(cachedMatch);
          return;
        }

        const apiUser = await fetchUserBySlug(slug);
        setUser(apiUser);
        saveUserDetails(apiUser);
      } catch {
        setError("Unable to load user details.");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [slug]);

  if (loading) {
    return <div className={styles.state}>Loading user details...</div>;
  }

  if (error) {
    return <div className={styles.state}>{error}</div>;
  }

  if (!user) {
    return <div className={styles.state}>User not found.</div>;
  }

  return (
    <section className={styles.page}>
      <Link href="/users" className={styles.page__backLink}>
        <Image src="/icons/back-icon.svg" alt="" width={24} height={24} />
        <span>Back to Users</span>
      </Link>

      <div className={styles.page__header}>
        <h1 className={styles.page__title}>User Details</h1>

        <div className={styles.page__actions}>
          <button
            type="button"
            className={`${styles.page__actionButton} ${styles["page__actionButton--blacklist"]}`}
          >
            BLACKLIST USER
          </button>
          <button
            type="button"
            className={`${styles.page__actionButton} ${styles["page__actionButton--activate"]}`}
          >
            ACTIVATE USER
          </button>
        </div>
      </div>

      <section className={styles.page__profileCard}>
        <div className={styles.page__profileTop}>
          <div className={styles.page__profileIdentity}>
            <div className={styles.page__avatarWrap}>
              <Image
                src={user.avatar}
                alt={user.fullName}
                width={100}
                height={100}
                className={styles.page__avatar}
              />
            </div>

            <div className={styles.page__identityText}>
              <h2 className={styles.page__userName}>{user.fullName}</h2>
              <p className={styles.page__userCode}>LSQF{user.id.slice(-8)}</p>
            </div>
          </div>

          <div className={styles.page__profileDivider} />

          <div className={styles.page__tierBlock}>
            <p className={styles.page__tierTitle}>User&apos;s Tier</p>
            <div className={styles.page__tierStars}>{renderStars(user.tier)}</div>
          </div>

          <div className={styles.page__profileDivider} />

          <div className={styles.page__balanceBlock}>
            <h3 className={styles.page__balance}>
              ₦{formatCurrency(user.accountBalance)}
            </h3>
            <p className={styles.page__accountMeta}>
              {user.accountNumber}/{user.bankName}
            </p>
          </div>
        </div>

        <div className={styles.page__tabs}>
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`${styles.page__tab} ${
                activeTab === tab ? styles["page__tab--active"] : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {activeTab === "General Details" ? (
        <section className={styles.page__detailsCard}>
          <div className={styles.page__section}>
            <h3 className={styles.page__sectionHeading}>Personal Information</h3>
            <div className={styles.page__sectionContent}>
              <div className={styles.page__detailsGrid}>
                <div className={styles.page__detailItem}>
                  <span className={styles.page__detailLabel}>FULL NAME</span>
                  <p className={styles.page__detailValue}>
                    {user.personalInformation.fullName}
                  </p>
                </div>

                <div className={styles.page__detailItem}>
                  <span className={styles.page__detailLabel}>PHONE NUMBER</span>
                  <p className={styles.page__detailValue}>
                    {user.personalInformation.phoneNumber}
                  </p>
                </div>

                <div className={styles.page__detailItem}>
                  <span className={styles.page__detailLabel}>EMAIL ADDRESS</span>
                  <p className={styles.page__detailValue}>
                    {user.personalInformation.email}
                  </p>
                </div>

                <div className={styles.page__detailItem}>
                  <span className={styles.page__detailLabel}>BVN</span>
                  <p className={styles.page__detailValue}>
                    {user.personalInformation.bvn}
                  </p>
                </div>

                <div className={styles.page__detailItem}>
                  <span className={styles.page__detailLabel}>GENDER</span>
                  <p className={styles.page__detailValue}>
                    {user.personalInformation.gender}
                  </p>
                </div>

                <div className={styles.page__detailItem}>
                  <span className={styles.page__detailLabel}>MARITAL STATUS</span>
                  <p className={styles.page__detailValue}>
                    {user.personalInformation.maritalStatus}
                  </p>
                </div>

                <div className={styles.page__detailItem}>
                  <span className={styles.page__detailLabel}>CHILDREN</span>
                  <p className={styles.page__detailValue}>
                    {user.personalInformation.children}
                  </p>
                </div>

                <div className={styles.page__detailItem}>
                  <span className={styles.page__detailLabel}>
                    TYPE OF RESIDENCE
                  </span>
                  <p className={styles.page__detailValue}>
                    {user.personalInformation.typeOfResidence}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.page__section}>
            <h3 className={styles.page__sectionHeading}>
              Education and Employment
            </h3>
            <div className={styles.page__sectionContent}>
              <div
                className={`${styles.page__detailsGrid} ${styles["page__detailsGrid--fourCol"]}`}
              >
                <div className={styles.page__detailItem}>
                  <span className={styles.page__detailLabel}>
                    LEVEL OF EDUCATION
                  </span>
                  <p className={styles.page__detailValue}>
                    {user.educationEmployment.levelOfEducation}
                  </p>
                </div>

                <div className={styles.page__detailItem}>
                  <span className={styles.page__detailLabel}>
                    EMPLOYMENT STATUS
                  </span>
                  <p className={styles.page__detailValue}>
                    {user.educationEmployment.employmentStatus}
                  </p>
                </div>

                <div className={styles.page__detailItem}>
                  <span className={styles.page__detailLabel}>
                    SECTOR OF EMPLOYMENT
                  </span>
                  <p className={styles.page__detailValue}>
                    {user.educationEmployment.sectorOfEmployment}
                  </p>
                </div>

                <div className={styles.page__detailItem}>
                  <span className={styles.page__detailLabel}>
                    DURATION OF EMPLOYMENT
                  </span>
                  <p className={styles.page__detailValue}>
                    {user.educationEmployment.durationOfEmployment}
                  </p>
                </div>

                <div className={styles.page__detailItem}>
                  <span className={styles.page__detailLabel}>OFFICE EMAIL</span>
                  <p className={styles.page__detailValue}>
                    {user.educationEmployment.officeEmail}
                  </p>
                </div>

                <div className={styles.page__detailItem}>
                  <span className={styles.page__detailLabel}>MONTHLY INCOME</span>
                  <p className={styles.page__detailValue}>
                    {user.educationEmployment.monthlyIncome}
                  </p>
                </div>

                <div className={styles.page__detailItem}>
                  <span className={styles.page__detailLabel}>LOAN REPAYMENT</span>
                  <p className={styles.page__detailValue}>
                    ₦
                    {formatCurrency(
                      Number(user.educationEmployment.loanRepayment)
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.page__section}>
            <h3 className={styles.page__sectionHeading}>Socials</h3>
            <div className={styles.page__sectionContent}>
              <div className={styles.page__detailsGrid}>
                <div className={styles.page__detailItem}>
                  <span className={styles.page__detailLabel}>TWITTER</span>
                  <p className={styles.page__detailValue}>{user.socials.twitter}</p>
                </div>

                <div className={styles.page__detailItem}>
                  <span className={styles.page__detailLabel}>FACEBOOK</span>
                  <p className={styles.page__detailValue}>{user.socials.facebook}</p>
                </div>

                <div className={styles.page__detailItem}>
                  <span className={styles.page__detailLabel}>INSTAGRAM</span>
                  <p className={styles.page__detailValue}>{user.socials.instagram}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.page__section}>
            <h3 className={styles.page__sectionHeading}>Guarantor</h3>

            {user.guarantor.map((person, index) => (
              <div
                key={`${person.email}-${index}`}
                className={
                  index > 0
                    ? styles.page__guarantorBlock
                    : styles.page__sectionContent
                }
              >
                <div className={styles.page__detailsGrid}>
                  <div className={styles.page__detailItem}>
                    <span className={styles.page__detailLabel}>FULL NAME</span>
                    <p className={styles.page__detailValue}>{person.fullName}</p>
                  </div>

                  <div className={styles.page__detailItem}>
                    <span className={styles.page__detailLabel}>PHONE NUMBER</span>
                    <p className={styles.page__detailValue}>
                      {person.phoneNumber}
                    </p>
                  </div>

                  <div className={styles.page__detailItem}>
                    <span className={styles.page__detailLabel}>
                      EMAIL ADDRESS
                    </span>
                    <p className={styles.page__detailValue}>{person.email}</p>
                  </div>

                  <div className={styles.page__detailItem}>
                    <span className={styles.page__detailLabel}>RELATIONSHIP</span>
                    <p className={styles.page__detailValue}>
                      {person.relationship}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className={styles.page__detailsCard}>
          <div className={styles.page__tabPlaceholder}>{activeTab}</div>
        </section>
      )}
    </section>
  );
}
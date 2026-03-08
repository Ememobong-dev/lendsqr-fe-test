"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchUserBySlug } from "@/lib/api/users";
import { getUserDetails, getUsersCache, saveUserDetails } from "@/lib/storage/user.storage";
import { formatCurrency } from "@/lib/mapper/user-mapper";
import { UserRecord } from "@/types/user";
import styles from "./user-details.module.scss";

function renderStars(tier: number) {
  return Array.from({ length: 3 }, (item, index) => {
    const filled = index < tier;
    return (
      <Image
        key={index}
        src={filled ? "/icons/users-dash/star-filled.svg" : "/icons/users-dash/star-outline.svg"}
        alt=""
        width={16}
        height={16}
      />
    );
  });
}

export default function UserDetails({ slug }: { slug: string }) {
  const [user, setUser] = useState<UserRecord | null>(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) return <div className={styles.state}>Loading user details...</div>;
  if (error) return <div className={styles.state}>{error}</div>;
  if (!user) return <div className={styles.state}>User not found.</div>;

  return (
    <div className={styles.page}>
      <Link href="/users" className={styles.backLink}>
        <Image src="/icons/back-icon.svg" alt="" width={24} height={24} />
        <span>Back to Users</span>
      </Link>

      <div className={styles.headerRow}>
        <h1 className={styles.pageTitle}>User Details</h1>

        <div className={styles.headerActions}>
          <button type="button" className={styles.blacklistButton}>
            BLACKLIST USER
          </button>
          <button type="button" className={styles.activateButton}>
            ACTIVATE USER
          </button>
        </div>
      </div>

      <section className={styles.profileCard}>
        <div className={styles.profileTop}>
          <div className={styles.profileIdentity}>
            <div className={styles.avatarWrap}>
              <Image
                src={user.avatar}
                alt={user.fullName}
                width={100}
                height={100}
                className={styles.avatar}
              />
            </div>

            <div className={styles.identityText}>
              <h2 className={styles.userName}>{user.fullName}</h2>
              <p className={styles.userCode}>LSQF{user.id.slice(-8)}</p>
            </div>
          </div>

          <div className={styles.profileDivider} />

          <div className={styles.tierBlock}>
            <p className={styles.tierTitle}>User&apos;s Tier</p>
            <div className={styles.tierStars}>{renderStars(user.tier)}</div>
          </div>

          <div className={styles.profileDivider} />

          <div className={styles.balanceBlock}>
            <h3 className={styles.balance}>₦{formatCurrency(user.accountBalance)}</h3>
            <p className={styles.accountMeta}>
              {user.accountNumber}/{user.bankName}
            </p>
          </div>
        </div>

        <div className={styles.tabs}>
          <button type="button" className={styles.activeTab}>
            General Details
          </button>
          <button type="button" className={styles.tab}>
            Documents
          </button>
          <button type="button" className={styles.tab}>
            Bank Details
          </button>
          <button type="button" className={styles.tab}>
            Loans
          </button>
          <button type="button" className={styles.tab}>
            Savings
          </button>
          <button type="button" className={styles.tab}>
            App and System
          </button>
        </div>
      </section>

      <section className={styles.detailsCard}>
        <div className={styles.sectionBlock}>
          <h3 className={styles.sectionHeading}>Personal Information</h3>
          <div className={styles.sectionContent}>
            <div className={styles.detailsGrid}>
              <div><span>FULL NAME</span><p>{user.personalInformation.fullName}</p></div>
              <div><span>PHONE NUMBER</span><p>{user.personalInformation.phoneNumber}</p></div>
              <div><span>EMAIL ADDRESS</span><p>{user.personalInformation.email}</p></div>
              <div><span>BVN</span><p>{user.personalInformation.bvn}</p></div>
              <div><span>GENDER</span><p>{user.personalInformation.gender}</p></div>
              <div><span>MARITAL STATUS</span><p>{user.personalInformation.maritalStatus}</p></div>
              <div><span>CHILDREN</span><p>{user.personalInformation.children}</p></div>
              <div><span>TYPE OF RESIDENCE</span><p>{user.personalInformation.typeOfResidence}</p></div>
            </div>
          </div>
        </div>

        <div className={styles.sectionBlock}>
          <h3 className={styles.sectionHeading}>Education and Employment</h3>
          <div className={styles.sectionContent}>
            <div className={`${styles.detailsGrid} ${styles.fourCol}`}>
              <div><span>LEVEL OF EDUCATION</span><p>{user.educationEmployment.levelOfEducation}</p></div>
              <div><span>EMPLOYMENT STATUS</span><p>{user.educationEmployment.employmentStatus}</p></div>
              <div><span>SECTOR OF EMPLOYMENT</span><p>{user.educationEmployment.sectorOfEmployment}</p></div>
              <div><span>DURATION OF EMPLOYMENT</span><p>{user.educationEmployment.durationOfEmployment}</p></div>
              <div><span>OFFICE EMAIL</span><p>{user.educationEmployment.officeEmail}</p></div>
              <div><span>MONTHLY INCOME</span><p>{user.educationEmployment.monthlyIncome}</p></div>
              <div><span>LOAN REPAYMENT</span><p>₦{formatCurrency(Number(user.educationEmployment.loanRepayment))}</p></div>
            </div>
          </div>
        </div>

        <div className={styles.sectionBlock}>
          <h3 className={styles.sectionHeading}>Socials</h3>
          <div className={styles.sectionContent}>
            <div className={styles.detailsGrid}>
              <div><span>TWITTER</span><p>{user.socials.twitter}</p></div>
              <div><span>FACEBOOK</span><p>{user.socials.facebook}</p></div>
              <div><span>INSTAGRAM</span><p>{user.socials.instagram}</p></div>
            </div>
          </div>
        </div>

        <div className={styles.sectionBlock}>
          <h3 className={styles.sectionHeading}>Guarantor</h3>

          {user.guarantor.map((person, index) => (
            <div
              key={`${person.email}-${index}`}
              className={index > 0 ? styles.guarantorBlock : styles.sectionContent}
            >
              <div className={styles.detailsGrid}>
                <div><span>FULL NAME</span><p>{person.fullName}</p></div>
                <div><span>PHONE NUMBER</span><p>{person.phoneNumber}</p></div>
                <div><span>EMAIL ADDRESS</span><p>{person.email}</p></div>
                <div><span>RELATIONSHIP</span><p>{person.relationship}</p></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
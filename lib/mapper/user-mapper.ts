import { UserRecord, UserStatus } from "@/types/user";

function normalizeStatus(value: string): UserStatus {
  const allowed: UserStatus[] = ["Inactive", "Pending", "Blacklisted", "Active"];
  return allowed.includes(value as UserStatus) ? (value as UserStatus) : "Inactive";
}

export function mapUserRecord(raw: UserRecord): UserRecord {
  return {
    ...raw,
    status: normalizeStatus(raw.status),
    tier: Number(raw.tier) || 1,
    accountBalance: Number(raw.accountBalance) || 0,
    accountNumber: String(raw.accountNumber),
    personalInformation: {
      ...raw.personalInformation,
      bvn: String(raw.personalInformation.bvn),
    },
    educationEmployment: {
      ...raw.educationEmployment,
      loanRepayment: Number(raw.educationEmployment.loanRepayment) || 0,
    },
  };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
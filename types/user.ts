export type UserStatus = "Inactive" | "Pending" | "Blacklisted" | "Active";

export interface UserPersonalInformation {
  fullName: string;
  phoneNumber: string;
  email: string;
  bvn: string;
  gender: string;
  maritalStatus: string;
  children: number | string;
  typeOfResidence: string;
}

export interface UserEducationEmployment {
  levelOfEducation: string;
  employmentStatus: string;
  sectorOfEmployment: string;
  durationOfEmployment: string;
  officeEmail: string;
  monthlyIncome: string;
  loanRepayment: number | string;
}

export interface UserSocials {
  twitter: string;
  facebook: string;
  instagram: string;
}

export interface UserGuarantor {
  fullName: string;
  phoneNumber: string;
  email: string;
  relationship: string;
}

export interface UserRecord {
  id: string;
  slug: string;
  index: number;
  organization: string;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateJoined: string;
  status: UserStatus;
  tier: number;
  avatar: string;
  accountBalance: number;
  accountNumber: string;
  bankName: string;
  personalInformation: UserPersonalInformation;
  educationEmployment: UserEducationEmployment;
  socials: UserSocials;
  guarantor: UserGuarantor[];
}

export interface UsersApiResponse {
  data: UserRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
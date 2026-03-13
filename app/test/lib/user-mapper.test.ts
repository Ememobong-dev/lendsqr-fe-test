import { describe, expect, it } from "vitest";
import { mapUserRecord } from "@/lib/mapper/user-mapper";

describe("mapUserRecord", () => {
  it("maps valid user data correctly", () => {
    const input = {
      id: "1",
      slug: "john-doe-1",
      index: 1,
      organization: "Lendsqr",
      username: "johndoe",
      fullName: "John Doe",
      email: "john@example.com",
      phoneNumber: "08012345678",
      dateJoined: "May 15, 2020 10:00 AM",
      status: "Active",
      tier: 2,
      avatar: "https://i.pravatar.cc/150?img=39",
      accountBalance: 50000,
      accountNumber: "1234567890",
      bankName: "Providus Bank",
      personalInformation: {
        fullName: "John Doe",
        phoneNumber: "08012345678",
        email: "john@example.com",
        bvn: "12345678901",
        gender: "Male",
        maritalStatus: "Single",
        children: 0,
        typeOfResidence: "Rented Apartment",
      },
      educationEmployment: {
        levelOfEducation: "B.Sc",
        employmentStatus: "Employed",
        sectorOfEmployment: "Technology",
        durationOfEmployment: "2 years",
        officeEmail: "john@company.com",
        monthlyIncome: "₦200,000.00 - ₦400,000.00",
        loanRepayment: 20000,
      },
      socials: {
        twitter: "@john",
        facebook: "John Doe",
        instagram: "@john",
      },
      guarantor: [],
    };

    const result = mapUserRecord(input as never);

    expect(result.status).toBe("Active");
    expect(result.tier).toBe(2);
    expect(result.accountBalance).toBe(50000);
    expect(result.accountNumber).toBe("1234567890");
    expect(result.personalInformation.bvn).toBe("12345678901");
    expect(result.educationEmployment.loanRepayment).toBe(20000);
  });

  it("falls back safely for invalid values", () => {
    const input = {
      id: "1",
      slug: "john-doe-1",
      index: 1,
      organization: "Lendsqr",
      username: "johndoe",
      fullName: "John Doe",
      email: "john@example.com",
      phoneNumber: "08012345678",
      dateJoined: "May 15, 2020 10:00 AM",
      status: "Unknown",
      tier: "bad-tier",
      avatar: "https://i.pravatar.cc/150?img=45",
      accountBalance: "bad-balance",
      accountNumber: 1234567890,
      bankName: "Providus Bank",
      personalInformation: {
        fullName: "John Doe",
        phoneNumber: "08012345678",
        email: "john@example.com",
        bvn: 12345678901,
        gender: "Male",
        maritalStatus: "Single",
        children: 0,
        typeOfResidence: "Rented Apartment",
      },
      educationEmployment: {
        levelOfEducation: "B.Sc",
        employmentStatus: "Employed",
        sectorOfEmployment: "Technology",
        durationOfEmployment: "2 years",
        officeEmail: "john@company.com",
        monthlyIncome: "₦200,000.00 - ₦400,000.00",
        loanRepayment: "bad-loan",
      },
      socials: {
        twitter: "@john",
        facebook: "John Doe",
        instagram: "@john",
      },
      guarantor: [],
    };

    const result = mapUserRecord(input as never);

    expect(result.status).toBe("Inactive");
    expect(result.tier).toBe(1);
    expect(result.accountBalance).toBe(0);
    expect(result.accountNumber).toBe("1234567890");
    expect(result.personalInformation.bvn).toBe("12345678901");
    expect(result.educationEmployment.loanRepayment).toBe(0);
  });
});
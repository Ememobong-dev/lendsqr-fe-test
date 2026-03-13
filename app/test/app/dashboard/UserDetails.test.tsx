import UserDetails from "@/app/(dashboard)/users/[id]/UserDetails";
import { fetchUserBySlug } from "@/lib/api/users";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/users", () => ({
  fetchUserBySlug: vi.fn(async () => ({
    id: "12345678",
    slug: "john-doe-1",
    fullName: "John Doe",
    tier: 2,
    avatar: "/images/profile-img.png",
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
  })),
}));

vi.mock("@/lib/storage/user.storage", () => ({
  getUserDetails: vi.fn(() => null),
  getUsersCache: vi.fn(() => []),
  saveUserDetails: vi.fn(),
}));

describe("UserDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows general details by default", async () => {
    render(<UserDetails slug="john-doe-1" />);

    expect(
      await screen.findByText(/personal information/i)
    ).toBeInTheDocument();
  });

  it("switches tab content when another tab is clicked", async () => {
    const user = userEvent.setup();

    render(<UserDetails slug="john-doe-1" />);

    expect(
      await screen.findByText(/personal information/i)
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /documents/i }));

    expect(
      screen.getByRole("button", { name: /documents/i })
    ).toBeInTheDocument();

    expect(screen.getByText("Documents", { selector: "div" })).toBeInTheDocument();
  });

  it("shows loading state before user data resolves", () => {
    vi.mocked(fetchUserBySlug).mockReturnValueOnce(
      new Promise(() => {}) as ReturnType<typeof fetchUserBySlug>
    );

    render(<UserDetails slug="john-doe-1" />);

    expect(screen.getByText(/loading user details/i)).toBeInTheDocument();
  });

  it("renders guarantor details when guarantors exist", async () => {
    vi.mocked(fetchUserBySlug).mockResolvedValueOnce({
      id: "12345678",
      slug: "john-doe-1",
      fullName: "John Doe",
      tier: 2,
      avatar: "/images/profile-img.png",
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
      guarantor: [
        {
          fullName: "Ella Carver",
          phoneNumber: "+234 8339061063",
          email: "ellacarver@steelfab.com",
          relationship: "Friend",
        },
        {
          fullName: "Santiago Snider",
          phoneNumber: "+234 8147887415",
          email: "santiagosnider@steelfab.com",
          relationship: "Mother",
        },
      ],
    } as never);

    render(<UserDetails slug="john-doe-1" />);

    expect(await screen.findByText(/guarantor/i)).toBeInTheDocument();
    expect(screen.getByText("Ella Carver")).toBeInTheDocument();
    expect(screen.getByText("Friend")).toBeInTheDocument();
    expect(screen.getByText("Santiago Snider")).toBeInTheDocument();
    expect(screen.getByText("Mother")).toBeInTheDocument();
  });
});
import { render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UsersPage from "@/app/(dashboard)/users/page";
import { fetchUsers } from "@/lib/api/users";
import { saveUsersCache } from "@/lib/storage/user.storage";

vi.mock("@/components/dashboard/UsersTable/UsersTable", () => ({
  default: () => <div>Mock UsersTable</div>,
}));

vi.mock("@/components/dashboard/StatCard/StatCard", () => ({
  default: ({
    title,
    value,
  }: {
    title: string;
    value: string;
    icon: string;
  }) => (
    <div data-testid={`stat-card-${title}`}>
      <span>{title}</span>
      <span>{value}</span>
    </div>
  ),
}));

vi.mock("@/lib/api/users", () => ({
  fetchUsers: vi.fn(),
}));

vi.mock("@/lib/storage/user.storage", () => ({
  saveUsersCache: vi.fn(),
}));

describe("UsersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading values initially", () => {
    vi.mocked(fetchUsers).mockReturnValueOnce(new Promise(() => {}) as never);

    render(<UsersPage />);

    expect(
      screen.getByRole("heading", { name: /^users$/i })
    ).toBeInTheDocument();

    expect(within(screen.getByTestId("stat-card-Users")).getByText("...")).toBeInTheDocument();
    expect(
      within(screen.getByTestId("stat-card-Active Users")).getByText("...")
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId("stat-card-Users With Loans")).getByText("...")
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId("stat-card-Users With Savings")).getByText("...")
    ).toBeInTheDocument();
  });

  it("renders calculated stats from fetched users", async () => {
    vi.mocked(fetchUsers).mockResolvedValueOnce({
      data: [
        {
          id: "1",
          slug: "john-doe-1",
          fullName: "John Doe",
          status: "Active",
          tier: 2,
          avatar: "/avatar.png",
          accountBalance: 50000,
          accountNumber: "1234567890",
          bankName: "Providus Bank",
          organization: "Lendsqr",
          username: "john",
          email: "john@example.com",
          phoneNumber: "08012345678",
          dateJoined: "May 15, 2020",
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
        },
        {
          id: "2",
          slug: "jane-doe-2",
          fullName: "Jane Doe",
          status: "Inactive",
          tier: 1,
          avatar: "/avatar.png",
          accountBalance: 0,
          accountNumber: "0987654321",
          bankName: "GTBank",
          organization: "Lendsqr",
          username: "jane",
          email: "jane@example.com",
          phoneNumber: "08087654321",
          dateJoined: "May 16, 2020",
          personalInformation: {
            fullName: "Jane Doe",
            phoneNumber: "08087654321",
            email: "jane@example.com",
            bvn: "10987654321",
            gender: "Female",
            maritalStatus: "Single",
            children: 0,
            typeOfResidence: "Owned Apartment",
          },
          educationEmployment: {
            levelOfEducation: "B.Sc",
            employmentStatus: "Unemployed",
            sectorOfEmployment: "Technology",
            durationOfEmployment: "1 year",
            officeEmail: "jane@company.com",
            monthlyIncome: "₦100,000.00 - ₦200,000.00",
            loanRepayment: 0,
          },
          socials: {
            twitter: "@jane",
            facebook: "Jane Doe",
            instagram: "@jane",
          },
          guarantor: [],
        },
      ],
    } as never);

    render(<UsersPage />);

    await waitFor(() => {
      expect(
        within(screen.getByTestId("stat-card-Users")).getByText("2")
      ).toBeInTheDocument();
    });

    expect(
      within(screen.getByTestId("stat-card-Active Users")).getByText("1")
    ).toBeInTheDocument();

    expect(
      within(screen.getByTestId("stat-card-Users With Loans")).getByText("1")
    ).toBeInTheDocument();

    expect(
      within(screen.getByTestId("stat-card-Users With Savings")).getByText("1")
    ).toBeInTheDocument();

    expect(screen.getByText("Mock UsersTable")).toBeInTheDocument();
  });

  it("saves fetched users to cache", async () => {
    const users = [
      {
        id: "1",
        slug: "john-doe-1",
        fullName: "John Doe",
        status: "Active",
        tier: 2,
        avatar: "/avatar.png",
        accountBalance: 50000,
        accountNumber: "1234567890",
        bankName: "Providus Bank",
        organization: "Lendsqr",
        username: "john",
        email: "john@example.com",
        phoneNumber: "08012345678",
        dateJoined: "May 15, 2020",
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
      },
    ];

    vi.mocked(fetchUsers).mockResolvedValueOnce({
      data: users,
    } as never);

    render(<UsersPage />);

    await waitFor(() => {
      expect(saveUsersCache).toHaveBeenCalledWith(users);
    });
  });

  it("handles fetch failure without crashing", async () => {
    vi.mocked(fetchUsers).mockRejectedValueOnce(new Error("Failed"));

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    render(<UsersPage />);

    await waitFor(() => {
      expect(
        within(screen.getByTestId("stat-card-Users")).getByText("0")
      ).toBeInTheDocument();
    });

    expect(
      within(screen.getByTestId("stat-card-Active Users")).getByText("0")
    ).toBeInTheDocument();

    expect(
      within(screen.getByTestId("stat-card-Users With Loans")).getByText("0")
    ).toBeInTheDocument();

    expect(
      within(screen.getByTestId("stat-card-Users With Savings")).getByText("0")
    ).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
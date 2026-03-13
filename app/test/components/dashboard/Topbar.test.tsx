import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import Topbar from "@/components/dashboard/Topbar/Topbar";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...rest
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("Topbar", () => {
  beforeEach(() => {
    push.mockClear();
    document.body.style.overflow = "";
  });

  it("shows matching search results after search", async () => {
    const user = userEvent.setup();

    render(<Topbar />);

    await user.type(
      screen.getByPlaceholderText(/search for anything/i),
      "user"
    );
    await user.click(screen.getByRole("button", { name: /search/i }));

    const resultButtons = await screen.findAllByRole("button", { name: "Users" });

    expect(resultButtons.length).toBeGreaterThan(0);
    expect(
      resultButtons.some((button) =>
        button.className.includes("topbar__searchResult")
      )
    ).toBe(true);
  });

  it("shows no result found for an unmatched search", async () => {
    const user = userEvent.setup();

    render(<Topbar />);

    await user.type(
      screen.getByPlaceholderText(/search for anything/i),
      "zzzzzzz"
    );
    await user.click(screen.getByRole("button", { name: /search/i }));

    expect(screen.getByText(/no result found/i)).toBeInTheDocument();
  });

  it("opens and closes the mobile drawer", async () => {
    const user = userEvent.setup();

    render(<Topbar />);

    const openButton = screen.getByRole("button", {
      name: /open navigation menu/i,
    });

    await user.click(openButton);

    expect(document.body.style.overflow).toBe("hidden");

    const closeButtons = screen.getAllByRole("button", {
      name: /close navigation menu/i,
    });

    expect(closeButtons.length).toBeGreaterThan(0);

    await user.click(closeButtons[0]);

    await waitFor(() => {
      expect(document.body.style.overflow).toBe("");
    });
  });

  it("opens profile menu and logs out", async () => {
    const user = userEvent.setup();

    render(<Topbar />);

    const profileButtons = screen.getAllByRole("button");
    const profileButton = profileButtons.find((button) =>
      button.textContent?.includes("Adedeji")
    );

    expect(profileButton).toBeDefined();

    await user.click(profileButton!);
    await user.click(screen.getByRole("button", { name: /logout/i }));

    expect(push).toHaveBeenCalledWith("/login");
  });
});
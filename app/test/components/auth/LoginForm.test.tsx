import LoginForm from "@/components/auth/LoginForm";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    push.mockClear();
  });

  it("redirects to /users when email and password are valid", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText(/email/i), "test@example.com");
    await user.type(screen.getByPlaceholderText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(push).toHaveBeenCalledWith("/users");
  });

  it("shows error for invalid email", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText(/email/i), "wrong-email");
    await user.type(screen.getByPlaceholderText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(
      screen.getByText(/enter a valid email address/i)
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("shows error for password shorter than 8 characters", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText(/email/i), "test@example.com");
    await user.type(screen.getByPlaceholderText(/password/i), "12345");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(
      screen.getByText(/password must be at least 8 characters/i)
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("shows required errors when submitted empty", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });
});
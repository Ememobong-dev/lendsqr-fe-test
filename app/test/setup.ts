import React from "react";
import "@testing-library/jest-dom";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

type MockNextImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
  priority?: boolean;
};

vi.mock("next/image", () => ({
  default: ({ priority, ...props }: MockNextImageProps) =>
    React.createElement("img", {
      ...props,
      alt: props.alt ?? "",
    }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/font/local", () => ({
  default: vi.fn(() => ({
    className: "mocked-font",
    style: {},
  })),
}));
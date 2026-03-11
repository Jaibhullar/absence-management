import { render, screen } from "@testing-library/react";
import { Spinner } from "../Spinner";

describe("Spinner", () => {
  describe("accessibility", () => {
    it("should have role status for screen readers", () => {
      render(<Spinner />);

      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("should have aria-label for screen readers", () => {
      render(<Spinner />);

      expect(screen.getByLabelText("Loading")).toBeInTheDocument();
    });
  });

  describe("sizes", () => {
    it("should render default size", () => {
      render(<Spinner data-testid="spinner" />);

      const spinner = screen.getByTestId("spinner");
      expect(spinner).toHaveClass("size-4");
    });

    it("should render small size", () => {
      render(<Spinner size="sm" data-testid="spinner" />);

      const spinner = screen.getByTestId("spinner");
      expect(spinner).toHaveClass("size-3");
    });

    it("should render large size", () => {
      render(<Spinner size="lg" data-testid="spinner" />);

      const spinner = screen.getByTestId("spinner");
      expect(spinner).toHaveClass("size-6");
    });
  });

  describe("animation", () => {
    it("should have spin animation class", () => {
      render(<Spinner data-testid="spinner" />);

      const spinner = screen.getByTestId("spinner");
      expect(spinner).toHaveClass("animate-spin");
    });
  });

  describe("custom props", () => {
    it("should accept custom className", () => {
      render(<Spinner className="custom-class" data-testid="spinner" />);

      const spinner = screen.getByTestId("spinner");
      expect(spinner).toHaveClass("custom-class");
    });
  });
});

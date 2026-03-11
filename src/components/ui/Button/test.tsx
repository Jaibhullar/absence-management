import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Button } from ".";

const testIds = Button.testIds;

describe("Button", () => {
  describe("rendering", () => {
    it("renders children correctly", () => {
      render(<Button>Click me</Button>);

      expect(screen.getByTestId(testIds.button)).toBeInTheDocument();
      expect(screen.getByTestId(testIds.button)).toHaveTextContent("Click me");
    });

    it("renders with default variant and size when none provided", () => {
      render(<Button>Default Button</Button>);

      const button = screen.getByTestId(testIds.button);
      expect(button).toHaveClass("bg-primary");
      expect(button).toHaveClass("h-9");
    });
  });

  describe("variants", () => {
    it("applies outline variant styles", () => {
      render(<Button variant="outline">Outline</Button>);

      const button = screen.getByTestId(testIds.button);
      expect(button).toHaveClass("border", "border-primary", "text-primary");
    });

    it("applies ghost variant styles", () => {
      render(<Button variant="ghost">Ghost</Button>);

      const button = screen.getByTestId(testIds.button);
      expect(button).toHaveClass("text-primary");
    });

    it("applies link variant styles", () => {
      render(<Button variant="link">Link</Button>);

      const button = screen.getByTestId(testIds.button);
      expect(button).toHaveClass("underline-offset-4");
    });
  });

  describe("sizes", () => {
    it("applies icon-sm size styles", () => {
      render(<Button size="icon-sm">🔍</Button>);

      const button = screen.getByTestId(testIds.button);
      expect(button).toHaveClass("size-8");
    });
  });

  describe("interactions", () => {
    it("calls onClick handler when clicked", async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      render(<Button onClick={handleClick}>Click me</Button>);

      await user.click(screen.getByTestId(testIds.button));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>,
      );

      await user.click(screen.getByTestId(testIds.button));

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("applies disabled styles when disabled", () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByTestId(testIds.button);
      expect(button).toBeDisabled();
      expect(button).toHaveClass(
        "disabled:opacity-50",
        "disabled:pointer-events-none",
      );
    });
  });

  describe("custom props", () => {
    it("merges custom className with default classes", () => {
      render(<Button className="custom-class">Custom</Button>);

      const button = screen.getByTestId(testIds.button);
      expect(button).toHaveClass("custom-class");
      expect(button).toHaveClass("inline-flex"); // Base class still present
    });

    it("passes through additional HTML attributes", () => {
      render(
        <Button type="submit" aria-label="Submit form">
          Submit
        </Button>,
      );

      const button = screen.getByTestId(testIds.button);
      expect(button).toHaveAttribute("type", "submit");
      expect(button).toHaveAttribute("aria-label", "Submit form");
    });
  });

  describe("accessibility", () => {
    it("has focus-visible ring styles for keyboard navigation", () => {
      render(<Button>Focusable</Button>);

      const button = screen.getByTestId(testIds.button);
      expect(button).toHaveClass(
        "focus-visible:ring-2",
        "focus-visible:ring-primary",
      );
    });

    it("is focusable via keyboard", async () => {
      const user = userEvent.setup();
      render(<Button>Tab to me</Button>);

      await user.tab();

      expect(screen.getByTestId(testIds.button)).toHaveFocus();
    });
  });
});

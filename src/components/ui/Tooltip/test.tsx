import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Tooltip } from ".";

const testIds = Tooltip.testIds;

describe("Tooltip", () => {
  describe("rendering", () => {
    it("renders children correctly", () => {
      render(
        <Tooltip content="Tooltip text">
          <button>Hover me</button>
        </Tooltip>,
      );

      expect(
        screen.getByRole("button", { name: "Hover me" }),
      ).toBeInTheDocument();
    });

    it("does not show tooltip content initially", () => {
      render(
        <Tooltip content="Hidden tooltip">
          <button>Trigger</button>
        </Tooltip>,
      );

      expect(screen.queryByTestId(testIds.tooltip)).not.toBeInTheDocument();
    });

    it("does not render tooltip when content is empty", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="">
          <button>Hover me</button>
        </Tooltip>,
      );

      await user.hover(screen.getByRole("button"));

      expect(screen.queryByTestId(testIds.tooltip)).not.toBeInTheDocument();
    });
  });

  describe("mouse interactions", () => {
    it("shows tooltip on mouse enter", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Tooltip content">
          <button>Hover me</button>
        </Tooltip>,
      );

      await user.hover(screen.getByRole("button"));

      expect(screen.getByTestId(testIds.tooltip)).toBeInTheDocument();
      expect(screen.getByTestId(testIds.tooltip)).toHaveTextContent(
        "Tooltip content",
      );
    });

    it("hides tooltip on mouse leave", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Tooltip content">
          <button>Hover me</button>
        </Tooltip>,
      );

      await user.hover(screen.getByRole("button"));
      await user.unhover(screen.getByRole("button"));

      expect(screen.queryByTestId(testIds.tooltip)).not.toBeInTheDocument();
    });
  });

  describe("keyboard interactions", () => {
    it("shows tooltip on focus", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Focus tooltip">
          <button>Focus me</button>
        </Tooltip>,
      );

      await user.tab();

      expect(screen.getByTestId(testIds.tooltip)).toBeInTheDocument();
      expect(screen.getByTestId(testIds.tooltip)).toHaveTextContent("Focus tooltip");
    });

    it("hides tooltip on blur", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Tooltip content="Focus tooltip">
            <button>Focus me</button>
          </Tooltip>
          <button>Other button</button>
        </>,
      );

      await user.tab();
      await user.tab();

      // Assert
      expect(screen.queryByTestId(testIds.tooltip)).not.toBeInTheDocument();
    });
  });

  describe("delay behavior", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("shows tooltip immediately when delayDuration is 0", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(
        <Tooltip content="Instant tooltip" delayDuration={0}>
          <button>Hover me</button>
        </Tooltip>,
      );

      await user.hover(screen.getByRole("button"));

      expect(screen.getByTestId(testIds.tooltip)).toBeInTheDocument();
    });

    it("delays showing tooltip when delayDuration is set", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(
        <Tooltip content="Delayed tooltip" delayDuration={500}>
          <button>Hover me</button>
        </Tooltip>,
      );

      await user.hover(screen.getByRole("button"));

      expect(screen.queryByTestId(testIds.tooltip)).not.toBeInTheDocument();

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(screen.getByTestId(testIds.tooltip)).toBeInTheDocument();
      });
    });

    it("cancels delayed tooltip if mouse leaves before delay completes", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(
        <Tooltip content="Delayed tooltip" delayDuration={500}>
          <button>Hover me</button>
        </Tooltip>,
      );

      await user.hover(screen.getByRole("button"));
      await act(async () => {
        jest.advanceTimersByTime(200);
      });
      await user.unhover(screen.getByRole("button"));
      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      expect(screen.queryByTestId(testIds.tooltip)).not.toBeInTheDocument();
    });
  });

  describe("placement", () => {
    it("applies top placement styles by default", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Top tooltip">
          <button>Hover me</button>
        </Tooltip>,
      );

      await user.hover(screen.getByRole("button"));

      const tooltip = screen.getByTestId(testIds.tooltip);
      expect(tooltip).toHaveClass("bottom-full");
    });

    it("applies bottom placement styles", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Bottom tooltip" placement="bottom">
          <button>Hover me</button>
        </Tooltip>,
      );

      await user.hover(screen.getByRole("button"));

      const tooltip = screen.getByTestId(testIds.tooltip);
      expect(tooltip).toHaveClass("top-full");
    });

    it("applies left placement styles", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Left tooltip" placement="left">
          <button>Hover me</button>
        </Tooltip>,
      );

      await user.hover(screen.getByRole("button"));

      const tooltip = screen.getByTestId(testIds.tooltip);
      expect(tooltip).toHaveClass("right-full");
    });

    it("applies right placement styles", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Right tooltip" placement="right">
          <button>Hover me</button>
        </Tooltip>,
      );

      await user.hover(screen.getByRole("button"));

      const tooltip = screen.getByTestId(testIds.tooltip);
      expect(tooltip).toHaveClass("left-full");
    });
  });

  describe("custom props", () => {
    it("merges custom className with default styles", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Styled tooltip" className="custom-tooltip-class">
          <button>Hover me</button>
        </Tooltip>,
      );

      await user.hover(screen.getByRole("button"));

      const tooltip = screen.getByTestId(testIds.tooltip);
      expect(tooltip).toHaveClass("custom-tooltip-class");
      expect(tooltip).toHaveClass("bg-gray-900"); // Base class still present
    });

    it("renders complex content as tooltip", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip
          content={
            <div>
              <strong>Title</strong>
              <p>Description</p>
            </div>
          }
        >
          <button>Hover me</button>
        </Tooltip>,
      );

      await user.hover(screen.getByRole("button"));

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has tooltip for screen readers", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Accessible tooltip">
          <button>Hover me</button>
        </Tooltip>,
      );

      await user.hover(screen.getByRole("button"));

      expect(screen.getByTestId(testIds.tooltip)).toBeInTheDocument();
    });

    it("is accessible via keyboard focus", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Keyboard accessible">
          <button>Tab to me</button>
        </Tooltip>,
      );

      await user.tab();

      expect(screen.getByRole("button")).toHaveFocus();
      expect(screen.getByTestId(testIds.tooltip)).toBeInTheDocument();
    });
  });
});

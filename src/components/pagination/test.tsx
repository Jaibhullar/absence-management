import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Pagination } from ".";

const testIds = Pagination.testIds;

describe("Pagination", () => {
  const defaultProps = {
    numberOfPages: 5,
    currentPage: 1,
    handlePageChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders pagination container", () => {
      render(<Pagination {...defaultProps} />);

      expect(
        screen.getByTestId(testIds.paginationContainer),
      ).toBeInTheDocument();
    });

    it("renders correct number of page buttons", () => {
      render(<Pagination {...defaultProps} />);

      const buttons = screen.getAllByTestId(testIds.pageNumberButton);
      expect(buttons).toHaveLength(5);
    });

    it("renders page numbers from 1 to numberOfPages", () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getAllByTestId(testIds.pageNumberButton)).toHaveLength(5);
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("renders no buttons when numberOfPages is 0", () => {
      render(<Pagination {...defaultProps} numberOfPages={0} />);

      expect(
        screen.queryByTestId(testIds.pageNumberButton),
      ).not.toBeInTheDocument();
    });

    it("renders single button when numberOfPages is 1", () => {
      render(<Pagination {...defaultProps} numberOfPages={1} />);

      const buttons = screen.getAllByTestId(testIds.pageNumberButton);
      expect(buttons).toHaveLength(1);
    });
  });

  describe("current page state", () => {
    it("disables button for current page", () => {
      render(<Pagination {...defaultProps} />);

      const buttons = screen.getAllByTestId(testIds.pageNumberButton);
      expect(buttons[0]).toBeDisabled();
    });

    it("enables buttons for non-current pages", () => {
      render(<Pagination {...defaultProps} />);

      const buttons = screen.getAllByTestId(testIds.pageNumberButton);
      expect(buttons[1]).not.toBeDisabled();
      expect(buttons[2]).not.toBeDisabled();
      expect(buttons[3]).not.toBeDisabled();
      expect(buttons[4]).not.toBeDisabled();
    });

    it("disables correct button when currentPage changes", () => {
      render(<Pagination {...defaultProps} currentPage={3} />);

      const buttons = screen.getAllByTestId(testIds.pageNumberButton);
      expect(buttons[0]).not.toBeDisabled();
      expect(buttons[1]).not.toBeDisabled();
      expect(buttons[2]).toBeDisabled();
      expect(buttons[3]).not.toBeDisabled();
      expect(buttons[4]).not.toBeDisabled();
    });
  });

  describe("interactions", () => {
    it("calls handlePageChange with correct page number when button is clicked", async () => {
      const handlePageChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Pagination {...defaultProps} handlePageChange={handlePageChange} />,
      );

      const buttons = screen.getAllByTestId(testIds.pageNumberButton);
      await user.click(buttons[1]);

      expect(handlePageChange).toHaveBeenCalledTimes(1);
      expect(handlePageChange).toHaveBeenCalledWith(2);
    });

    it("calls handlePageChange with page 5 when last button is clicked", async () => {
      const handlePageChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Pagination {...defaultProps} handlePageChange={handlePageChange} />,
      );

      const buttons = screen.getAllByTestId(testIds.pageNumberButton);
      await user.click(buttons[4]);

      expect(handlePageChange).toHaveBeenCalledWith(5);
    });

    it("does not call handlePageChange when current page button is clicked", async () => {
      const handlePageChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Pagination {...defaultProps} handlePageChange={handlePageChange} />,
      );

      const buttons = screen.getAllByTestId(testIds.pageNumberButton);
      await user.click(buttons[0]);

      expect(handlePageChange).not.toHaveBeenCalled();
    });

    it("allows clicking multiple different pages", async () => {
      const handlePageChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Pagination {...defaultProps} handlePageChange={handlePageChange} />,
      );

      const buttons = screen.getAllByTestId(testIds.pageNumberButton);
      await user.click(buttons[1]);
      await user.click(buttons[3]);

      expect(handlePageChange).toHaveBeenCalledTimes(2);
      expect(handlePageChange).toHaveBeenNthCalledWith(1, 2);
      expect(handlePageChange).toHaveBeenNthCalledWith(2, 4);
    });
  });

  describe("edge cases", () => {
    it("handles large number of pages", () => {
      render(<Pagination {...defaultProps} numberOfPages={100} />);

      const buttons = screen.getAllByTestId(testIds.pageNumberButton);
      expect(buttons).toHaveLength(100);
    });

    it("handles last page as current page", () => {
      render(
        <Pagination {...defaultProps} numberOfPages={5} currentPage={5} />,
      );

      const buttons = screen.getAllByTestId(testIds.pageNumberButton);
      expect(buttons[4]).toBeDisabled();
      expect(buttons[0]).not.toBeDisabled();
    });
  });
});

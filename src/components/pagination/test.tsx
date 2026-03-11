import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Pagination } from ".";

const testIds = Pagination.testIds;

describe("Pagination", () => {
  const defaultProps = {
    numberOfPages: 5,
    currentPage: 1,
    disableShowMoreButton: false,
    handleShowMore: jest.fn(),
    handlePageChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("show-more format", () => {
    it("renders Show More button", () => {
      render(<Pagination {...defaultProps} paginationFormat="show-more" />);

      expect(screen.getByTestId(testIds.showMoreButton)).toBeInTheDocument();
    });

    it("calls handleShowMore when Show More button is clicked", async () => {
      const user = userEvent.setup();
      const handleShowMore = jest.fn();

      render(
        <Pagination
          {...defaultProps}
          paginationFormat="show-more"
          handleShowMore={handleShowMore}
        />,
      );

      await user.click(screen.getByTestId(testIds.showMoreButton));
      expect(handleShowMore).toHaveBeenCalledTimes(1);
    });

    it("disables Show More button when disableShowMoreButton is true", () => {
      render(
        <Pagination
          {...defaultProps}
          paginationFormat="show-more"
          disableShowMoreButton={true}
        />,
      );

      expect(screen.getByTestId(testIds.showMoreButton)).toBeDisabled();
    });

    it("does not render page number buttons in show-more format", () => {
      render(<Pagination {...defaultProps} paginationFormat="show-more" />);

      expect(
        screen.queryByTestId(testIds.pageNumberButton),
      ).not.toBeInTheDocument();
    });
  });

  describe("page-numbers format", () => {
    it("renders page number buttons", () => {
      render(
        <Pagination
          {...defaultProps}
          paginationFormat="page-numbers"
          numberOfPages={3}
        />,
      );

      expect(screen.getAllByTestId(testIds.pageNumberButton)).toHaveLength(3);
    });

    it("calls handlePageChange with correct page number when clicked", async () => {
      const user = userEvent.setup();
      const handlePageChange = jest.fn();

      render(
        <Pagination
          {...defaultProps}
          paginationFormat="page-numbers"
          numberOfPages={3}
          handlePageChange={handlePageChange}
        />,
      );

      await user.click(screen.getAllByTestId(testIds.pageNumberButton)[1]);
      expect(handlePageChange).toHaveBeenCalledWith(2);

      await user.click(screen.getAllByTestId(testIds.pageNumberButton)[2]);
      expect(handlePageChange).toHaveBeenCalledWith(3);
    });

    it("disables current page button", () => {
      render(
        <Pagination
          {...defaultProps}
          paginationFormat="page-numbers"
          numberOfPages={3}
          currentPage={2}
        />,
      );

      const pageButtons = screen.getAllByTestId(testIds.pageNumberButton);
      expect(pageButtons[0]).not.toBeDisabled();
      expect(pageButtons[1]).toBeDisabled();
      expect(pageButtons[2]).not.toBeDisabled();
    });

    it("renders correct number of page buttons", () => {
      render(
        <Pagination
          {...defaultProps}
          paginationFormat="page-numbers"
          numberOfPages={7}
        />,
      );

      const buttons = screen.getAllByTestId(testIds.pageNumberButton);
      expect(buttons).toHaveLength(7);
    });

    it("renders no buttons when numberOfPages is 0", () => {
      render(
        <Pagination
          {...defaultProps}
          paginationFormat="page-numbers"
          numberOfPages={0}
        />,
      );

      expect(
        screen.queryByTestId(testIds.pageNumberButton),
      ).not.toBeInTheDocument();
    });

    it("does not render Show More buttons in page-numbers format", () => {
      render(
        <Pagination
          {...defaultProps}
          paginationFormat="page-numbers"
          numberOfPages={3}
        />,
      );

      expect(
        screen.queryByTestId(testIds.showMoreButton),
      ).not.toBeInTheDocument();
    });
  });
});

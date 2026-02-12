import "@testing-library/jest-dom";
import { TableContent, type TableContentProps } from ".";
import { render, screen } from "@testing-library/react";

const testIds = TableContent.testIds;

const defaultProps: TableContentProps = {
  absences: [],
  loading: false,
  error: null,
  filterAbsencesByUser: jest.fn(),
  sortBy: jest.fn(),
  sortKey: null,
  sortDirection: "asc",
};

describe("TableContent", () => {
  it("renders TableSkeleton when loading is true", () => {
    render(<TableContent {...defaultProps} loading={true} />);

    const skeleton = screen.getByTestId(testIds.tableSkeleton);

    expect(skeleton).toBeInTheDocument();
  });
  it("renders error message when error is not null", () => {
    render(<TableContent {...defaultProps} error={"Error fetching data"} />);

    const errorMessage = screen.getByTestId(testIds.errorMessage);

    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent("Error fetching data");
  });
  it("renders no results message when absences array is empty", () => {
    render(<TableContent {...defaultProps} />);

    const noResultsMessage = screen.getByTestId(testIds.noResultsMessage);

    expect(noResultsMessage).toBeInTheDocument();

    expect(noResultsMessage).toHaveTextContent("No results to show");
  });
});

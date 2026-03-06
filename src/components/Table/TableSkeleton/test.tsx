import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TableSkeleton } from ".";

const testIds = TableSkeleton.testIds;

describe("TableSkeleton", () => {
  it("renders with correct number of columns", () => {
    render(<TableSkeleton cols={5} rows={3} />);

    const headerCols = screen.getAllByTestId(testIds.tableSkeletonCol);
    expect(headerCols).toHaveLength(5);
  });

  it("renders with correct number of rows", () => {
    render(<TableSkeleton cols={3} rows={10} />);

    const table = screen.getByTestId(testIds.tableSkeleton);
    const tbody = table.querySelector("tbody");
    const rows = tbody?.querySelectorAll("tr");

    expect(rows).toHaveLength(10);
  });

  it("renders correct total number of body cells", () => {
    render(<TableSkeleton cols={4} rows={5} />);

    const table = screen.getByTestId(testIds.tableSkeleton);
    const tbody = table.querySelector("tbody");
    const cells = tbody?.querySelectorAll("td");

    // 4 cols * 5 rows = 20 cells
    expect(cells).toHaveLength(20);
  });

  it("has accessible aria-label", () => {
    render(<TableSkeleton cols={3} rows={3} />);

    const table = screen.getByTestId(testIds.tableSkeleton);
    expect(table).toHaveAttribute("aria-label", "Loading table");
  });
});

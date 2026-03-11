import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { GridSkeleton } from ".";

const testIds = GridSkeleton.testIds;

describe("GridSkeleton", () => {
  it("renders with correct number of columns", () => {
    render(<GridSkeleton cols={5} rows={3} />);

    const headerCols = screen.getAllByTestId(testIds.gridSkeletonCol);
    expect(headerCols).toHaveLength(5);
  });

  it("renders with correct number of rows", () => {
    render(<GridSkeleton cols={3} rows={10} />);

    const rows = screen.getAllByTestId(testIds.gridSkeletonRow);
    expect(rows).toHaveLength(10);
  });

  it("renders correct total number of body cells", () => {
    render(<GridSkeleton cols={4} rows={5} />);

    const cells = screen.getAllByTestId(testIds.gridSkeletonCell);

    // 4 cols * 5 rows = 20 cells
    expect(cells).toHaveLength(20);
  });

  it("has accessible aria-label", () => {
    render(<GridSkeleton cols={3} rows={3} />);

    const skeleton = screen.getByTestId(testIds.gridSkeleton);
    expect(skeleton).toHaveAttribute("aria-label", "Loading grid");
  });

  it("has aria-busy attribute for screen reader support", () => {
    render(<GridSkeleton cols={3} rows={3} />);

    const skeleton = screen.getByTestId(testIds.gridSkeleton);
    expect(skeleton).toHaveAttribute("aria-busy", "true");
  });

  it("has role='status' for accessibility", () => {
    render(<GridSkeleton cols={3} rows={3} />);

    const skeleton = screen.getByTestId(testIds.gridSkeleton);
    expect(skeleton).toHaveAttribute("role", "status");
  });
});

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SortIcon } from ".";
import type { HeaderColumn, SortConfig } from "../types";

describe("SortIcon", () => {
  const mockColumn: HeaderColumn = {
    key: "name",
    text: "Name",
    sortable: true,
  };

  it("renders unsorted icon when sortConfig is null", () => {
    render(<SortIcon column={mockColumn} sortConfig={null} />);

    const icon = screen.getByLabelText("Not sorted");
    expect(icon).toBeInTheDocument();
  });

  it("renders unsorted icon when sortConfig key does not match column key", () => {
    const sortConfig: SortConfig = {
      key: "date",
      direction: "asc",
    };

    render(<SortIcon column={mockColumn} sortConfig={sortConfig} />);

    const icon = screen.getByLabelText("Not sorted");
    expect(icon).toBeInTheDocument();
  });

  it("renders ascending icon when sorted ascending", () => {
    const sortConfig: SortConfig = {
      key: "name",
      direction: "asc",
    };

    render(<SortIcon column={mockColumn} sortConfig={sortConfig} />);

    const icon = screen.getByLabelText("Sorted ascending");
    expect(icon).toBeInTheDocument();
  });

  it("renders descending icon when sorted descending", () => {
    const sortConfig: SortConfig = {
      key: "name",
      direction: "desc",
    };

    render(<SortIcon column={mockColumn} sortConfig={sortConfig} />);

    const icon = screen.getByLabelText("Sorted descending");
    expect(icon).toBeInTheDocument();
  });

  it("renders unsorted icon when sortConfig is undefined", () => {
    render(<SortIcon column={mockColumn} sortConfig={undefined} />);

    const icon = screen.getByLabelText("Not sorted");
    expect(icon).toBeInTheDocument();
  });
});

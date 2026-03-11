import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SortIcon, type SortConfig } from ".";

describe("SortIcon", () => {
  const mockColumnKey = "name";

  it("renders unsorted icon when sortConfig is null", () => {
    render(<SortIcon columnKey={mockColumnKey} sortConfig={null} />);

    const icon = screen.getByLabelText("Not sorted");
    expect(icon).toBeInTheDocument();
  });

  it("renders unsorted icon when sortConfig key does not match column key", () => {
    const sortConfig: SortConfig = {
      key: "date",
      order: "asc",
    };

    render(<SortIcon columnKey={mockColumnKey} sortConfig={sortConfig} />);

    const icon = screen.getByLabelText("Not sorted");
    expect(icon).toBeInTheDocument();
  });

  it("renders ascending icon when sorted ascending", () => {
    const sortConfig: SortConfig = {
      key: "name",
      order: "asc",
    };

    render(<SortIcon columnKey={mockColumnKey} sortConfig={sortConfig} />);

    const icon = screen.getByLabelText("Sorted ascending");
    expect(icon).toBeInTheDocument();
  });

  it("renders descending icon when sorted descending", () => {
    const sortConfig: SortConfig = {
      key: "name",
      order: "desc",
    };

    render(<SortIcon columnKey={mockColumnKey} sortConfig={sortConfig} />);

    const icon = screen.getByLabelText("Sorted descending");
    expect(icon).toBeInTheDocument();
  });

  it("renders unsorted icon when sortConfig is undefined", () => {
    render(<SortIcon columnKey={mockColumnKey} sortConfig={undefined} />);

    const icon = screen.getByLabelText("Not sorted");
    expect(icon).toBeInTheDocument();
  });
});

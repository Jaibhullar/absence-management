import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { TableFilters } from ".";
import type { HeaderColumn } from "../types";

const testIds = TableFilters.testIds;

describe("TableFilters", () => {
  const mockFilterableColumns: HeaderColumn[] = [
    { key: "name", text: "Name", filterable: true },
    { key: "type", text: "Type", filterable: true },
  ];

  const mockOnFilterChange = jest.fn();
  const mockOnClearFilters = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when filterableColumns is empty", () => {
    const { container } = render(
      <TableFilters
        filterableColumns={[]}
        filterConfig={{}}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders filter inputs for each filterable column", () => {
    render(
      <TableFilters
        filterableColumns={mockFilterableColumns}
        filterConfig={{}}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
      />,
    );

    expect(screen.getByLabelText("Filter by Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Filter by Type")).toBeInTheDocument();
  });

  it("renders Clear Filters button", () => {
    render(
      <TableFilters
        filterableColumns={mockFilterableColumns}
        filterConfig={{}}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
      />,
    );

    expect(screen.getByTestId(testIds.clearFiltersButton)).toBeInTheDocument();
  });

  it("disables Clear Filters button when filterConfig is empty", () => {
    render(
      <TableFilters
        filterableColumns={mockFilterableColumns}
        filterConfig={{}}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
      />,
    );

    expect(screen.getByTestId(testIds.clearFiltersButton)).toBeDisabled();
  });

  it("enables Clear Filters button when filterConfig has values", () => {
    render(
      <TableFilters
        filterableColumns={mockFilterableColumns}
        filterConfig={{ name: "John" }}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
      />,
    );

    expect(screen.getByTestId(testIds.clearFiltersButton)).not.toBeDisabled();
  });

  it("calls onFilterChange when typing in filter input", async () => {
    const user = userEvent.setup();

    render(
      <TableFilters
        filterableColumns={mockFilterableColumns}
        filterConfig={{}}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
      />,
    );

    const nameInput = screen.getByLabelText("Filter by Name");
    await user.type(nameInput, "John");

    expect(mockOnFilterChange).toHaveBeenCalledWith("name", "J");
    expect(mockOnFilterChange).toHaveBeenCalledWith("name", "o");
    expect(mockOnFilterChange).toHaveBeenCalledWith("name", "h");
    expect(mockOnFilterChange).toHaveBeenCalledWith("name", "n");
    expect(mockOnFilterChange).toHaveBeenCalledTimes(4);
  });

  it("calls onClearFilters when Clear Filters button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <TableFilters
        filterableColumns={mockFilterableColumns}
        filterConfig={{ name: "John" }}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
      />,
    );

    const clearButton = screen.getByRole("button", { name: "Clear Filters" });
    await user.click(clearButton);

    expect(mockOnClearFilters).toHaveBeenCalledTimes(1);
  });

  it("displays current filter value in input", () => {
    render(
      <TableFilters
        filterableColumns={mockFilterableColumns}
        filterConfig={{ name: "John", type: "Annual" }}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
      />,
    );

    expect(screen.getByLabelText("Filter by Name")).toHaveValue("John");
    expect(screen.getByLabelText("Filter by Type")).toHaveValue("Annual");
  });

  it("renders correct placeholder text for each filter", () => {
    render(
      <TableFilters
        filterableColumns={mockFilterableColumns}
        filterConfig={{}}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
      />,
    );

    expect(screen.getByPlaceholderText("Filter by Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Filter by Type")).toBeInTheDocument();
  });
});

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Table } from ".";
import type { Data, HeaderColumn } from "./types";
import { TableFilters } from "./TableFilters";
import { Pagination } from "../pagination";
import { SortIcon } from "../SortIcon";

const testIds = Table.testIds;
const tableFilterTestIds = TableFilters.testIds;
const paginationTestIds = Pagination.testIds;
const sortIconsTestIds = SortIcon.testIds;

const mockHeaderColumns: HeaderColumn[] = [
  { key: "name", text: "Name", sortable: true },
  { key: "age", text: "Age", sortable: true },
  { key: "city", text: "City" },
];

const mockFilterableHeaderColumns: HeaderColumn[] = [
  { key: "name", text: "Name", sortable: true, filterable: true },
  { key: "age", text: "Age", sortable: true },
  { key: "city", text: "City", filterable: true },
];

const mockData: Data[] = [
  {
    key: "1",
    cells: [
      { key: "name", value: "Alice", displayedValue: "Alice" },
      { key: "age", value: 30, displayedValue: 30 },
      { key: "city", value: "New York", displayedValue: "New York" },
    ],
  },
  {
    key: "2",
    cells: [
      { key: "name", value: "Bob", displayedValue: "Bob" },
      { key: "age", value: 25, displayedValue: 25 },
      { key: "city", value: "Los Angeles", displayedValue: "Los Angeles" },
    ],
  },
  {
    key: "3",
    cells: [
      { key: "name", value: "Charlie", displayedValue: "Charlie" },
      { key: "age", value: 35, displayedValue: 35 },
      { key: "city", value: "Chicago", displayedValue: "Chicago" },
    ],
  },
];

describe("Table", () => {
  describe("loading state", () => {
    it("renders skeleton when loading", () => {
      render(
        <Table headerColumns={mockHeaderColumns} data={[]} loading={true} />,
      );

      expect(screen.getByTestId("table-skeleton")).toBeInTheDocument();
      expect(screen.queryByTestId(testIds.dataTable)).not.toBeInTheDocument();
    });
  });

  describe("error state", () => {
    it("renders default error message when error is true", () => {
      render(
        <Table headerColumns={mockHeaderColumns} data={[]} error={true} />,
      );

      const errorElement = screen.getByTestId(testIds.errorMessage);
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveTextContent(
        "There was an error fetching data...",
      );
    });

    it("renders custom error message when provided", () => {
      render(
        <Table
          headerColumns={mockHeaderColumns}
          data={[]}
          error={true}
          errorMessage="Custom error occurred"
        />,
      );

      const errorElement = screen.getByTestId(testIds.errorMessage);
      expect(errorElement).toHaveTextContent("Custom error occurred");
    });

    it("has accessible error aria-label", () => {
      render(
        <Table headerColumns={mockHeaderColumns} data={[]} error={true} />,
      );

      const errorElement = screen.getByTestId(testIds.errorMessage);
      expect(errorElement).toHaveAttribute("aria-label", "Error fetching data");
    });
  });

  describe("empty state", () => {
    it("renders no results message when data is empty", () => {
      render(<Table headerColumns={mockHeaderColumns} data={[]} />);

      expect(screen.getByTestId(testIds.noResultsMessage)).toBeInTheDocument();
      expect(screen.getByText("No results to show")).toBeInTheDocument();
    });
  });

  describe("data rendering", () => {
    it("renders table with data", () => {
      render(<Table headerColumns={mockHeaderColumns} data={mockData} />);

      expect(screen.getByTestId(testIds.dataTable)).toBeInTheDocument();
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
      expect(screen.getByText("Charlie")).toBeInTheDocument();
    });

    it("renders header columns correctly", () => {
      render(<Table headerColumns={mockHeaderColumns} data={mockData} />);

      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Age")).toBeInTheDocument();
      expect(screen.getByText("City")).toBeInTheDocument();
    });

    it("renders custom cells when provided", () => {
      const dataWithCustomCell: Data[] = [
        {
          key: "1",
          cells: [
            {
              key: "name",
              value: "Alice",
              customCell: <span data-testid="custom-cell">Custom Alice</span>,
            },
            { key: "age", value: 30, displayedValue: 30 },
            { key: "city", value: "New York", displayedValue: "New York" },
          ],
        },
      ];

      render(
        <Table headerColumns={mockHeaderColumns} data={dataWithCustomCell} />,
      );

      expect(screen.getByTestId("custom-cell")).toBeInTheDocument();
      expect(screen.getByText("Custom Alice")).toBeInTheDocument();
    });

    it("renders custom header cells when provided", () => {
      const columnsWithCustomCell: HeaderColumn[] = [
        {
          key: "name",
          customCell: (
            <span data-testid="custom-header">Custom Name Header</span>
          ),
        },
        { key: "age", text: "Age" },
      ];

      render(<Table headerColumns={columnsWithCustomCell} data={mockData} />);

      expect(screen.getByTestId("custom-header")).toBeInTheDocument();
    });

    it("applies aria-label when provided", () => {
      render(
        <Table
          headerColumns={mockHeaderColumns}
          data={mockData}
          ariaLabel="User data table"
        />,
      );

      expect(screen.getByLabelText("User data table")).toBeInTheDocument();
    });
  });

  describe("sorting", () => {
    it("renders sort icons for sortable columns", () => {
      render(<Table headerColumns={mockHeaderColumns} data={mockData} />);

      // Name and Age are sortable
      const sortIcons = screen.getAllByTestId(sortIconsTestIds.unsortedIcon);
      expect(sortIcons).toHaveLength(2);
    });

    it("sorts data when clicking sortable column header", async () => {
      const user = userEvent.setup();

      render(<Table headerColumns={mockHeaderColumns} data={mockData} />);

      const nameHeader = screen.getByText("Name").closest("th");
      await user.click(nameHeader!);

      // After ascending sort, Alice should be first
      const rows = screen.getAllByTestId(testIds.dataRow);
      const firstDataRow = rows[0];
      expect(within(firstDataRow).getByText("Alice")).toBeInTheDocument();
    });

    it("toggles sort direction on subsequent clicks", async () => {
      const user = userEvent.setup();

      render(<Table headerColumns={mockHeaderColumns} data={mockData} />);

      const nameHeader = screen.getByText("Name").closest("th");

      // First click - ascending
      await user.click(nameHeader!);
      expect(
        screen.getByTestId(sortIconsTestIds.ascendingIcon),
      ).toBeInTheDocument();

      // Second click - descending
      await user.click(nameHeader!);
      expect(
        screen.getByTestId(sortIconsTestIds.descendingIcon),
      ).toBeInTheDocument();
    });

    it("updates aria-sort attribute on sorted column", async () => {
      const user = userEvent.setup();

      render(<Table headerColumns={mockHeaderColumns} data={mockData} />);

      const nameHeader = screen.getAllByTestId(testIds.headerCell)[0];
      expect(nameHeader).toHaveAttribute("aria-sort", "none");

      await user.click(nameHeader!);
      expect(nameHeader).toHaveAttribute("aria-sort", "ascending");

      await user.click(nameHeader!);
      expect(nameHeader).toHaveAttribute("aria-sort", "descending");
    });

    it("calls onSort callback when provided", async () => {
      const user = userEvent.setup();
      const onSort = jest.fn();

      render(
        <Table
          headerColumns={mockHeaderColumns}
          data={mockData}
          onSort={onSort}
        />,
      );

      const nameHeader = screen.getAllByTestId(testIds.headerCell)[0];
      await user.click(nameHeader!);

      expect(onSort).toHaveBeenCalledWith(
        expect.objectContaining({ key: "name" }),
      );
    });

    it("does not sort when clicking non-sortable column", async () => {
      const user = userEvent.setup();

      render(<Table headerColumns={mockHeaderColumns} data={mockData} />);

      const cityHeader = screen.getAllByTestId(testIds.headerCell)[2];
      await user.click(cityHeader!);

      // Should not have any sorted icons
      expect(
        screen.queryByTestId(sortIconsTestIds.ascendingIcon),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId(sortIconsTestIds.descendingIcon),
      ).not.toBeInTheDocument();
    });
  });

  describe("filtering", () => {
    it("renders filter inputs for filterable columns", () => {
      render(
        <Table headerColumns={mockFilterableHeaderColumns} data={mockData} />,
      );

      expect(
        screen.getAllByTestId(tableFilterTestIds.filterInputContainer),
      ).toHaveLength(2);
      expect(screen.getByLabelText("Filter by Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Filter by City")).toBeInTheDocument();
    });

    it("does not render filters when no filterable columns", () => {
      render(<Table headerColumns={mockHeaderColumns} data={mockData} />);

      expect(
        screen.queryAllByTestId(tableFilterTestIds.filterInputContainer),
      ).toHaveLength(0);
    });

    it("filters data when typing in filter input", async () => {
      const user = userEvent.setup();

      render(
        <Table headerColumns={mockFilterableHeaderColumns} data={mockData} />,
      );

      const nameFilter = screen
        .getAllByTestId(tableFilterTestIds.filterInputContainer)[0]
        .querySelector("input")!;
      await user.type(nameFilter, "Alice");

      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.queryByText("Bob")).not.toBeInTheDocument();
      expect(screen.queryByText("Charlie")).not.toBeInTheDocument();
    });

    it("clears filters when Clear Filters button is clicked", async () => {
      const user = userEvent.setup();

      render(
        <Table headerColumns={mockFilterableHeaderColumns} data={mockData} />,
      );

      const nameFilter = screen
        .getAllByTestId(tableFilterTestIds.filterInputContainer)[0]
        .querySelector("input")!;
      await user.type(nameFilter, "Alice");

      expect(screen.queryByText("Bob")).not.toBeInTheDocument();

      const clearButton = screen.getByTestId(
        tableFilterTestIds.clearFiltersButton,
      );
      await user.click(clearButton);

      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
      expect(screen.getByText("Charlie")).toBeInTheDocument();
    });
  });

  describe("frontend pagination", () => {
    const extendedData: Data[] = [
      ...mockData,
      {
        key: "4",
        cells: [
          { key: "name", value: "Diana", displayedValue: "Diana" },
          { key: "age", value: 28, displayedValue: 28 },
          { key: "city", value: "Houston", displayedValue: "Houston" },
        ],
      },
      {
        key: "5",
        cells: [
          { key: "name", value: "Eve", displayedValue: "Eve" },
          { key: "age", value: 32, displayedValue: 32 },
          { key: "city", value: "Phoenix", displayedValue: "Phoenix" },
        ],
      },
    ];

    it("renders pagination controls with show-more format", () => {
      render(
        <Table
          headerColumns={mockHeaderColumns}
          data={extendedData}
          pagination={{
            mode: "frontend",
            format: "show-more",
            recordsPerPage: 2,
          }}
        />,
      );

      expect(
        screen.getByTestId(paginationTestIds.showMoreButton),
      ).toBeInTheDocument();
    });

    it("shows more records when Show More is clicked", async () => {
      const user = userEvent.setup();

      render(
        <Table
          headerColumns={mockHeaderColumns}
          data={extendedData}
          pagination={{
            mode: "frontend",
            format: "show-more",
            recordsPerPage: 2,
          }}
        />,
      );

      // Initially only 2 records
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
      expect(screen.queryByText("Charlie")).not.toBeInTheDocument();

      await user.click(screen.getByTestId(paginationTestIds.showMoreButton));

      // Now 4 records
      expect(screen.getByText("Charlie")).toBeInTheDocument();
      expect(screen.getByText("Diana")).toBeInTheDocument();
    });

    it("renders pagination controls with page-numbers format", () => {
      render(
        <Table
          headerColumns={mockHeaderColumns}
          data={extendedData}
          pagination={{
            mode: "frontend",
            format: "page-numbers",
            recordsPerPage: 2,
          }}
        />,
      );

      expect(
        screen.getAllByTestId(paginationTestIds.pageNumberButton)[0],
      ).toBeInTheDocument();
      expect(
        screen.getAllByTestId(paginationTestIds.pageNumberButton)[1],
      ).toBeInTheDocument();
      expect(
        screen.getAllByTestId(paginationTestIds.pageNumberButton)[2],
      ).toBeInTheDocument();
    });

    it("navigates to specific page with page-numbers format", async () => {
      const user = userEvent.setup();

      render(
        <Table
          headerColumns={mockHeaderColumns}
          data={extendedData}
          pagination={{
            mode: "frontend",
            format: "page-numbers",
            recordsPerPage: 2,
          }}
        />,
      );

      await user.click(
        screen.getAllByTestId(paginationTestIds.pageNumberButton)[2],
      );

      expect(screen.queryByText("Alice")).not.toBeInTheDocument();
      expect(screen.getByText("Eve")).toBeInTheDocument();
    });

    it("does not render pagination when pagination prop is not provided", () => {
      render(<Table headerColumns={mockHeaderColumns} data={mockData} />);

      expect(
        screen.queryByTestId(paginationTestIds.paginationContainer),
      ).not.toBeInTheDocument();
    });
  });

  describe("backend pagination", () => {
    it("calls onShowMore when Show More is clicked", async () => {
      const user = userEvent.setup();
      const onShowMore = jest.fn();

      render(
        <Table
          headerColumns={mockHeaderColumns}
          data={mockData}
          pagination={{
            mode: "backend",
            format: "show-more",
            numberOfPages: 3,
            onShowMore,
            enableShowMoreButton: true,
          }}
        />,
      );

      await user.click(screen.getByTestId(paginationTestIds.showMoreButton));
      expect(onShowMore).toHaveBeenCalledTimes(1);
    });

    it("calls onPageChange when page number is clicked", async () => {
      const user = userEvent.setup();
      const onPageChange = jest.fn();

      render(
        <Table
          headerColumns={mockHeaderColumns}
          data={mockData}
          pagination={{
            mode: "backend",
            format: "page-numbers",
            numberOfPages: 3,
            onPageChange,
          }}
        />,
      );

      await user.click(
        screen.getAllByTestId(paginationTestIds.pageNumberButton)[1],
      );
      expect(onPageChange).toHaveBeenCalledWith(2);
    });
    it("does not render pagination when pagination prop is not provided", () => {
      render(<Table headerColumns={mockHeaderColumns} data={mockData} />);

      expect(
        screen.queryByTestId(paginationTestIds.paginationContainer),
      ).not.toBeInTheDocument();
    });
  });
});

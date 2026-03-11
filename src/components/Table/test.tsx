import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Table } from ".";
import type { HeaderColumn, Data, TableSortConfig } from "./types";

const testIds = Table.testIds;

describe("Table", () => {
  const mockHeaderColumns: HeaderColumn[] = [
    { key: "name", text: "Name" },
    { key: "date", text: "Date" },
    { key: "status", text: "Status" },
  ];

  const mockData: Data[] = [
    {
      key: "1",
      cells: [
        { key: "name", value: "John Doe" },
        { key: "date", value: "2024-01-01" },
        { key: "status", value: "Active" },
      ],
    },
    {
      key: "2",
      cells: [
        { key: "name", value: "Jane Smith" },
        { key: "date", value: "2024-01-02" },
        { key: "status", value: "Inactive" },
      ],
    },
  ];

  const defaultProps = {
    ariaLabel: "Test Table",
    headerColumns: mockHeaderColumns,
    data: mockData,
  };

  describe("rendering", () => {
    it("renders the table with data", () => {
      render(<Table {...defaultProps} />);

      expect(screen.getByTestId(testIds.dataTable)).toBeInTheDocument();
    });

    it("renders all header columns", () => {
      render(<Table {...defaultProps} />);

      const headers = screen.getAllByTestId(testIds.headerCell);
      expect(headers).toHaveLength(3);
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Date")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
    });

    it("renders all data rows", () => {
      render(<Table {...defaultProps} />);

      const rows = screen.getAllByTestId(testIds.dataRow);
      expect(rows).toHaveLength(2);
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    it("renders with aria-label when provided", () => {
      render(<Table {...defaultProps} />);

      expect(screen.getByLabelText("Test Table")).toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("renders skeleton when loading", () => {
      render(<Table {...defaultProps} loading={true} />);

      expect(screen.queryByTestId(testIds.dataTable)).not.toBeInTheDocument();
    });

    it("does not render data when loading", () => {
      render(<Table {...defaultProps} loading={true} />);

      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });
  });

  describe("error state", () => {
    it("renders default error message when error is true", () => {
      render(<Table {...defaultProps} error={true} />);

      expect(screen.getByTestId(testIds.errorMessage)).toBeInTheDocument();
      expect(screen.getByTestId(testIds.errorMessage)).toHaveTextContent(
        "There was an error fetching data...",
      );
    });

    it("renders custom error message when provided", () => {
      render(
        <Table
          {...defaultProps}
          error={true}
          errorMessage="Custom error occurred"
        />,
      );

      expect(screen.getByTestId(testIds.errorMessage)).toHaveTextContent(
        "Custom error occurred",
      );
    });

    it("does not render table when error is true", () => {
      render(<Table {...defaultProps} error={true} />);

      expect(screen.queryByTestId(testIds.dataTable)).not.toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("renders no results message when data is empty", () => {
      render(<Table {...defaultProps} data={[]} />);

      expect(screen.getByTestId(testIds.noResultsMessage)).toBeInTheDocument();
      expect(screen.getByTestId(testIds.noResultsMessage)).toHaveTextContent(
        "No results to show",
      );
    });

    it("does not render data rows when data is empty", () => {
      render(<Table {...defaultProps} data={[]} />);

      expect(screen.queryByTestId(testIds.dataRow)).not.toBeInTheDocument();
    });
  });

  describe("sorting", () => {
    it("calls onSort when sortable header button is clicked", async () => {
      const user = userEvent.setup();
      const onSort = jest.fn();

      const sortableHeaders: HeaderColumn[] = [
        { key: "name", text: "Name", sortable: true, onSort },
        { key: "date", text: "Date" },
      ];

      render(<Table {...defaultProps} headerColumns={sortableHeaders} />);

      const sortButton = screen.getByTestId(testIds.sortButton);
      await user.click(sortButton);

      expect(onSort).toHaveBeenCalledTimes(1);
    });

    it("does not render sort button for non-sortable header", async () => {
      const onSort = jest.fn();

      const sortableHeaders: HeaderColumn[] = [
        { key: "name", text: "Name", sortable: true, onSort },
        { key: "date", text: "Date", sortable: false },
      ];

      render(<Table {...defaultProps} headerColumns={sortableHeaders} />);

      const sortButtons = screen.getAllByTestId(testIds.sortButton);
      expect(sortButtons).toHaveLength(1);
    });

    it("sort button is keyboard accessible", async () => {
      const user = userEvent.setup();
      const onSort = jest.fn();

      const sortableHeaders: HeaderColumn[] = [
        { key: "name", text: "Name", sortable: true, onSort },
      ];

      render(<Table {...defaultProps} headerColumns={sortableHeaders} />);

      const sortButton = screen.getByTestId(testIds.sortButton);
      sortButton.focus();
      await user.keyboard("{Enter}");

      expect(onSort).toHaveBeenCalledTimes(1);
    });

    it("sort button has correct aria-label", () => {
      const sortableHeaders: HeaderColumn[] = [
        { key: "name", text: "Name", sortable: true, onSort: jest.fn() },
      ];

      render(<Table {...defaultProps} headerColumns={sortableHeaders} />);

      const sortButton = screen.getByTestId(testIds.sortButton);
      expect(sortButton).toHaveAttribute("aria-label", "Sort by Name");
    });

    it("displays correct aria-sort for ascending sort", () => {
      const sortConfig: TableSortConfig = { key: "name", order: "asc" };
      const sortableHeaders: HeaderColumn[] = [
        { key: "name", text: "Name", sortable: true, onSort: jest.fn() },
      ];

      render(
        <Table
          {...defaultProps}
          headerColumns={sortableHeaders}
          sortConfig={sortConfig}
        />,
      );

      const header = screen.getByTestId(testIds.headerCell);
      expect(header).toHaveAttribute("aria-sort", "ascending");
    });

    it("displays correct aria-sort for descending sort", () => {
      const sortConfig: TableSortConfig = { key: "name", order: "desc" };
      const sortableHeaders: HeaderColumn[] = [
        { key: "name", text: "Name", sortable: true, onSort: jest.fn() },
      ];

      render(
        <Table
          {...defaultProps}
          headerColumns={sortableHeaders}
          sortConfig={sortConfig}
        />,
      );

      const header = screen.getByTestId(testIds.headerCell);
      expect(header).toHaveAttribute("aria-sort", "descending");
    });

    it("displays aria-sort none for unsorted column", () => {
      const sortConfig: TableSortConfig = { key: "date", order: "asc" };
      const sortableHeaders: HeaderColumn[] = [
        { key: "name", text: "Name", sortable: true, onSort: jest.fn() },
      ];

      render(
        <Table
          {...defaultProps}
          headerColumns={sortableHeaders}
          sortConfig={sortConfig}
        />,
      );

      const header = screen.getByTestId(testIds.headerCell);
      expect(header).toHaveAttribute("aria-sort", "none");
    });
  });

  describe("custom cells", () => {
    it("renders custom header cell when provided", () => {
      const customHeaders: HeaderColumn[] = [
        {
          key: "custom",
          customCell: <span data-testid="custom-header">Custom Header</span>,
        },
      ];

      render(<Table {...defaultProps} headerColumns={customHeaders} />);

      expect(screen.getByTestId("custom-header")).toBeInTheDocument();
    });

    it("renders custom data cell when provided", () => {
      const customData: Data[] = [
        {
          key: "1",
          cells: [
            {
              key: "custom",
              value: "test",
              customCell: <span data-testid="custom-cell">Custom Cell</span>,
            },
          ],
        },
      ];

      const customHeaders: HeaderColumn[] = [{ key: "custom", text: "Custom" }];

      render(
        <Table
          {...defaultProps}
          headerColumns={customHeaders}
          data={customData}
        />,
      );

      expect(screen.getByTestId("custom-cell")).toBeInTheDocument();
    });
  });

  describe("pagination", () => {
    const paginationConfig = {
      numberOfPages: 5,
      currentPage: 1,
      handlePageChange: jest.fn(),
    };

    it("renders pagination when paginationConfig is provided and pages > 1", () => {
      render(<Table {...defaultProps} paginationConfig={paginationConfig} />);

      expect(screen.getByTestId("pagination-container")).toBeInTheDocument();
    });

    it("does not render pagination when numberOfPages is 1", () => {
      render(
        <Table
          {...defaultProps}
          paginationConfig={{ ...paginationConfig, numberOfPages: 1 }}
        />,
      );

      expect(
        screen.queryByTestId("pagination-container"),
      ).not.toBeInTheDocument();
    });

    it("does not render pagination when paginationConfig is not provided", () => {
      render(<Table {...defaultProps} />);

      expect(
        screen.queryByTestId("pagination-container"),
      ).not.toBeInTheDocument();
    });
  });

  describe("column width", () => {
    it("applies custom width to header column when provided", () => {
      const headersWithWidth: HeaderColumn[] = [
        { key: "name", text: "Name", width: "200px" },
      ];

      render(<Table {...defaultProps} headerColumns={headersWithWidth} />);

      const header = screen.getByTestId(testIds.headerCell);
      expect(header).toHaveStyle({ width: "200px" });
    });

    it("does not apply width style when width is not provided", () => {
      render(<Table {...defaultProps} />);

      const header = screen.getAllByTestId(testIds.headerCell)[0];
      expect(header.style.width).toBe("");
    });
  });
});

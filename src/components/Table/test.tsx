import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Table, type HeaderColumn, type Data } from ".";

const tableTestIds = Table.testIds;

const mockHeaderColumns: HeaderColumn[] = [
  { key: "name", text: "Name" },
  { key: "date", text: "Date" },
  { key: "status", text: "Status" },
];

const mockData: Data[] = [
  {
    key: "1",
    cells: [
      { value: "John Doe" },
      { value: "2024-01-01" },
      { value: "Active" },
    ],
  },
  {
    key: "2",
    cells: [
      { value: "Jane Smith" },
      { value: "2024-01-02" },
      { value: "Pending" },
    ],
  },
  {
    key: "3",
    cells: [
      { value: "Bob Wilson" },
      { value: "2024-01-03" },
      { value: "Active" },
    ],
  },
];

const mockLargeData: Data[] = Array.from({ length: 25 }, (_, i) => ({
  key: `${i + 1}`,
  cells: [
    { value: `User ${i + 1}` },
    { value: `2024-01-${String(i + 1).padStart(2, "0")}` },
    { value: "Active" },
  ],
}));

describe("<Table />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders header columns correctly", () => {
      render(<Table headerColumns={mockHeaderColumns} data={mockData} />);

      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Date")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
    });

    it("renders data rows correctly", () => {
      render(<Table headerColumns={mockHeaderColumns} data={mockData} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("Bob Wilson")).toBeInTheDocument();
    });

    it("renders custom header cells when provided", () => {
      const customHeaderColumns: HeaderColumn[] = [
        {
          key: "name",
          text: "Name",
          customCell: <button>Custom Header</button>,
        },
      ];

      render(<Table headerColumns={customHeaderColumns} data={[]} />);

      expect(screen.getByText("Custom Header")).toBeInTheDocument();
    });

    it("renders custom data cells when provided", () => {
      const customData: Data[] = [
        {
          key: "1",
          cells: [
            {
              value: "raw-value",
              customCell: <span data-testid="custom-cell">Custom Cell</span>,
            },
          ],
        },
      ];

      render(
        <Table
          headerColumns={[{ key: "col", text: "Column" }]}
          data={customData}
        />,
      );

      expect(screen.getByTestId("custom-cell")).toBeInTheDocument();
      expect(screen.queryByText("raw-value")).not.toBeInTheDocument();
    });

    it("renders aria-label when provided", () => {
      render(
        <Table
          headerColumns={mockHeaderColumns}
          data={mockData}
          ariaLabel="Test table"
        />,
      );

      expect(screen.getByRole("table")).toHaveAttribute(
        "aria-label",
        "Test table",
      );
    });
  });

  describe("loading state", () => {
    it("displays skeleton when loading is true", () => {
      render(
        <Table headerColumns={mockHeaderColumns} data={mockData} loading />,
      );

      expect(
        screen.getByTestId(tableTestIds.tableSkeleton),
      ).toBeInTheDocument();
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });

    it("displays skeleton with correct number of columns", () => {
      render(
        <Table headerColumns={mockHeaderColumns} data={mockData} loading />,
      );

      const skeleton = screen.getByTestId(tableTestIds.tableSkeleton);
      const headerCells = within(skeleton).getAllByTestId(
        tableTestIds.tableSkeletonCol,
      );

      expect(headerCells).toHaveLength(mockHeaderColumns.length);
    });
  });

  describe("error state", () => {
    it("displays default error message when error is true", () => {
      render(<Table headerColumns={mockHeaderColumns} data={mockData} error />);

      expect(screen.getByTestId(tableTestIds.errorMessage)).toHaveTextContent(
        "There was an error fetching data...",
      );
    });

    it("displays custom error message when provided", () => {
      render(
        <Table
          headerColumns={mockHeaderColumns}
          data={mockData}
          error
          errorMessage="Custom error occurred"
        />,
      );

      expect(screen.getByTestId(tableTestIds.errorMessage)).toHaveTextContent(
        "Custom error occurred",
      );
    });

    it("does not render table when error is true", () => {
      render(<Table headerColumns={mockHeaderColumns} data={mockData} error />);

      expect(
        screen.queryByTestId(tableTestIds.dataTable),
      ).not.toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("displays no results message when data is empty", () => {
      render(<Table headerColumns={mockHeaderColumns} data={[]} />);

      expect(
        screen.getByTestId(tableTestIds.noResultsMessage),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(tableTestIds.noResultsMessage),
      ).toHaveTextContent("No results to show");
    });
  });

  describe("frontend pagination", () => {
    it("shows only recordsPerPage items initially", () => {
      render(
        <Table
          headerColumns={mockHeaderColumns}
          data={mockLargeData}
          frontendPagination
          recordsPerPage={10}
        />,
      );

      expect(screen.getByText("User 1")).toBeInTheDocument();
      expect(screen.getByText("User 10")).toBeInTheDocument();
      expect(screen.queryByText("User 11")).not.toBeInTheDocument();
    });

    it("renders Show More button when frontendPagination is enabled", () => {
      render(
        <Table
          headerColumns={mockHeaderColumns}
          data={mockLargeData}
          frontendPagination
          recordsPerPage={10}
        />,
      );

      expect(
        screen.getByRole("button", { name: "Show More" }),
      ).toBeInTheDocument();
    });

    it("loads more items when Show More is clicked", async () => {
      const user = userEvent.setup();

      render(
        <Table
          headerColumns={mockHeaderColumns}
          data={mockLargeData}
          frontendPagination
          recordsPerPage={10}
        />,
      );

      expect(screen.queryByText("User 11")).not.toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Show More" }));

      expect(screen.getByText("User 11")).toBeInTheDocument();
      expect(screen.getByText("User 20")).toBeInTheDocument();
      expect(screen.queryByText("User 21")).not.toBeInTheDocument();
    });

    it("disables Show More button when all items are displayed", async () => {
      const user = userEvent.setup();

      render(
        <Table
          headerColumns={mockHeaderColumns}
          data={mockLargeData}
          frontendPagination
          recordsPerPage={10}
        />,
      );

      // Click until all items are loaded
      await user.click(screen.getByRole("button", { name: "Show More" }));
      await user.click(screen.getByRole("button", { name: "Show More" }));

      expect(screen.getByText("User 25")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Show More" })).toBeDisabled();
    });

    it("uses default recordsPerPage of 10 when not specified", () => {
      render(
        <Table
          headerColumns={mockHeaderColumns}
          data={mockLargeData}
          frontendPagination
        />,
      );

      expect(screen.getByText("User 1")).toBeInTheDocument();
      expect(screen.getByText("User 10")).toBeInTheDocument();
      expect(screen.queryByText("User 11")).not.toBeInTheDocument();
    });
  });

  describe("backend pagination", () => {
    it("renders Show More button when backendPagination is enabled", () => {
      render(
        <Table
          headerColumns={mockHeaderColumns}
          data={mockData}
          backendPagination
          displayShowMoreButton
        />,
      );

      expect(
        screen.getByRole("button", { name: "Show More" }),
      ).toBeInTheDocument();
    });

    it("calls onShowMore when Show More is clicked with backend pagination", async () => {
      const user = userEvent.setup();
      const onShowMoreMock = jest.fn();

      render(
        <Table
          headerColumns={mockHeaderColumns}
          data={mockData}
          backendPagination
          onShowMore={onShowMoreMock}
          displayShowMoreButton
        />,
      );

      await user.click(screen.getByRole("button", { name: "Show More" }));

      expect(onShowMoreMock).toHaveBeenCalledTimes(1);
    });

    it("disables Show More button when displayShowMoreButton is false", () => {
      render(
        <Table
          headerColumns={mockHeaderColumns}
          data={mockData}
          backendPagination
          displayShowMoreButton={false}
        />,
      );

      expect(screen.getByRole("button", { name: "Show More" })).toBeDisabled();
    });
  });

  describe("no pagination", () => {
    it("does not render Show More button when pagination is not enabled", () => {
      render(<Table headerColumns={mockHeaderColumns} data={mockData} />);

      expect(
        screen.queryByRole("button", { name: "Show More" }),
      ).not.toBeInTheDocument();
    });

    it("renders all data when pagination is not enabled", () => {
      render(<Table headerColumns={mockHeaderColumns} data={mockLargeData} />);

      mockLargeData.forEach((item) => {
        expect(
          screen.getByText(item.cells[0].value as string),
        ).toBeInTheDocument();
      });
    });
  });
});

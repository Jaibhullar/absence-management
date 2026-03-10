import { renderHook, act } from "@testing-library/react";
import type { Data, HeaderColumn } from "../../types";
import { useTableLogic } from ".";

const mockHeaderColumns: HeaderColumn[] = [
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

describe("useTableLogic", () => {
  describe("initialization", () => {
    it("returns initial state correctly", () => {
      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
        }),
      );

      expect(result.current.displayedData).toEqual(mockData);
      expect(result.current.currentPage).toBe(1);
      expect(result.current.sortConfig).toBeNull();
      expect(result.current.filterConfig).toEqual({});
    });

    it("calculates numberOfPages correctly", () => {
      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
          pagination: {
            mode: "frontend",
            format: "page-numbers",
            recordsPerPage: 2,
          },
        }),
      );

      expect(result.current.numberOfPages).toBe(3); // 5 items / 2 per page = 3 pages
    });

    it("identifies filterable columns correctly", () => {
      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
        }),
      );

      expect(result.current.filteringEnabled).toBe(true);
      expect(result.current.filterableColumns).toHaveLength(2);
      expect(result.current.filterableColumns[0].key).toBe("name");
      expect(result.current.filterableColumns[1].key).toBe("city");
    });

    it("disables filtering when no filterable columns", () => {
      const nonFilterableColumns: HeaderColumn[] = [
        { key: "name", text: "Name", sortable: true },
      ];

      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: nonFilterableColumns,
        }),
      );

      expect(result.current.filteringEnabled).toBe(false);
      expect(result.current.filterableColumns).toHaveLength(0);
    });
  });

  describe("frontend pagination", () => {
    it("paginates data with show-more format", () => {
      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
          pagination: {
            mode: "frontend",
            format: "show-more",
            recordsPerPage: 2,
          },
        }),
      );

      expect(result.current.displayedData).toHaveLength(2);
      expect(result.current.disableShowMoreButton).toBe(false);
    });

    it("handleShowMore adds more items", () => {
      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
          pagination: {
            mode: "frontend",
            format: "show-more",
            recordsPerPage: 2,
          },
        }),
      );

      expect(result.current.displayedData).toHaveLength(2);

      act(() => {
        result.current.handleShowMore();
      });

      expect(result.current.displayedData).toHaveLength(4);
    });

    it("disables show more button when all items shown", () => {
      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
          pagination: {
            mode: "frontend",
            format: "show-more",
            recordsPerPage: 2,
          },
        }),
      );

      act(() => {
        result.current.handleShowMore();
      });
      act(() => {
        result.current.handleShowMore();
      });

      expect(result.current.displayedData).toHaveLength(5);
      expect(result.current.disableShowMoreButton).toBe(true);
    });

    it("handleNextPage moves to next page", () => {
      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
          pagination: {
            mode: "frontend",
            format: "next-prev",
            recordsPerPage: 2,
          },
        }),
      );

      act(() => {
        result.current.handleNextPage();
      });

      expect(result.current.currentPage).toBe(2);
      expect(result.current.displayedData).toHaveLength(2);
      expect(result.current.displayedData[0].key).toBe("3");
    });

    it("handlePrevPage moves to previous page", () => {
      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
          pagination: {
            mode: "frontend",
            format: "next-prev",
            recordsPerPage: 2,
          },
        }),
      );

      act(() => {
        result.current.handleNextPage();
      });
      act(() => {
        result.current.handlePrevPage();
      });

      expect(result.current.currentPage).toBe(1);
      expect(result.current.displayedData[0].key).toBe("1");
    });

    it("disables prev button on first page", () => {
      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
          pagination: {
            mode: "frontend",
            format: "next-prev",
            recordsPerPage: 2,
          },
        }),
      );

      expect(result.current.disablePrevButton).toBe(true);
    });

    it("disables next button on last page", () => {
      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
          pagination: {
            mode: "frontend",
            format: "next-prev",
            recordsPerPage: 2,
          },
        }),
      );

      act(() => {
        result.current.handleNextPage();
      });
      act(() => {
        result.current.handleNextPage();
      });

      expect(result.current.currentPage).toBe(3);
      expect(result.current.disableNextButton).toBe(true);
    });

    it("handlePageChange navigates to specific page", () => {
      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
          pagination: {
            mode: "frontend",
            format: "page-numbers",
            recordsPerPage: 2,
          },
        }),
      );

      act(() => {
        result.current.handlePageChange(3);
      });

      expect(result.current.currentPage).toBe(3);
      expect(result.current.displayedData[0].key).toBe("5");
    });

    it("handlePageChange ignores invalid page numbers", () => {
      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
          pagination: {
            mode: "frontend",
            format: "page-numbers",
            recordsPerPage: 2,
          },
        }),
      );

      act(() => {
        result.current.handlePageChange(0);
      });
      expect(result.current.currentPage).toBe(1);

      act(() => {
        result.current.handlePageChange(100);
      });
      expect(result.current.currentPage).toBe(1);
    });
  });

  describe("backend pagination", () => {
    it("calls onShowMore callback", () => {
      const onShowMore = jest.fn();

      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
          pagination: {
            mode: "backend",
            format: "show-more",
            recordsPerPage: 2,
            numberOfPages: 3,
            enableShowMoreButton: true,
            onShowMore,
          },
        }),
      );

      act(() => {
        result.current.handleShowMore();
      });

      expect(onShowMore).toHaveBeenCalledTimes(1);
    });

    it("calls onNextPage callback", () => {
      const onNextPage = jest.fn();
      const onPrevPage = jest.fn();

      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
          pagination: {
            mode: "backend",
            format: "next-prev",
            recordsPerPage: 2,
            numberOfPages: 3,
            enableNextButton: true,
            enablePrevButton: false,
            onNextPage,
            onPrevPage,
          },
        }),
      );

      act(() => {
        result.current.handleNextPage();
      });

      expect(onNextPage).toHaveBeenCalledTimes(1);
    });

    it("calls onPrevPage callback", () => {
      const onPrevPage = jest.fn();
      const onNextPage = jest.fn();

      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
          pagination: {
            mode: "backend",
            format: "next-prev",
            recordsPerPage: 2,
            numberOfPages: 3,
            enablePrevButton: true,
            enableNextButton: false,
            onPrevPage,
            onNextPage,
          },
        }),
      );

      act(() => {
        result.current.handlePrevPage();
      });

      expect(onPrevPage).toHaveBeenCalledTimes(1);
    });

    it("calls onPageChange callback with page number", () => {
      const onPageChange = jest.fn();

      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
          pagination: {
            mode: "backend",
            format: "page-numbers",
            recordsPerPage: 2,
            numberOfPages: 5,
            onPageChange,
          },
        }),
      );

      act(() => {
        result.current.handlePageChange(3);
      });

      expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it("uses external numberOfPages for backend pagination", () => {
      const onPageChange = jest.fn();

      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
          pagination: {
            mode: "backend",
            format: "page-numbers",
            recordsPerPage: 2,
            numberOfPages: 10,
            onPageChange,
          },
        }),
      );

      expect(result.current.numberOfPages).toBe(10);
    });

    it("respects enableShowMoreButton prop", () => {
      const onShowMore = jest.fn();

      const { result: enabledResult } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
          pagination: {
            mode: "backend",
            format: "show-more",
            recordsPerPage: 2,
            numberOfPages: 3,
            enableShowMoreButton: true,
            onShowMore,
          },
        }),
      );
      expect(enabledResult.current.disableShowMoreButton).toBe(false);

      const { result: disabledResult } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
          pagination: {
            mode: "backend",
            format: "show-more",
            recordsPerPage: 2,
            numberOfPages: 3,
            enableShowMoreButton: false,
            onShowMore,
          },
        }),
      );
      expect(disabledResult.current.disableShowMoreButton).toBe(true);
    });
  });

  describe("sorting", () => {
    it("sorts data ascending on first click", () => {
      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
        }),
      );

      act(() => {
        result.current.handleSortColumn({
          key: "name",
          text: "Name",
          sortable: true,
        });
      });

      expect(result.current.sortConfig).toEqual({
        key: "name",
        direction: "asc",
      });
      expect(result.current.displayedData[0].cells[0].value).toBe("Alice");
      expect(result.current.displayedData[4].cells[0].value).toBe("Eve");
    });

    it("sorts data descending on second click", () => {
      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
        }),
      );

      act(() => {
        result.current.handleSortColumn({
          key: "name",
          text: "Name",
          sortable: true,
        });
      });
      act(() => {
        result.current.handleSortColumn({
          key: "name",
          text: "Name",
          sortable: true,
        });
      });

      expect(result.current.sortConfig).toEqual({
        key: "name",
        direction: "desc",
      });
      expect(result.current.displayedData[0].cells[0].value).toBe("Eve");
      expect(result.current.displayedData[4].cells[0].value).toBe("Alice");
    });

    it("sorts numeric values correctly", () => {
      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
        }),
      );

      act(() => {
        result.current.handleSortColumn({
          key: "age",
          text: "Age",
          sortable: true,
        });
      });

      expect(result.current.displayedData[0].cells[1].value).toBe(25); // Bob
      expect(result.current.displayedData[4].cells[1].value).toBe(35); // Charlie
    });

    it("ignores sort on non-sortable columns", () => {
      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
        }),
      );

      act(() => {
        result.current.handleSortColumn({
          key: "city",
          text: "City",
          sortable: false,
        });
      });

      expect(result.current.sortConfig).toBeNull();
    });

    it("calls onSort callback when provided", () => {
      const onSort = jest.fn();

      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
          onSort,
        }),
      );

      const column = { key: "name", text: "Name", sortable: true };
      act(() => {
        result.current.handleSortColumn(column);
      });

      expect(onSort).toHaveBeenCalledWith(column);
    });

    it("resets to page 1 after sorting", () => {
      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
          pagination: {
            mode: "frontend",
            format: "next-prev",
            recordsPerPage: 2,
          },
        }),
      );

      act(() => {
        result.current.handleNextPage();
      });
      expect(result.current.currentPage).toBe(2);

      act(() => {
        result.current.handleSortColumn({
          key: "name",
          text: "Name",
          sortable: true,
        });
      });
      expect(result.current.currentPage).toBe(1);
    });
  });

  describe("filtering", () => {
    it("filters data by single column", () => {
      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
        }),
      );

      act(() => {
        result.current.handleFiltering("name", "Ali");
      });

      expect(result.current.displayedData).toHaveLength(1);
      expect(result.current.displayedData[0].cells[0].value).toBe("Alice");
    });

    it("filters data by multiple columns", () => {
      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
        }),
      );

      act(() => {
        result.current.handleFiltering("name", "a");
      });

      // Alice, Charlie, Diana all contain 'a'
      expect(result.current.displayedData).toHaveLength(3);

      act(() => {
        result.current.handleFiltering("city", "Ch");
      });

      // Only Charlie lives in Chicago
      expect(result.current.displayedData).toHaveLength(1);
      expect(result.current.displayedData[0].cells[0].value).toBe("Charlie");
    });

    it("updates filterConfig correctly", () => {
      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
        }),
      );

      act(() => {
        result.current.handleFiltering("name", "test");
      });

      expect(result.current.filterConfig).toEqual({ name: "test" });
    });

    it("removes filter when value is empty", () => {
      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
        }),
      );

      act(() => {
        result.current.handleFiltering("name", "Alice");
      });
      expect(result.current.displayedData).toHaveLength(1);

      act(() => {
        result.current.handleFiltering("name", "");
      });
      expect(result.current.displayedData).toHaveLength(5);
      expect(result.current.filterConfig).toEqual({});
    });

    it("filters case-insensitively", () => {
      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
        }),
      );

      act(() => {
        result.current.handleFiltering("name", "ALICE");
      });

      expect(result.current.displayedData).toHaveLength(1);
      expect(result.current.displayedData[0].cells[0].value).toBe("Alice");
    });

    it("resets to page 1 after filtering", () => {
      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
          pagination: {
            mode: "frontend",
            format: "next-prev",
            recordsPerPage: 2,
          },
        }),
      );

      act(() => {
        result.current.handleNextPage();
      });
      expect(result.current.currentPage).toBe(2);

      act(() => {
        result.current.handleFiltering("name", "A");
      });
      expect(result.current.currentPage).toBe(1);
    });
  });

  describe("resetTable", () => {
    it("resets all state to initial values", () => {
      const { result } = renderHook(() =>
        useTableLogic({
          data: mockData,
          headerColumns: mockHeaderColumns,
          pagination: {
            mode: "frontend",
            format: "next-prev",
            recordsPerPage: 2,
          },
        }),
      );

      // Make some changes
      act(() => {
        result.current.handleNextPage();
      });
      act(() => {
        result.current.handleSortColumn({
          key: "name",
          text: "Name",
          sortable: true,
        });
      });
      act(() => {
        result.current.handleFiltering("name", "test");
      });

      // Reset
      act(() => {
        result.current.resetTable();
      });

      expect(result.current.currentPage).toBe(1);
      expect(result.current.sortConfig).toBeNull();
      expect(result.current.filterConfig).toEqual({});
      expect(result.current.displayedData).toHaveLength(2);
    });
  });

  describe("edge cases", () => {
    it("handles empty data array", () => {
      const { result } = renderHook(() =>
        useTableLogic({
          data: [],
          headerColumns: mockHeaderColumns,
        }),
      );

      expect(result.current.displayedData).toEqual([]);
      expect(result.current.numberOfPages).toBe(0);
    });

    it("handles data with missing cell values during sort", () => {
      const dataWithMissing: Data[] = [
        {
          key: "1",
          cells: [{ key: "name", value: "Alice", displayedValue: "Alice" }],
        },
        {
          key: "2",
          cells: [{ key: "other", value: "Bob", displayedValue: "Bob" }],
        },
      ];

      const { result } = renderHook(() =>
        useTableLogic({
          data: dataWithMissing,
          headerColumns: mockHeaderColumns,
        }),
      );

      // Should not throw
      act(() => {
        result.current.handleSortColumn({
          key: "name",
          text: "Name",
          sortable: true,
        });
      });

      expect(result.current.displayedData).toHaveLength(2);
    });
  });
});

import { renderHook, act } from "@testing-library/react";
import { usePagination, DEFAULT_ITEMS_PER_PAGE } from ".";

type TestItem = { id: number; name: string };

const createTestData = (count: number): TestItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
  }));

describe("usePagination", () => {
  describe("initialization", () => {
    it("should return first page of data by default", () => {
      const data = createTestData(20);

      const { result } = renderHook(() => usePagination({ data }));

      expect(result.current.paginationConfig.currentPage).toBe(1);
      expect(result.current.paginatedData.length).toBe(DEFAULT_ITEMS_PER_PAGE);
      expect(result.current.paginatedData[0]).toEqual(data[0]);
    });

    it("should calculate correct number of pages", () => {
      const data = createTestData(20);

      const { result } = renderHook(() => usePagination({ data }));

      const expectedPages = Math.ceil(data.length / DEFAULT_ITEMS_PER_PAGE);
      expect(result.current.paginationConfig.numberOfPages).toBe(expectedPages);
    });

    it("should use custom itemsPerPage when provided", () => {
      const data = createTestData(20);
      const customItemsPerPage = 5;

      const { result } = renderHook(() =>
        usePagination({ data, itemsPerPage: customItemsPerPage }),
      );

      expect(result.current.paginatedData.length).toBe(customItemsPerPage);
      expect(result.current.paginationConfig.numberOfPages).toBe(
        Math.ceil(data.length / customItemsPerPage),
      );
    });

    it("should handle empty data array", () => {
      const { result } = renderHook(() => usePagination({ data: [] }));

      expect(result.current.paginatedData).toEqual([]);
      expect(result.current.paginationConfig.currentPage).toBe(1);
      expect(result.current.paginationConfig.numberOfPages).toBe(0);
    });

    it("should handle data smaller than itemsPerPage", () => {
      const data = createTestData(3);

      const { result } = renderHook(() => usePagination({ data }));

      expect(result.current.paginatedData.length).toBe(3);
      expect(result.current.paginationConfig.numberOfPages).toBe(1);
    });
  });

  describe("handlePageChange", () => {
    it("should change to specified page", () => {
      const data = createTestData(20);

      const { result } = renderHook(() => usePagination({ data }));

      act(() => {
        result.current.paginationConfig.handlePageChange(2);
      });

      expect(result.current.paginationConfig.currentPage).toBe(2);
      expect(result.current.paginatedData[0]).toEqual(
        data[DEFAULT_ITEMS_PER_PAGE],
      );
    });

    it("should clamp page number to minimum of 1", () => {
      const data = createTestData(20);

      const { result } = renderHook(() => usePagination({ data }));

      act(() => {
        result.current.paginationConfig.handlePageChange(0);
      });

      expect(result.current.paginationConfig.currentPage).toBe(1);

      act(() => {
        result.current.paginationConfig.handlePageChange(-5);
      });

      expect(result.current.paginationConfig.currentPage).toBe(1);
    });

    it("should clamp page number to maximum numberOfPages", () => {
      const data = createTestData(20);

      const { result } = renderHook(() => usePagination({ data }));

      const { numberOfPages } = result.current.paginationConfig;

      act(() => {
        result.current.paginationConfig.handlePageChange(100);
      });

      expect(result.current.paginationConfig.currentPage).toBe(numberOfPages);
    });

    it("should return correct items for last page with partial data", () => {
      const data = createTestData(10); // With DEFAULT_ITEMS_PER_PAGE=8, page 2 has 2 items
      const itemsPerPage = 8;
      const expectedLastPageItems = data.length % itemsPerPage || itemsPerPage;

      const { result } = renderHook(() =>
        usePagination({ data, itemsPerPage }),
      );

      act(() => {
        result.current.paginationConfig.handlePageChange(2);
      });

      expect(result.current.paginatedData.length).toBe(expectedLastPageItems);
    });
  });

  describe("data reactivity", () => {
    it("should recalculate pagination when data changes", () => {
      const initialData = createTestData(20);

      const { result, rerender } = renderHook(
        ({ data }) => usePagination({ data }),
        { initialProps: { data: initialData } },
      );

      expect(result.current.paginationConfig.numberOfPages).toBe(3);

      const newData = createTestData(5);
      rerender({ data: newData });

      expect(result.current.paginationConfig.numberOfPages).toBe(1);
      expect(result.current.paginatedData.length).toBe(5);
    });

    it("should recalculate pagination when itemsPerPage changes", () => {
      const data = createTestData(20);

      const { result, rerender } = renderHook(
        ({ itemsPerPage }) => usePagination({ data, itemsPerPage }),
        { initialProps: { itemsPerPage: 5 } },
      );

      expect(result.current.paginationConfig.numberOfPages).toBe(4);
      expect(result.current.paginatedData.length).toBe(5);

      rerender({ itemsPerPage: 10 });

      expect(result.current.paginationConfig.numberOfPages).toBe(2);
      expect(result.current.paginatedData.length).toBe(10);
    });
  });

  describe("DEFAULT_ITEMS_PER_PAGE export", () => {
    it("should export the correct default value", () => {
      expect(DEFAULT_ITEMS_PER_PAGE).toBe(8);
    });
  });
});

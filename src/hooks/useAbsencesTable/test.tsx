import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import type { Absence } from "@/types";
import { useAbsencesTable, ABSENCES_QUERY_KEY, ITEMS_PER_PAGE } from ".";

const mockGetAbsences = jest.fn();

jest.mock("@/services/getAbsences", () => ({
  getAbsences: () => mockGetAbsences(),
}));

const mockAbsencesResponse: Absence[] = [
  {
    id: 1,
    startDate: "2024-01-15T00:00:00.000Z",
    days: 5,
    absenceType: "ANNUAL_LEAVE",
    approved: true,
    employee: { id: "user-1", firstName: "John", lastName: "Doe" },
  },
  {
    id: 2,
    startDate: "2024-02-20T00:00:00.000Z",
    days: 3,
    absenceType: "SICKNESS",
    approved: false,
    employee: { id: "user-2", firstName: "Jane", lastName: "Smith" },
  },
  {
    id: 3,
    startDate: "2024-01-10T00:00:00.000Z",
    days: 2,
    absenceType: "MEDICAL",
    approved: true,
    employee: { id: "user-1", firstName: "John", lastName: "Doe" },
  },
  {
    id: 4,
    startDate: "2024-03-01T00:00:00.000Z",
    days: 4,
    absenceType: "ANNUAL_LEAVE",
    approved: true,
    employee: { id: "user-3", firstName: "Alice", lastName: "Johnson" },
  },
  {
    id: 5,
    startDate: "2024-03-15T00:00:00.000Z",
    days: 1,
    absenceType: "SICKNESS",
    approved: true,
    employee: { id: "user-4", firstName: "Bob", lastName: "Williams" },
  },
  {
    id: 6,
    startDate: "2024-04-01T00:00:00.000Z",
    days: 7,
    absenceType: "ANNUAL_LEAVE",
    approved: false,
    employee: { id: "user-5", firstName: "Charlie", lastName: "Brown" },
  },
];

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const createWrapper = () => {
  const queryClient = createTestQueryClient();
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useAbsencesTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("initialization and loading", () => {
    it("should return loading state initially", () => {
      mockGetAbsences.mockImplementation(
        () => new Promise(() => {}), // never resolves
      );

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      expect(result.current.absencesLoading).toBe(true);
      expect(result.current.absences).toEqual([]);
      expect(result.current.absencesError).toBeNull();
      expect(result.current.filteredUser).toBeNull();
    });

    it("should fetch and return formatted absences on success", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsencesResponse);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      expect(result.current.absences.length).toBe(ITEMS_PER_PAGE);
      expect(result.current.absencesError).toBeNull();
    });

    it("should return error message when fetch fails", async () => {
      mockGetAbsences.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      expect(result.current.absencesError).toBe(
        "There was an error fetching absences...",
      );
    });

    it("should sort absences by start date descending by default", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsencesResponse);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      const startDates = result.current.absences.map((a) => a.startDate);
      // Verify dates are in descending order (most recent first)
      for (let i = 0; i < startDates.length - 1; i++) {
        expect(new Date(startDates[i]).getTime()).toBeGreaterThanOrEqual(
          new Date(startDates[i + 1]).getTime(),
        );
      }
    });
  });

  describe("filtering by user", () => {
    it("should filter absences when handleFilterAbsencesByUser is called", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsencesResponse);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      act(() => {
        result.current.handleFilterAbsencesByUser("user-1", "John Doe");
      });

      expect(result.current.filteredUser).toEqual({
        id: "user-1",
        name: "John Doe",
      });
      expect(result.current.absences.every((a) => a.userId === "user-1")).toBe(
        true,
      );
    });

    it("should clear filter when handleClearFilterAbsencesByUser is called", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsencesResponse);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      act(() => {
        result.current.handleFilterAbsencesByUser("user-1", "John Doe");
      });

      expect(result.current.filteredUser).not.toBeNull();

      act(() => {
        result.current.handleClearFilterAbsencesByUser();
      });

      expect(result.current.filteredUser).toBeNull();
    });

    it("should return empty array when filtering by non-existent user", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsencesResponse);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      act(() => {
        result.current.handleFilterAbsencesByUser(
          "non-existent",
          "Unknown User",
        );
      });

      expect(result.current.absences).toEqual([]);
    });
  });

  describe("sorting", () => {
    it("should sort absences ascending when handleSortAbsences is called", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsencesResponse);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      act(() => {
        result.current.handleSortAbsences("employeeName");
      });

      expect(result.current.absences[0].employeeName).toBe("Alice Johnson");
    });

    it("should toggle sort order when same key is sorted twice", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsencesResponse);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      act(() => {
        result.current.handleSortAbsences("employeeName");
      });

      expect(result.current.absences[0].employeeName).toBe("Alice Johnson");

      act(() => {
        result.current.handleSortAbsences("employeeName");
      });

      expect(result.current.absences[0].employeeName).toBe("John Doe");
    });

    it("should reset to ascending when sorting by different key", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsencesResponse);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      act(() => {
        result.current.handleSortAbsences("employeeName");
      });
      act(() => {
        result.current.handleSortAbsences("employeeName");
      });

      act(() => {
        result.current.handleSortAbsences("days");
      });

      expect(result.current.absences[0].days).toBe(1);
    });
  });

  describe("pagination", () => {
    it("should return first page of items by default", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsencesResponse);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      expect(result.current.absences.length).toBe(5);
    });

    it("should change page when handlePageChange is called", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsencesResponse);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      const firstPageFirstItem = result.current.absences[0];

      act(() => {
        result.current.paginationConfig.handlePageChange(2);
      });

      expect(result.current.absences.length).toBe(1);
      expect(result.current.absences[0]).not.toEqual(firstPageFirstItem);
    });
  });

  describe("combined operations", () => {
    it("should apply filtering and sorting together", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsencesResponse);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      act(() => {
        result.current.handleFilterAbsencesByUser("user-1", "John Doe");
      });

      act(() => {
        result.current.handleSortAbsences("days");
      });

      // Verify filtering is applied
      expect(result.current.absences.every((a) => a.userId === "user-1")).toBe(
        true,
      );

      // Verify sorting is applied (ascending by days)
      const days = result.current.absences.map((a) => a.days);
      for (let i = 0; i < days.length - 1; i++) {
        expect(days[i]).toBeLessThanOrEqual(days[i + 1]);
      }
    });
  });

  describe("ABSENCES_QUERY_KEY export", () => {
    it("should export the correct query key", () => {
      expect(ABSENCES_QUERY_KEY).toEqual(["absences"]);
    });
  });

  describe("sortConfig", () => {
    it("should return default sortConfig with startDate descending", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsencesResponse);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      expect(result.current.sortConfig).toEqual({
        key: "startDate",
        order: "desc",
      });
    });

    it("should update sortConfig when handleSortAbsences is called", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsencesResponse);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      act(() => {
        result.current.handleSortAbsences("employeeName");
      });

      expect(result.current.sortConfig).toEqual({
        key: "employeeName",
        order: "asc",
      });
    });

    it("should toggle sortConfig order when same key is sorted again", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsencesResponse);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      act(() => {
        result.current.handleSortAbsences("employeeName");
      });

      expect(result.current.sortConfig.order).toBe("asc");

      act(() => {
        result.current.handleSortAbsences("employeeName");
      });

      expect(result.current.sortConfig.order).toBe("desc");
    });
  });

  describe("paginationConfig", () => {
    it("should return correct initial paginationConfig", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsencesResponse);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      expect(result.current.paginationConfig.currentPage).toBe(1);
      expect(result.current.paginationConfig.numberOfPages).toBe(2); // 6 items / 5 per page = 2 pages
      expect(typeof result.current.paginationConfig.handlePageChange).toBe(
        "function",
      );
    });

    it("should update currentPage when handlePageChange is called", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsencesResponse);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      expect(result.current.paginationConfig.currentPage).toBe(1);

      act(() => {
        result.current.paginationConfig.handlePageChange(2);
      });

      expect(result.current.paginationConfig.currentPage).toBe(2);
    });

    it("should recalculate numberOfPages when filtering reduces items", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsencesResponse);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      expect(result.current.paginationConfig.numberOfPages).toBe(2);

      act(() => {
        result.current.handleFilterAbsencesByUser("user-1", "John Doe");
      });

      // user-1 has only 2 absences, so 1 page
      expect(result.current.paginationConfig.numberOfPages).toBe(1);
    });

    it("should reset currentPage to 1 when filtering", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsencesResponse);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      act(() => {
        result.current.paginationConfig.handlePageChange(2);
      });

      expect(result.current.paginationConfig.currentPage).toBe(2);

      act(() => {
        result.current.handleFilterAbsencesByUser("user-1", "John Doe");
      });

      expect(result.current.paginationConfig.currentPage).toBe(1);
    });

    it("should reset currentPage to 1 when clearing filter", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsencesResponse);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      act(() => {
        result.current.handleFilterAbsencesByUser("user-1", "John Doe");
      });

      act(() => {
        result.current.paginationConfig.handlePageChange(2);
      });

      act(() => {
        result.current.handleClearFilterAbsencesByUser();
      });

      expect(result.current.paginationConfig.currentPage).toBe(1);
    });

    it("should reset currentPage to 1 when sorting", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsencesResponse);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      act(() => {
        result.current.paginationConfig.handlePageChange(2);
      });

      expect(result.current.paginationConfig.currentPage).toBe(2);

      act(() => {
        result.current.handleSortAbsences("employeeName");
      });

      expect(result.current.paginationConfig.currentPage).toBe(1);
    });

    it("should clamp page number to valid range", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsencesResponse);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      // Try to go to page 100 (out of range)
      act(() => {
        result.current.paginationConfig.handlePageChange(100);
      });

      expect(result.current.paginationConfig.currentPage).toBe(2); // Should clamp to max (2 pages)

      // Try to go to page 0 (out of range)
      act(() => {
        result.current.paginationConfig.handlePageChange(0);
      });

      expect(result.current.paginationConfig.currentPage).toBe(1); // Should clamp to min (1)
    });
  });
});

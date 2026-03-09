import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useAbsencesTable, ABSENCES_QUERY_KEY } from "./index";
import { getAbsences } from "@/services/getAbsences";
import type { Absence } from "@/types";

jest.mock("@/services/getAbsences", () => ({
  getAbsences: jest.fn(),
}));

const mockGetAbsences = jest.mocked(getAbsences);

const mockAbsences: Absence[] = [
  {
    id: 1,
    startDate: "2024-01-15T00:00:00.000Z",
    days: 5,
    absenceType: "ANNUAL_LEAVE",
    approved: true,
    employee: {
      id: "user-1",
      firstName: "John",
      lastName: "Doe",
    },
  },
  {
    id: 2,
    startDate: "2024-02-20T00:00:00.000Z",
    days: 3,
    absenceType: "SICKNESS",
    approved: false,
    employee: {
      id: "user-2",
      firstName: "Jane",
      lastName: "Smith",
    },
  },
  {
    id: 3,
    startDate: "2024-01-10T00:00:00.000Z",
    days: 2,
    absenceType: "MEDICAL",
    approved: true,
    employee: {
      id: "user-1",
      firstName: "John",
      lastName: "Doe",
    },
  },
];

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useAbsencesTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("initialization and loading states", () => {
    it("should return loading state initially", () => {
      mockGetAbsences.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      expect(result.current.absencesLoading).toBe(true);
      expect(result.current.absences).toEqual([]);
      expect(result.current.absencesError).toBeNull();
      expect(result.current.filteredUser).toBeNull();
    });

    it("should return absences after successful fetch", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsences);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      expect(result.current.absences.length).toBe(3);
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
      expect(result.current.absences).toEqual([]);
    });
  });

  describe("data formatting", () => {
    it("should format absences correctly", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsences);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      const formattedAbsence = result.current.absences.find((a) => a.id === 1);

      expect(formattedAbsence).toMatchObject({
        id: 1,
        userId: "user-1",
        employeeName: "John Doe",
        startDate: "2024-01-15T00:00:00.000Z",
        endDate: "2024-01-20T00:00:00.000Z",
        days: 5,
        type: "Annual Leave",
        approved: true,
      });
    });

    it("should format all absence types correctly", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsences);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      const types = result.current.absences.map((a) => a.type);

      expect(types).toContain("Annual Leave");
      expect(types).toContain("Sickness");
      expect(types).toContain("Medical");
    });

    it("should sort absences by start date in descending order", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsences);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      const startDates = result.current.absences.map((a) => a.startDate);

      // Should be sorted by date descending (most recent first)
      expect(startDates).toEqual([
        "2024-02-20T00:00:00.000Z",
        "2024-01-15T00:00:00.000Z",
        "2024-01-10T00:00:00.000Z",
      ]);
    });
  });

  describe("filterAbsencesByUser", () => {
    it("should filter absences by user when filterAbsencesByUser is called", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsences);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      act(() => {
        result.current.filterAbsencesByUser("user-1", "John Doe");
      });

      expect(result.current.filteredUser).toEqual({
        id: "user-1",
        name: "John Doe",
      });

      // Should only show absences for user-1
      expect(result.current.absences.length).toBe(2);
      expect(result.current.absences.every((a) => a.userId === "user-1")).toBe(
        true,
      );
    });

    it("should update filteredUser state correctly", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsences);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      expect(result.current.filteredUser).toBeNull();

      act(() => {
        result.current.filterAbsencesByUser("user-2", "Jane Smith");
      });

      expect(result.current.filteredUser).toEqual({
        id: "user-2",
        name: "Jane Smith",
      });
    });

    it("should return single absence when filtering by user with one absence", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsences);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      act(() => {
        result.current.filterAbsencesByUser("user-2", "Jane Smith");
      });

      expect(result.current.absences.length).toBe(1);
      expect(result.current.absences[0].employeeName).toBe("Jane Smith");
    });

    it("should return empty array when filtering by non-existent user", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsences);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      act(() => {
        result.current.filterAbsencesByUser("non-existent", "Unknown User");
      });

      expect(result.current.absences.length).toBe(0);
    });
  });

  describe("clearFilterAbsencesByUser", () => {
    it("should clear the user filter and show all absences", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsences);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      // First, apply a filter
      act(() => {
        result.current.filterAbsencesByUser("user-1", "John Doe");
      });

      expect(result.current.absences.length).toBe(2);
      expect(result.current.filteredUser).not.toBeNull();

      // Then clear the filter
      act(() => {
        result.current.clearFilterAbsencesByUser();
      });

      expect(result.current.filteredUser).toBeNull();
      expect(result.current.absences.length).toBe(3);
    });

    it("should have no effect when called without active filter", async () => {
      mockGetAbsences.mockResolvedValue(mockAbsences);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      const initialAbsencesCount = result.current.absences.length;

      act(() => {
        result.current.clearFilterAbsencesByUser();
      });

      expect(result.current.filteredUser).toBeNull();
      expect(result.current.absences.length).toBe(initialAbsencesCount);
    });
  });

  describe("query key", () => {
    it("should export the correct query key", () => {
      expect(ABSENCES_QUERY_KEY).toEqual(["absences"]);
    });
  });

  describe("empty data handling", () => {
    it("should handle empty absences array", async () => {
      mockGetAbsences.mockResolvedValue([]);

      const { result } = renderHook(() => useAbsencesTable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.absencesLoading).toBe(false);
      });

      expect(result.current.absences).toEqual([]);
      expect(result.current.absencesError).toBeNull();
    });
  });
});

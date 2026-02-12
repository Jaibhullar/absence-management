import type { FormattedAbsence } from "@/types";
import { renderHook, waitFor } from "@testing-library/react";
import { useSortTable } from ".";

const mockAbsences: FormattedAbsence[] = [
  {
    id: 2,
    userId: "2",
    startDate: "Feb 1, 2026",
    endDate: "Feb 4, 2026",
    employeeName: "Jane Smith",
    type: "Sickness",
    approved: false,
    conflicts: false,
    days: 3,
  },
  {
    id: 1,
    userId: "1",
    startDate: "Jan 1, 2026",
    endDate: "Jan 6, 2026",
    employeeName: "John Doe",
    type: "Annual Leave",
    approved: true,
    conflicts: false,
    days: 5,
  },
];

describe("useSortTable", () => {
  it("should filter absences by user", async () => {
    const { result } = renderHook(() =>
      useSortTable({ absences: mockAbsences }),
    );

    await waitFor(() => {
      result.current.filterAbsencesByUser("1", "John Doe");
      expect(result.current.sortedAndFilteredAbsences).toEqual([
        mockAbsences[1],
      ]);
      expect(result.current.filteredUser).toEqual({
        name: "John Doe",
        id: "1",
      });
    });
  });
  it("should clear filter and show all absences", async () => {
    const { result } = renderHook(() =>
      useSortTable({ absences: mockAbsences }),
    );

    await waitFor(() => {
      result.current.filterAbsencesByUser("1", "John Doe");
      expect(result.current.sortedAndFilteredAbsences).toEqual([
        mockAbsences[1],
      ]);
      expect(result.current.filteredUser).toEqual({
        name: "John Doe",
        id: "1",
      });
    });

    await waitFor(() => {
      result.current.clearFilter();
      expect(result.current.sortedAndFilteredAbsences).toEqual(mockAbsences);
      expect(result.current.filteredUser).toBeNull();
    });
  });
  it("should sort absences by employee name both ways", async () => {
    const { result } = renderHook(() =>
      useSortTable({ absences: mockAbsences }),
    );

    await waitFor(() => {
      result.current.sortBy("employeeName");
      expect(result.current.sortedAndFilteredAbsences[0].employeeName).toBe(
        "Jane Smith",
      );
      expect(result.current.sortedAndFilteredAbsences[1].employeeName).toBe(
        "John Doe",
      );
    });

    await waitFor(() => {
      result.current.sortBy("employeeName");
      expect(result.current.sortedAndFilteredAbsences[0].employeeName).toBe(
        "John Doe",
      );
      expect(result.current.sortedAndFilteredAbsences[1].employeeName).toBe(
        "Jane Smith",
      );
    });
  });
  it("should sort absences by start date both ways", async () => {
    const { result } = renderHook(() =>
      useSortTable({ absences: mockAbsences }),
    );

    await waitFor(() => {
      result.current.sortBy("startDate");
      expect(result.current.sortedAndFilteredAbsences[0].startDate).toBe(
        "Jan 1, 2026",
      );
      expect(result.current.sortedAndFilteredAbsences[1].startDate).toBe(
        "Feb 1, 2026",
      );
    });

    await waitFor(() => {
      result.current.sortBy("startDate");
      expect(result.current.sortedAndFilteredAbsences[1].startDate).toBe(
        "Jan 1, 2026",
      );
      expect(result.current.sortedAndFilteredAbsences[0].startDate).toBe(
        "Feb 1, 2026",
      );
    });
  });
  it("should sort absences by end date both ways", async () => {
    const { result } = renderHook(() =>
      useSortTable({ absences: mockAbsences }),
    );

    await waitFor(() => {
      result.current.sortBy("endDate");
      expect(result.current.sortedAndFilteredAbsences[0].endDate).toBe(
        "Jan 6, 2026",
      );
      expect(result.current.sortedAndFilteredAbsences[1].endDate).toBe(
        "Feb 4, 2026",
      );
    });
    await waitFor(() => {
      result.current.sortBy("endDate");
      expect(result.current.sortedAndFilteredAbsences[1].endDate).toBe(
        "Jan 6, 2026",
      );
      expect(result.current.sortedAndFilteredAbsences[0].endDate).toBe(
        "Feb 4, 2026",
      );
    });
  });
  it("should sort absences by type both ways", async () => {
    const { result } = renderHook(() =>
      useSortTable({ absences: mockAbsences }),
    );

    await waitFor(() => {
      result.current.sortBy("type");
      expect(result.current.sortedAndFilteredAbsences[0].type).toBe(
        "Annual Leave",
      );
      expect(result.current.sortedAndFilteredAbsences[1].type).toBe("Sickness");
    });
    await waitFor(() => {
      result.current.sortBy("type");
      expect(result.current.sortedAndFilteredAbsences[1].type).toBe(
        "Annual Leave",
      );
      expect(result.current.sortedAndFilteredAbsences[0].type).toBe("Sickness");
    });
  });
  it("should sort absences by days both ways", async () => {
    const { result } = renderHook(() =>
      useSortTable({ absences: mockAbsences }),
    );

    await waitFor(() => {
      result.current.sortBy("days");
      expect(result.current.sortedAndFilteredAbsences[0].days).toBe(3);
      expect(result.current.sortedAndFilteredAbsences[1].days).toBe(5);
    });
    await waitFor(() => {
      result.current.sortBy("days");
      expect(result.current.sortedAndFilteredAbsences[1].days).toBe(3);
      expect(result.current.sortedAndFilteredAbsences[0].days).toBe(5);
    });
  });
});

import { getAbsences } from "@/services/getAbsences";
import { renderHook, waitFor } from "@testing-library/react";
import { useAbsencesTable } from ".";
import { getAbsenceConflict } from "@/services/getAbsenceConflict";
import type { Absence, FormattedAbsence } from "@/types";

jest.mock("@/services/getAbsences", () => ({
  getAbsences: jest.fn(),
}));

jest.mock("@/services/getAbsenceConflict", () => ({
  getAbsenceConflict: jest.fn(),
}));

const mockAbsences: Absence[] = [
  {
    id: 1,
    startDate: "2026-01-01",
    employee: { firstName: "John", lastName: "Doe", id: "1" },
    absenceType: "ANNUAL_LEAVE",
    approved: true,
    days: 5,
  },
  {
    id: 2,
    startDate: "2026-02-01",
    employee: { firstName: "Jane", lastName: "Smith", id: "2" },
    absenceType: "SICKNESS",
    approved: false,
    days: 3,
  },
];

const mockFormattedAbsences: FormattedAbsence[] = [
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

describe("useAbsenceTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(getAbsences).mockResolvedValue([]);
    jest.mocked(getAbsenceConflict).mockResolvedValue({ conflicts: false });
  });
  it('shoud call "getAbsences" on mount', async () => {
    renderHook(() => useAbsencesTable());

    await waitFor(() => {
      expect(jest.mocked(getAbsences)).toHaveBeenCalled();
    });
  });
  it("should set loading to true while fetching and false after", async () => {
    const { result } = renderHook(() => useAbsencesTable());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
  it("should return formatted absences", async () => {
    jest.mocked(getAbsences).mockResolvedValue(mockAbsences);

    const { result } = renderHook(() => useAbsencesTable());

    await waitFor(() => {
      expect(result.current.absences).toEqual(mockFormattedAbsences);
    });
  });
  it("should sort absences by start date in descending order", async () => {
    jest.mocked(getAbsences).mockResolvedValue(mockAbsences);

    const { result } = renderHook(() => useAbsencesTable());

    await waitFor(() => {
      expect(result.current.absences[0].id).toBe(2);
      expect(result.current.absences[1].id).toBe(1);
    });
  });
  it("should fetch conflicts for each absence", async () => {
    jest.mocked(getAbsences).mockResolvedValue(mockAbsences);

    renderHook(() => useAbsencesTable());

    await waitFor(() => {
      expect(jest.mocked(getAbsenceConflict)).toHaveBeenCalledTimes(2);
      expect(jest.mocked(getAbsenceConflict)).toHaveBeenCalledWith(1);
      expect(jest.mocked(getAbsenceConflict)).toHaveBeenCalledWith(2);
    });
  });
  it("should set conflicts property on absences", async () => {
    jest.mocked(getAbsences).mockResolvedValue(mockAbsences);
    jest.mocked(getAbsenceConflict).mockResolvedValue({ conflicts: true });

    const { result } = renderHook(() => useAbsencesTable());

    await waitFor(() => {
      expect(result.current.absences[0].conflicts).toBe(true);
      expect(result.current.absences[1].conflicts).toBe(true);
    });
  });
  it("should set error when getAbsences fails", async () => {
    jest.mocked(getAbsences).mockRejectedValue(new Error());

    const { result } = renderHook(() => useAbsencesTable());

    await waitFor(() => {
      expect(result.current.error).toBe(
        "There was an error fetching absences...",
      );
    });
  });
  it("should set conflicts to false when getAbsenceConflict fails", async () => {
    jest.mocked(getAbsences).mockResolvedValue(mockAbsences);
    jest.mocked(getAbsenceConflict).mockRejectedValue(new Error());

    const { result } = renderHook(() => useAbsencesTable());

    await waitFor(() => {
      expect(result.current.absences[0].conflicts).toBe(false);
      expect(result.current.absences[1].conflicts).toBe(false);
    });
  });
  it("should filter absences by user", async () => {
    jest.mocked(getAbsences).mockResolvedValue(mockAbsences);

    const { result } = renderHook(() => useAbsencesTable());

    await waitFor(() => {
      result.current.filterAbsencesByUser("1", "John Doe");
      expect(result.current.absences).toEqual([mockFormattedAbsences[1]]);
      expect(result.current.filteredUser).toBe("John Doe");
    });
  });
  it("should clear filter and show all absences", async () => {
    jest.mocked(getAbsences).mockResolvedValue(mockAbsences);

    const { result } = renderHook(() => useAbsencesTable());

    await waitFor(() => {
      result.current.filterAbsencesByUser("1", "John Doe");
      expect(result.current.absences).toEqual([mockFormattedAbsences[1]]);
      expect(result.current.filteredUser).toBe("John Doe");
    });

    await waitFor(() => {
      result.current.clearFilter();
      expect(result.current.absences).toEqual(mockFormattedAbsences);
      expect(result.current.filteredUser).toBeNull();
    });
  });
  it("should sort absences by employee name both ways", async () => {
    jest.mocked(getAbsences).mockResolvedValue(mockAbsences);

    const { result } = renderHook(() => useAbsencesTable());

    await waitFor(() => {
      result.current.sortBy("employeeName");
      expect(result.current.absences[0].employeeName).toBe("Jane Smith");
      expect(result.current.absences[1].employeeName).toBe("John Doe");
    });

    await waitFor(() => {
      result.current.sortBy("employeeName");
      expect(result.current.absences[0].employeeName).toBe("John Doe");
      expect(result.current.absences[1].employeeName).toBe("Jane Smith");
    });
  });
  it("should sort absences by start date both ways", async () => {
    jest.mocked(getAbsences).mockResolvedValue(mockAbsences);

    const { result } = renderHook(() => useAbsencesTable());

    await waitFor(() => {
      result.current.sortBy("startDate");
      expect(result.current.absences[0].startDate).toBe("Jan 1, 2026");
      expect(result.current.absences[1].startDate).toBe("Feb 1, 2026");
    });

    await waitFor(() => {
      result.current.sortBy("startDate");
      expect(result.current.absences[1].startDate).toBe("Jan 1, 2026");
      expect(result.current.absences[0].startDate).toBe("Feb 1, 2026");
    });
  });
  it("should sort absences by end date both ways", async () => {
    jest.mocked(getAbsences).mockResolvedValue(mockAbsences);

    const { result } = renderHook(() => useAbsencesTable());

    await waitFor(() => {
      result.current.sortBy("endDate");
      expect(result.current.absences[0].endDate).toBe("Jan 6, 2026");
      expect(result.current.absences[1].endDate).toBe("Feb 4, 2026");
    });
    await waitFor(() => {
      result.current.sortBy("endDate");
      expect(result.current.absences[1].endDate).toBe("Jan 6, 2026");
      expect(result.current.absences[0].endDate).toBe("Feb 4, 2026");
    });
  });
  it("should sort absences by type both ways", async () => {
    jest.mocked(getAbsences).mockResolvedValue(mockAbsences);

    const { result } = renderHook(() => useAbsencesTable());

    await waitFor(() => {
      result.current.sortBy("type");
      expect(result.current.absences[0].type).toBe("Annual Leave");
      expect(result.current.absences[1].type).toBe("Sickness");
    });
    await waitFor(() => {
      result.current.sortBy("type");
      expect(result.current.absences[1].type).toBe("Annual Leave");
      expect(result.current.absences[0].type).toBe("Sickness");
    });
  });
  it("should sort absences by days both ways", async () => {
    jest.mocked(getAbsences).mockResolvedValue(mockAbsences);

    const { result } = renderHook(() => useAbsencesTable());

    await waitFor(() => {
      result.current.sortBy("days");
      expect(result.current.absences[0].days).toBe(3);
      expect(result.current.absences[1].days).toBe(5);
    });
    await waitFor(() => {
      result.current.sortBy("days");
      expect(result.current.absences[1].days).toBe(3);
      expect(result.current.absences[0].days).toBe(5);
    });
  });
});

import { getAbsences } from "@/services/getAbsences";
import { renderHook, waitFor } from "@testing-library/react";
import { useAbsencesTable } from "./useAbsencesTable";
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
    startDate: "Feb 1, 2026",
    endDate: "Feb 3, 2026",
    employeeName: "Jane Smith",
    type: "Sickness",
    approved: false,
    conflicts: false,
    days: 3,
  },
  {
    id: 1,
    startDate: "Jan 1, 2026",
    endDate: "Jan 5, 2026",
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
});

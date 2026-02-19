import { getAbsences } from "@/services/getAbsences";
import { renderHook, waitFor } from "@testing-library/react";
import { useAbsencesTable } from ".";
import type { Absence, FormattedAbsence } from "@/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

jest.mock("@/services/getAbsences", () => ({
  getAbsences: jest.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Don't retry in tests
      },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

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

    days: 5,
  },
];

describe("useAbsenceTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(getAbsences).mockResolvedValue([]);
  });
  it('shoud call "getAbsences" on mount', async () => {
    renderHook(() => useAbsencesTable(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(jest.mocked(getAbsences)).toHaveBeenCalled();
    });
  });
  it("should set loading to true while fetching and false after", async () => {
    const { result } = renderHook(() => useAbsencesTable(), {
      wrapper: createWrapper(),
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
  it("should return formatted absences", async () => {
    jest.mocked(getAbsences).mockResolvedValue(mockAbsences);

    const { result } = renderHook(() => useAbsencesTable(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.absences).toEqual(mockFormattedAbsences);
    });
  });
  it("should sort absences by start date in descending order", async () => {
    jest.mocked(getAbsences).mockResolvedValue(mockAbsences);

    const { result } = renderHook(() => useAbsencesTable(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.absences[0].id).toBe(2);
      expect(result.current.absences[1].id).toBe(1);
    });
  });
  it("should set error when getAbsences fails", async () => {
    jest.mocked(getAbsences).mockRejectedValue(new Error());

    const { result } = renderHook(() => useAbsencesTable(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.error).toBe(
        "There was an error fetching absences...",
      );
    });
  });
});

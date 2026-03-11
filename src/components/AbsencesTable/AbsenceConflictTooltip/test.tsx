import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { AbsenceConflictTooltip } from ".";
import { Spinner } from "@/components/ui/Spinner";

const mockGetAbsenceConflict = jest.fn();

const testIds = AbsenceConflictTooltip.testIds;

jest.mock("@/services/getAbsenceConflict", () => ({
  getAbsenceConflict: (id: number) => mockGetAbsenceConflict(id),
}));

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

describe("AbsenceConflictTooltip", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("loading state", () => {
    it("should show spinner while loading", () => {
      mockGetAbsenceConflict.mockImplementation(
        () => new Promise(() => {}), // never resolves
      );

      render(<AbsenceConflictTooltip absenceId={1} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId(Spinner.testIds.spinner)).toBeInTheDocument();
    });
  });

  describe("conflict state", () => {
    it("should show warning icon when absence has conflicts", async () => {
      mockGetAbsenceConflict.mockResolvedValue({ conflicts: true });

      render(<AbsenceConflictTooltip absenceId={1} />, {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(
          screen.queryByTestId(Spinner.testIds.spinner),
        ).not.toBeInTheDocument();
      });

      // The AlertTriangleIcon should be visible - it's inside a tooltip trigger
      const warningIcon = document.querySelector(".text-destructive.size-5");
      expect(warningIcon).toBeInTheDocument();
    });

    it("should not show warning icon when absence has no conflicts", async () => {
      mockGetAbsenceConflict.mockResolvedValue({ conflicts: false });

      render(<AbsenceConflictTooltip absenceId={2} />, {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(
          screen.queryByTestId(Spinner.testIds.spinner),
        ).not.toBeInTheDocument();
      });

      // No warning icon should be present
      const warningIcon = document.querySelector(".text-destructive.size-5");
      expect(warningIcon).not.toBeInTheDocument();
    });
  });

  describe("error state", () => {
    it("should show 'Unknown' when API request fails", async () => {
      mockGetAbsenceConflict.mockRejectedValue(new Error("Network error"));

      render(<AbsenceConflictTooltip absenceId={3} />, {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(
          screen.queryByTestId(Spinner.testIds.spinner),
        ).not.toBeInTheDocument();
      });

      expect(screen.getByTestId(testIds.unknown)).toBeInTheDocument();
    });
  });

  describe("API calls", () => {
    it("should call getAbsenceConflict with correct absenceId", async () => {
      mockGetAbsenceConflict.mockResolvedValue({ conflicts: false });

      render(<AbsenceConflictTooltip absenceId={42} />, {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockGetAbsenceConflict).toHaveBeenCalledWith(42);
      });
    });
  });
});

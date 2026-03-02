import type { FormattedAbsence } from "@/types";
import { TableRow } from ".";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getAbsenceConflict } from "@/services/getAbsenceConflict";
import { ConflictTooltip } from "./ConflictTooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("@/services/getAbsenceConflict", () => ({
  getAbsenceConflict: jest.fn(),
}));

const mockFormattedAbsence: FormattedAbsence = {
  id: 1,
  startDate: "2024-01-01",
  endDate: "2024-01-05",
  type: "Annual Leave",
  approved: true,
  employeeName: "John Doe",
  userId: "123",
  days: 4,
};

const tableRowTestIds = TableRow.testIds;
const conflictTooltipTestIds = ConflictTooltip.testIds;

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

export const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <table>
          <tbody>{children}</tbody>
        </table>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

describe("<TableRow />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(getAbsenceConflict).mockResolvedValue({ conflicts: false });
  });
  it("calls filterAbsenceByUser with correct parameters when employee name is clicked", async () => {
    const user = userEvent.setup();
    const filterAbsenceByUserMock = jest.fn();
    render(
      <Wrapper>
        <TableRow
          absence={mockFormattedAbsence}
          filterAbsenceByUser={filterAbsenceByUserMock}
        />
      </Wrapper>,
    );

    const employeeNameButton = screen.getByTestId(tableRowTestIds.employeeName);

    await user.click(employeeNameButton);

    expect(filterAbsenceByUserMock).toHaveBeenCalledWith(
      mockFormattedAbsence.userId,
      mockFormattedAbsence.employeeName,
    );
  });
  it("displays the correct badge for approved absences", () => {
    const filterAbsenceByUserMock = jest.fn();
    render(
      <Wrapper>
        <TableRow
          absence={mockFormattedAbsence}
          filterAbsenceByUser={filterAbsenceByUserMock}
        />
      </Wrapper>,
    );

    const badge = screen.getByTestId(tableRowTestIds.badge);

    expect(badge).toHaveTextContent("Approved");
    expect(badge).toHaveClass("bg-green-300 text-green-800");
  });
  it("displays the correct badge for pending absences", () => {
    const filterAbsenceByUserMock = jest.fn();

    render(
      <Wrapper>
        <TableRow
          absence={{ ...mockFormattedAbsence, approved: false }}
          filterAbsenceByUser={filterAbsenceByUserMock}
        />
      </Wrapper>,
    );

    const badge = screen.getByTestId(tableRowTestIds.badge);

    expect(badge).toHaveTextContent("Pending");
    expect(badge).toHaveClass("bg-amber-300 text-amber-800");
  });
  it("displays conflict alert when there are conflicts", async () => {
    const filterAbsenceByUserMock = jest.fn();
    jest.mocked(getAbsenceConflict).mockResolvedValue({ conflicts: true });

    render(
      <Wrapper>
        <TableRow
          absence={mockFormattedAbsence}
          filterAbsenceByUser={filterAbsenceByUserMock}
        />
      </Wrapper>,
    );

    const conflictAlert = await screen.findByTestId(
      conflictTooltipTestIds.conflictIcon,
    );

    expect(conflictAlert).toBeInTheDocument();
  });
  it("does not display conflict alert when there are no conflicts", async () => {
    const filterAbsenceByUserMock = jest.fn();

    render(
      <Wrapper>
        <TableRow
          absence={{ ...mockFormattedAbsence }}
          filterAbsenceByUser={filterAbsenceByUserMock}
        />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(getAbsenceConflict).toHaveBeenCalled();
    });

    const conflictAlert = screen.queryByTestId(
      conflictTooltipTestIds.conflictIcon,
    );
    expect(conflictAlert).not.toBeInTheDocument();
  });
});

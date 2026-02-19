import type { FormattedAbsence } from "@/types";
import { TableRow } from ".";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useConflict } from "@/hooks/useConflict";

jest.mock("@/hooks/useConflict", () => ({
  useConflict: jest.fn(),
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

const testIds = TableRow.testIds;

export const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <TooltipProvider>
      <table>
        <tbody>{children}</tbody>
      </table>
    </TooltipProvider>
  );
};

describe("<TableRow />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .mocked(useConflict)
      .mockReturnValue({ conflicts: false, loading: false, error: false });
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

    const employeeNameButton = screen.getByTestId(testIds.employeeName);

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

    const badge = screen.getByTestId(testIds.badge);

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

    const badge = screen.getByTestId(testIds.badge);

    expect(badge).toHaveTextContent("Pending");
    expect(badge).toHaveClass("bg-amber-300 text-amber-800");
  });
  it("displays conflict alert when there are conflicts", () => {
    const filterAbsenceByUserMock = jest.fn();
    jest
      .mocked(useConflict)
      .mockReturnValue({ conflicts: true, loading: false, error: false });

    render(
      <Wrapper>
        <TableRow
          absence={mockFormattedAbsence}
          filterAbsenceByUser={filterAbsenceByUserMock}
        />
      </Wrapper>,
    );

    const conflictAlert = screen.getByTestId(testIds.conflictAlert);

    expect(conflictAlert).toBeInTheDocument();
  });
  it("does not display conflict alert when there are no conflicts", () => {
    const filterAbsenceByUserMock = jest.fn();

    render(
      <Wrapper>
        <TableRow
          absence={{ ...mockFormattedAbsence }}
          filterAbsenceByUser={filterAbsenceByUserMock}
        />
      </Wrapper>,
    );

    const conflictAlert = screen.queryByTestId(testIds.conflictAlert);
    expect(conflictAlert).not.toBeInTheDocument();
  });
});

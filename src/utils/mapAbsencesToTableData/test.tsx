import type { FormattedAbsence } from "@/types";
import { mapAbsencesToTableData } from ".";

// Mock components that have external dependencies
jest.mock("@/components/AbsencesTable/AbsenceConflictTooltip", () => ({
  AbsenceConflictTooltip: () => null,
}));

const mockAbsence: FormattedAbsence = {
  id: 1,
  userId: "user-123",
  employeeName: "John Doe",
  startDate: "2024-01-15T00:00:00.000Z",
  endDate: "2024-01-20T00:00:00.000Z",
  days: 5,
  type: "Annual Leave",
  approved: true,
};

const mockAbsencePending: FormattedAbsence = {
  id: 2,
  userId: "user-456",
  employeeName: "Jane Smith",
  startDate: "2024-02-10T00:00:00.000Z",
  endDate: "2024-02-12T00:00:00.000Z",
  days: 2,
  type: "Sickness",
  approved: false,
};

describe("mapAbsencesToTableData", () => {
  const mockOnFilterByUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("data transformation", () => {
    it("should return empty array when given no absences", () => {
      const result = mapAbsencesToTableData({
        absences: [],
        onFilterByUser: mockOnFilterByUser,
      });

      expect(result).toEqual([]);
    });

    it("should transform absence to correct table data structure", () => {
      const result = mapAbsencesToTableData({
        absences: [mockAbsence],
        onFilterByUser: mockOnFilterByUser,
      });

      expect(result).toHaveLength(1);
      expect(result[0].key).toBe("1");
      expect(result[0].cells).toHaveLength(6);
    });

    it("should include correct cell keys in order", () => {
      const result = mapAbsencesToTableData({
        absences: [mockAbsence],
        onFilterByUser: mockOnFilterByUser,
      });

      const cellKeys = result[0].cells.map((cell) => cell.key);
      expect(cellKeys).toEqual([
        "employeeName",
        "startDate",
        "endDate",
        "days",
        "type",
        "approved",
      ]);
    });

    it("should format dates correctly", () => {
      const result = mapAbsencesToTableData({
        absences: [mockAbsence],
        onFilterByUser: mockOnFilterByUser,
      });

      const startDateCell = result[0].cells.find(
        (cell) => cell.key === "startDate",
      );
      const endDateCell = result[0].cells.find(
        (cell) => cell.key === "endDate",
      );

      expect(startDateCell?.value).toBe("Jan 15, 2024");
      expect(endDateCell?.value).toBe("Jan 20, 2024");
    });

    it("should set days value correctly", () => {
      const result = mapAbsencesToTableData({
        absences: [mockAbsence],
        onFilterByUser: mockOnFilterByUser,
      });

      const daysCell = result[0].cells.find((cell) => cell.key === "days");
      expect(daysCell?.value).toBe(5);
    });

    it("should set type value correctly", () => {
      const result = mapAbsencesToTableData({
        absences: [mockAbsence],
        onFilterByUser: mockOnFilterByUser,
      });

      const typeCell = result[0].cells.find((cell) => cell.key === "type");
      expect(typeCell?.value).toBe("Annual Leave");
    });

    it("should set approved value to 'Approved' when approved is true", () => {
      const result = mapAbsencesToTableData({
        absences: [mockAbsence],
        onFilterByUser: mockOnFilterByUser,
      });

      const approvedCell = result[0].cells.find(
        (cell) => cell.key === "approved",
      );
      expect(approvedCell?.value).toBe("Approved");
    });

    it("should set approved value to 'Pending' when approved is false", () => {
      const result = mapAbsencesToTableData({
        absences: [mockAbsencePending],
        onFilterByUser: mockOnFilterByUser,
      });

      const approvedCell = result[0].cells.find(
        (cell) => cell.key === "approved",
      );
      expect(approvedCell?.value).toBe("Pending");
    });

    it("should transform multiple absences", () => {
      const result = mapAbsencesToTableData({
        absences: [mockAbsence, mockAbsencePending],
        onFilterByUser: mockOnFilterByUser,
      });

      expect(result).toHaveLength(2);
      expect(result[0].key).toBe("1");
      expect(result[1].key).toBe("2");
    });

    it("should set employee name value correctly", () => {
      const result = mapAbsencesToTableData({
        absences: [mockAbsence],
        onFilterByUser: mockOnFilterByUser,
      });

      const employeeCell = result[0].cells.find(
        (cell) => cell.key === "employeeName",
      );
      expect(employeeCell?.value).toBe("John Doe");
    });
  });

  describe("custom cells", () => {
    it("should include customCell for employeeName", () => {
      const result = mapAbsencesToTableData({
        absences: [mockAbsence],
        onFilterByUser: mockOnFilterByUser,
      });

      const employeeCell = result[0].cells.find(
        (cell) => cell.key === "employeeName",
      );
      expect(employeeCell?.customCell).toBeDefined();
    });

    it("should include customCell for approved status", () => {
      const result = mapAbsencesToTableData({
        absences: [mockAbsence],
        onFilterByUser: mockOnFilterByUser,
      });

      const approvedCell = result[0].cells.find(
        (cell) => cell.key === "approved",
      );
      expect(approvedCell?.customCell).toBeDefined();
    });

    it("should not include customCell for date cells", () => {
      const result = mapAbsencesToTableData({
        absences: [mockAbsence],
        onFilterByUser: mockOnFilterByUser,
      });

      const startDateCell = result[0].cells.find(
        (cell) => cell.key === "startDate",
      );
      const endDateCell = result[0].cells.find(
        (cell) => cell.key === "endDate",
      );

      expect(startDateCell?.customCell).toBeUndefined();
      expect(endDateCell?.customCell).toBeUndefined();
    });

    it("should not include customCell for days and type cells", () => {
      const result = mapAbsencesToTableData({
        absences: [mockAbsence],
        onFilterByUser: mockOnFilterByUser,
      });

      const daysCell = result[0].cells.find((cell) => cell.key === "days");
      const typeCell = result[0].cells.find((cell) => cell.key === "type");

      expect(daysCell?.customCell).toBeUndefined();
      expect(typeCell?.customCell).toBeUndefined();
    });
  });
});

import type { FormattedAbsence, AbsenceSortConfig } from "@/types";
import { sortAbsences } from ".";

const mockAbsences: FormattedAbsence[] = [
  {
    id: 1,
    userId: "user-1",
    employeeName: "John Doe",
    startDate: "2024-01-15T00:00:00.000Z",
    endDate: "2024-01-20T00:00:00.000Z",
    days: 5,
    type: "Annual Leave",
    approved: true,
  },
  {
    id: 2,
    userId: "user-2",
    employeeName: "Alice Smith",
    startDate: "2024-02-20T00:00:00.000Z",
    endDate: "2024-02-23T00:00:00.000Z",
    days: 3,
    type: "Sickness",
    approved: false,
  },
  {
    id: 3,
    userId: "user-3",
    employeeName: "Bob Johnson",
    startDate: "2024-01-10T00:00:00.000Z",
    endDate: "2024-01-12T00:00:00.000Z",
    days: 2,
    type: "Medical",
    approved: true,
  },
];

describe("sortAbsences", () => {
  describe("sorting by string fields", () => {
    it("should sort by employeeName ascending", () => {
      const sortConfig: AbsenceSortConfig = {
        key: "employeeName",
        order: "asc",
      };

      const result = sortAbsences(mockAbsences, sortConfig);

      expect(result[0].employeeName).toBe("Alice Smith");
      expect(result[1].employeeName).toBe("Bob Johnson");
      expect(result[2].employeeName).toBe("John Doe");
    });

    it("should sort by employeeName descending", () => {
      const sortConfig: AbsenceSortConfig = {
        key: "employeeName",
        order: "desc",
      };

      const result = sortAbsences(mockAbsences, sortConfig);

      expect(result[0].employeeName).toBe("John Doe");
      expect(result[1].employeeName).toBe("Bob Johnson");
      expect(result[2].employeeName).toBe("Alice Smith");
    });

    it("should sort by startDate ascending", () => {
      const sortConfig: AbsenceSortConfig = { key: "startDate", order: "asc" };

      const result = sortAbsences(mockAbsences, sortConfig);

      expect(result[0].startDate).toBe("2024-01-10T00:00:00.000Z");
      expect(result[1].startDate).toBe("2024-01-15T00:00:00.000Z");
      expect(result[2].startDate).toBe("2024-02-20T00:00:00.000Z");
    });

    it("should sort by startDate descending", () => {
      const sortConfig: AbsenceSortConfig = { key: "startDate", order: "desc" };

      const result = sortAbsences(mockAbsences, sortConfig);

      expect(result[0].startDate).toBe("2024-02-20T00:00:00.000Z");
      expect(result[1].startDate).toBe("2024-01-15T00:00:00.000Z");
      expect(result[2].startDate).toBe("2024-01-10T00:00:00.000Z");
    });
  });

  describe("sorting by numeric fields", () => {
    it("should sort by days ascending", () => {
      const sortConfig: AbsenceSortConfig = { key: "days", order: "asc" };

      const result = sortAbsences(mockAbsences, sortConfig);

      expect(result[0].days).toBe(2);
      expect(result[1].days).toBe(3);
      expect(result[2].days).toBe(5);
    });

    it("should sort by days descending", () => {
      const sortConfig: AbsenceSortConfig = { key: "days", order: "desc" };

      const result = sortAbsences(mockAbsences, sortConfig);

      expect(result[0].days).toBe(5);
      expect(result[1].days).toBe(3);
      expect(result[2].days).toBe(2);
    });

    it("should sort by id ascending", () => {
      const sortConfig: AbsenceSortConfig = { key: "id", order: "asc" };

      const result = sortAbsences(mockAbsences, sortConfig);

      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
      expect(result[2].id).toBe(3);
    });
  });

  describe("sorting by boolean fields", () => {
    it("should sort by approved ascending (false first)", () => {
      const sortConfig: AbsenceSortConfig = { key: "approved", order: "asc" };

      const result = sortAbsences(mockAbsences, sortConfig);

      expect(result[0].approved).toBe(false);
      expect(result[1].approved).toBe(true);
      expect(result[2].approved).toBe(true);
    });

    it("should sort by approved descending (true first)", () => {
      const sortConfig: AbsenceSortConfig = { key: "approved", order: "desc" };

      const result = sortAbsences(mockAbsences, sortConfig);

      expect(result[0].approved).toBe(true);
      expect(result[result.length - 1].approved).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should return empty array when given empty array", () => {
      const sortConfig: AbsenceSortConfig = {
        key: "employeeName",
        order: "asc",
      };

      const result = sortAbsences([], sortConfig);

      expect(result).toEqual([]);
    });

    it("should return single item array unchanged", () => {
      const sortConfig: AbsenceSortConfig = {
        key: "employeeName",
        order: "asc",
      };
      const singleAbsence = [mockAbsences[0]];

      const result = sortAbsences(singleAbsence, sortConfig);

      expect(result).toEqual(singleAbsence);
    });

    it("should not mutate the original array", () => {
      const sortConfig: AbsenceSortConfig = {
        key: "employeeName",
        order: "asc",
      };
      const originalOrder = [...mockAbsences];

      sortAbsences(mockAbsences, sortConfig);

      expect(mockAbsences).toEqual(originalOrder);
    });

    it("should handle items with equal values", () => {
      const absencesWithEqualDays: FormattedAbsence[] = [
        { ...mockAbsences[0], days: 5 },
        { ...mockAbsences[1], days: 5 },
        { ...mockAbsences[2], days: 5 },
      ];
      const sortConfig: AbsenceSortConfig = { key: "days", order: "asc" };

      const result = sortAbsences(absencesWithEqualDays, sortConfig);

      expect(result.length).toBe(3);
      expect(result.every((a) => a.days === 5)).toBe(true);
    });
  });
});

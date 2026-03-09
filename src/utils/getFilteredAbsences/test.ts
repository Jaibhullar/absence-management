import type { FormattedAbsence } from "@/types";
import { getFilteredAbsences } from "./index";

const mockAbsences: FormattedAbsence[] = [
  {
    id: 1,
    userId: "user-1",
    employeeName: "John Doe",
    startDate: "2024-01-15",
    endDate: "2024-01-20",
    days: 5,
    type: "Annual Leave",
    approved: true,
  },
  {
    id: 2,
    userId: "user-2",
    employeeName: "Jane Smith",
    startDate: "2024-02-20",
    endDate: "2024-02-23",
    days: 3,
    type: "Sickness",
    approved: false,
  },
  {
    id: 3,
    userId: "user-1",
    employeeName: "John Doe",
    startDate: "2024-01-10",
    endDate: "2024-01-12",
    days: 2,
    type: "Medical",
    approved: true,
  },
  {
    id: 4,
    userId: "user-3",
    employeeName: "Alice Johnson",
    startDate: "2024-03-01",
    endDate: "2024-03-05",
    days: 4,
    type: "Annual Leave",
    approved: true,
  },
];

describe("getFilteredAbsences", () => {
  describe("when filteredUser is null", () => {
    it("should return all absences", () => {
      const result = getFilteredAbsences(mockAbsences, null);

      expect(result).toEqual(mockAbsences);
      expect(result.length).toBe(4);
    });

    it("should return empty array when absences is empty", () => {
      const result = getFilteredAbsences([], null);

      expect(result).toEqual([]);
    });
  });

  describe("when filteredUser is provided", () => {
    it("should return only absences for the specified user", () => {
      const filteredUser = { id: "user-1", name: "John Doe" };

      const result = getFilteredAbsences(mockAbsences, filteredUser);

      expect(result.length).toBe(2);
      expect(result.every((a) => a.userId === "user-1")).toBe(true);
    });

    it("should return single absence when user has one absence", () => {
      const filteredUser = { id: "user-2", name: "Jane Smith" };

      const result = getFilteredAbsences(mockAbsences, filteredUser);

      expect(result.length).toBe(1);
      expect(result[0].employeeName).toBe("Jane Smith");
      expect(result[0].id).toBe(2);
    });

    it("should return empty array when user has no absences", () => {
      const filteredUser = { id: "non-existent", name: "Unknown User" };

      const result = getFilteredAbsences(mockAbsences, filteredUser);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("edge cases", () => {
    it("should return empty array when filtering empty absences array", () => {
      const filteredUser = { id: "user-1", name: "John Doe" };

      const result = getFilteredAbsences([], filteredUser);

      expect(result).toEqual([]);
    });

    it("should preserve all properties of filtered absences", () => {
      const filteredUser = { id: "user-2", name: "Jane Smith" };

      const result = getFilteredAbsences(mockAbsences, filteredUser);

      expect(result[0]).toEqual({
        id: 2,
        userId: "user-2",
        employeeName: "Jane Smith",
        startDate: "2024-02-20",
        endDate: "2024-02-23",
        days: 3,
        type: "Sickness",
        approved: false,
      });
    });

    it("should not mutate the original absences array", () => {
      const originalLength = mockAbsences.length;
      const filteredUser = { id: "user-1", name: "John Doe" };

      getFilteredAbsences(mockAbsences, filteredUser);

      expect(mockAbsences.length).toBe(originalLength);
    });
  });
});

import { formatDate } from ".";

describe("formatDate", () => {
  describe("valid date formatting", () => {
    it("should format ISO date string to readable format", () => {
      const result = formatDate("2024-01-15T00:00:00.000Z");

      expect(result).toBe("Jan 15, 2024");
    });

    it("should format date in middle of year", () => {
      const result = formatDate("2024-06-20T00:00:00.000Z");

      expect(result).toBe("Jun 20, 2024");
    });

    it("should format date at end of year", () => {
      const result = formatDate("2024-12-31T00:00:00.000Z");

      expect(result).toBe("Dec 31, 2024");
    });

    it("should format date at start of year", () => {
      const result = formatDate("2024-01-01T00:00:00.000Z");

      expect(result).toBe("Jan 1, 2024");
    });
  });

  describe("different months", () => {
    it("should format February date", () => {
      const result = formatDate("2024-02-14T00:00:00.000Z");

      expect(result).toBe("Feb 14, 2024");
    });

    it("should format March date", () => {
      const result = formatDate("2024-03-01T00:00:00.000Z");

      expect(result).toBe("Mar 1, 2024");
    });

    it("should format November date", () => {
      const result = formatDate("2024-11-25T00:00:00.000Z");

      expect(result).toBe("Nov 25, 2024");
    });
  });

  describe("different years", () => {
    it("should format date from 2023", () => {
      const result = formatDate("2023-05-10T00:00:00.000Z");

      expect(result).toBe("May 10, 2023");
    });

    it("should format date from 2025", () => {
      const result = formatDate("2025-08-22T00:00:00.000Z");

      expect(result).toBe("Aug 22, 2025");
    });
  });

  describe("single digit days", () => {
    it("should format single digit day without leading zero", () => {
      const result = formatDate("2024-03-05T00:00:00.000Z");

      expect(result).toBe("Mar 5, 2024");
    });

    it("should format day 9 correctly", () => {
      const result = formatDate("2024-07-09T00:00:00.000Z");

      expect(result).toBe("Jul 9, 2024");
    });
  });

  describe("double digit days", () => {
    it("should format day 10 correctly", () => {
      const result = formatDate("2024-04-10T00:00:00.000Z");

      expect(result).toBe("Apr 10, 2024");
    });

    it("should format day 28 correctly", () => {
      const result = formatDate("2024-02-28T00:00:00.000Z");

      expect(result).toBe("Feb 28, 2024");
    });
  });
});

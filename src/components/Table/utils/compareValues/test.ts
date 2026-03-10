import { compareValues } from ".";

describe("compareValues", () => {
  describe("numeric comparison", () => {
    it("sorts numbers ascending correctly", () => {
      const result = compareValues(10, 20, "asc");
      expect(result).toBeLessThan(0);
    });

    it("sorts numbers descending correctly", () => {
      const result = compareValues(10, 20, "desc");
      expect(result).toBeGreaterThan(0);
    });

    it("returns 0 for equal numbers", () => {
      const result = compareValues(15, 15, "asc");
      expect(result).toBe(0);
    });

    it("handles negative numbers", () => {
      const resultAsc = compareValues(-5, 10, "asc");
      const resultDesc = compareValues(-5, 10, "desc");

      expect(resultAsc).toBeLessThan(0);
      expect(resultDesc).toBeGreaterThan(0);
    });
  });

  describe("string comparison", () => {
    it("sorts strings ascending correctly", () => {
      const result = compareValues("apple", "banana", "asc");
      expect(result).toBeLessThan(0);
    });

    it("sorts strings descending correctly", () => {
      const result = compareValues("apple", "banana", "desc");
      expect(result).toBeGreaterThan(0);
    });

    it("returns 0 for equal strings", () => {
      const result = compareValues("same", "same", "asc");
      expect(result).toBe(0);
    });

    it("handles case-sensitive comparison", () => {
      const result = compareValues("Apple", "apple", "asc");
      expect(result).toBeGreaterThan(0);
    });
  });

  describe("boolean comparison", () => {
    it("converts booleans to strings for comparison", () => {
      const result = compareValues(true, false, "asc");
      expect(result).toBeGreaterThan(0);
    });
  });

  describe("undefined handling", () => {
    it("returns 0 when both values are undefined", () => {
      const result = compareValues(undefined, undefined, "asc");
      expect(result).toBe(0);
    });

    it("pushes undefined to the end when first value is undefined", () => {
      const result = compareValues(undefined, "value", "asc");
      expect(result).toBe(1);
    });

    it("pushes undefined to the end when second value is undefined", () => {
      const result = compareValues("value", undefined, "asc");
      expect(result).toBe(-1);
    });

    it("handles undefined consistently regardless of direction", () => {
      const resultAsc = compareValues(undefined, 10, "asc");
      const resultDesc = compareValues(undefined, 10, "desc");

      expect(resultAsc).toBe(1);
      expect(resultDesc).toBe(1);
    });
  });

  describe("mixed type comparison", () => {
    it("converts number to string when comparing with string", () => {
      const result = compareValues(10, "20", "asc");
      expect(result).toBeLessThan(0);
    });
  });
});

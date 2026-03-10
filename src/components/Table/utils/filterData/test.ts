import { filterData } from ".";
import type { Data, FilterConfig } from "../../types";

const mockData: Data[] = [
  {
    key: "1",
    cells: [
      { key: "name", value: "Alice Smith", displayedValue: "Alice Smith" },
      { key: "age", value: 30, displayedValue: "30 years" },
      { key: "city", value: "New York", displayedValue: "New York" },
    ],
  },
  {
    key: "2",
    cells: [
      { key: "name", value: "Bob Johnson", displayedValue: "Bob Johnson" },
      { key: "age", value: 25, displayedValue: "25 years" },
      { key: "city", value: "Los Angeles", displayedValue: "Los Angeles" },
    ],
  },
  {
    key: "3",
    cells: [
      { key: "name", value: "Charlie Brown", displayedValue: "Charlie Brown" },
      { key: "age", value: 35, displayedValue: "35 years" },
      { key: "city", value: "Chicago", displayedValue: "Chicago" },
    ],
  },
];

describe("filterData", () => {
  describe("empty filter config", () => {
    it("returns all data when filter config is empty", () => {
      const result = filterData(mockData, {});

      expect(result).toEqual(mockData);
      expect(result.length).toBe(3);
    });
  });

  describe("single column filtering", () => {
    it("filters by name column", () => {
      const filterConfig: FilterConfig = { name: "alice" };

      const result = filterData(mockData, filterConfig);

      expect(result.length).toBe(1);
      expect(result[0].key).toBe("1");
    });

    it("filters by city column", () => {
      const filterConfig: FilterConfig = { city: "los" };

      const result = filterData(mockData, filterConfig);

      expect(result.length).toBe(1);
      expect(result[0].key).toBe("2");
    });

    it("is case-insensitive", () => {
      const filterConfig: FilterConfig = { name: "ALICE" };

      const result = filterData(mockData, filterConfig);

      expect(result.length).toBe(1);
      expect(result[0].key).toBe("1");
    });

    it("returns empty array when no matches found", () => {
      const filterConfig: FilterConfig = { name: "xyz" };

      const result = filterData(mockData, filterConfig);

      expect(result.length).toBe(0);
    });
  });

  describe("multiple column filtering", () => {
    it("filters by multiple columns (AND logic)", () => {
      const filterConfig: FilterConfig = { name: "bob", city: "los" };

      const result = filterData(mockData, filterConfig);

      expect(result.length).toBe(1);
      expect(result[0].key).toBe("2");
    });

    it("returns empty when one filter does not match", () => {
      const filterConfig: FilterConfig = { name: "alice", city: "chicago" };

      const result = filterData(mockData, filterConfig);

      expect(result.length).toBe(0);
    });
  });

  describe("displayedValue matching", () => {
    it("matches against displayedValue", () => {
      const filterConfig: FilterConfig = { age: "years" };

      const result = filterData(mockData, filterConfig);

      expect(result.length).toBe(3);
    });

    it("matches numeric displayedValue", () => {
      const filterConfig: FilterConfig = { age: "30" };

      const result = filterData(mockData, filterConfig);

      expect(result.length).toBe(1);
      expect(result[0].key).toBe("1");
    });
  });

  describe("partial matching", () => {
    it("supports partial string matching", () => {
      const filterConfig: FilterConfig = { name: "son" };

      const result = filterData(mockData, filterConfig);

      expect(result.length).toBe(1);
      expect(result[0].key).toBe("2");
    });

    it("matches substring anywhere in value", () => {
      const filterConfig: FilterConfig = { city: "ang" };

      const result = filterData(mockData, filterConfig);

      expect(result.length).toBe(1);
      expect(result[0].key).toBe("2");
    });
  });

  describe("edge cases", () => {
    it("handles empty data array", () => {
      const result = filterData([], { name: "test" });

      expect(result).toEqual([]);
    });

    it("handles non-existent column key in filter", () => {
      const filterConfig: FilterConfig = { nonexistent: "value" };

      const result = filterData(mockData, filterConfig);

      expect(result.length).toBe(0);
    });
  });
});

import { getPaginationValues } from ".";
import type { PaginationConfig } from "../../types";

describe("getPaginationValues", () => {
  describe("when pagination is undefined", () => {
    it("returns default values", () => {
      const result = getPaginationValues(undefined);

      expect(result.mode).toBeUndefined();
      expect(result.format).toBeUndefined();
      expect(result.recordsPerPage).toBe(10);
      expect(result.numberOfPages).toBeUndefined();
      expect(result.enableShowMoreButton).toBeUndefined();
      expect(result.enableNextButton).toBeUndefined();
      expect(result.enablePrevButton).toBeUndefined();
      expect(result.onShowMore).toBeUndefined();
      expect(result.onNextPage).toBeUndefined();
      expect(result.onPrevPage).toBeUndefined();
      expect(result.onPageChange).toBeUndefined();
    });
  });

  describe("frontend pagination", () => {
    it("extracts frontend pagination config correctly", () => {
      const config: PaginationConfig = {
        mode: "frontend",
        format: "page-numbers",
        recordsPerPage: 20,
      };

      const result = getPaginationValues(config);

      expect(result.mode).toBe("frontend");
      expect(result.format).toBe("page-numbers");
      expect(result.recordsPerPage).toBe(20);
    });

    it("uses default recordsPerPage when not provided", () => {
      const config: PaginationConfig = {
        mode: "frontend",
        format: "show-more",
      };

      const result = getPaginationValues(config);

      expect(result.recordsPerPage).toBe(10);
    });

    it("does not include backend-specific values", () => {
      const config: PaginationConfig = {
        mode: "frontend",
        format: "next-prev",
      };

      const result = getPaginationValues(config);

      expect(result.numberOfPages).toBeUndefined();
      expect(result.onShowMore).toBeUndefined();
      expect(result.onNextPage).toBeUndefined();
      expect(result.onPrevPage).toBeUndefined();
      expect(result.onPageChange).toBeUndefined();
    });
  });

  describe("backend pagination - show-more format", () => {
    it("extracts show-more config correctly", () => {
      const onShowMore = jest.fn();
      const config: PaginationConfig = {
        mode: "backend",
        format: "show-more",
        numberOfPages: 5,
        onShowMore,
        enableShowMoreButton: true,
      };

      const result = getPaginationValues(config);

      expect(result.mode).toBe("backend");
      expect(result.format).toBe("show-more");
      expect(result.numberOfPages).toBe(5);
      expect(result.onShowMore).toBe(onShowMore);
      expect(result.enableShowMoreButton).toBe(true);
    });
  });

  describe("backend pagination - next-prev format", () => {
    it("extracts next-prev config correctly", () => {
      const onNextPage = jest.fn();
      const onPrevPage = jest.fn();
      const config: PaginationConfig = {
        mode: "backend",
        format: "next-prev",
        numberOfPages: 10,
        onNextPage,
        onPrevPage,
        enableNextButton: true,
        enablePrevButton: false,
      };

      const result = getPaginationValues(config);

      expect(result.mode).toBe("backend");
      expect(result.format).toBe("next-prev");
      expect(result.numberOfPages).toBe(10);
      expect(result.onNextPage).toBe(onNextPage);
      expect(result.onPrevPage).toBe(onPrevPage);
      expect(result.enableNextButton).toBe(true);
      expect(result.enablePrevButton).toBe(false);
    });
  });

  describe("backend pagination - page-numbers format", () => {
    it("extracts page-numbers config correctly", () => {
      const onPageChange = jest.fn();
      const config: PaginationConfig = {
        mode: "backend",
        format: "page-numbers",
        numberOfPages: 15,
        recordsPerPage: 25,
        onPageChange,
      };

      const result = getPaginationValues(config);

      expect(result.mode).toBe("backend");
      expect(result.format).toBe("page-numbers");
      expect(result.numberOfPages).toBe(15);
      expect(result.recordsPerPage).toBe(25);
      expect(result.onPageChange).toBe(onPageChange);
    });
  });
});

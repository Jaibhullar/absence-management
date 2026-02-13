import { getAbsenceConflict } from "@/services/getAbsenceConflict";
import { useConflict } from ".";
import { renderHook, waitFor } from "@testing-library/react";

jest.mock("@/services/getAbsenceConflict", () => ({
  getAbsenceConflict: jest.fn(),
}));

describe("useConflict", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(getAbsenceConflict).mockResolvedValue({ conflicts: true });
  });
  it("should loading be true initially", async () => {
    const { result } = renderHook(() => useConflict(1));

    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
  it("should set conflicts and loading state correctly on success", async () => {
    const { result } = renderHook(() => useConflict(1));

    await waitFor(() => {
      expect(result.current.conflicts).toBe(true);
      expect(result.current.loading).toBe(false);
    });
  });
  it("should set conflicts to null and loading to false on error", async () => {
    jest.mocked(getAbsenceConflict).mockRejectedValue(new Error());

    const { result } = renderHook(() => useConflict(1));

    await waitFor(() => {
      expect(result.current.conflicts).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });
  it("should set conflicts to false when there are no conflicts", async () => {
    jest.mocked(getAbsenceConflict).mockResolvedValue({ conflicts: false });

    const { result } = renderHook(() => useConflict(1));

    await waitFor(() => {
      expect(result.current.conflicts).toBe(false);
      expect(result.current.loading).toBe(false);
    });
  });
});

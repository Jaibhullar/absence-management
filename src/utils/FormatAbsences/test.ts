import type { Absence, FormattedAbsence } from "@/types";
import { formatAbsences } from ".";

const mockAbsence: Absence = {
  id: 1,
  employee: { id: "123", firstName: "John", lastName: "Doe" },
  startDate: "2024-01-01",
  days: 5,
  absenceType: "ANNUAL_LEAVE",
  approved: true,
};

const mockFormattedAbsence: FormattedAbsence = {
  id: 1,
  userId: "123",
  employeeName: "John Doe",
  startDate: "Jan 1, 2024",
  endDate: "Jan 6, 2024",
  days: 5,
  type: "Annual Leave",
  approved: true,
};

describe("formatAbsences", () => {
  it("should format absences correctly", () => {
    const result = formatAbsences([mockAbsence]);

    expect(result).toEqual([mockFormattedAbsence]);
  });
  it("should return an empty array when given no absences", () => {
    const result = formatAbsences([]);

    expect(result).toEqual([]);
  });
  it("should format different absence types correctly", () => {
    const sicknessAbsence: Absence = {
      ...mockAbsence,
      absenceType: "SICKNESS",
    };

    const annualLeaveAbsence: Absence = {
      ...mockAbsence,
      absenceType: "ANNUAL_LEAVE",
    };

    const medicalAbsence: Absence = { ...mockAbsence, absenceType: "MEDICAL" };

    const result = formatAbsences([
      sicknessAbsence,
      annualLeaveAbsence,
      medicalAbsence,
    ]);

    expect(result[0].type).toBe("Sickness");
    expect(result[1].type).toBe("Annual Leave");
    expect(result[2].type).toBe("Medical");
  });
});

import type { Absence, FormattedAbsence, FormattedAbsenceType } from "@/types";

export const formatAbsences = (absences: Absence[]): FormattedAbsence[] => {
  return absences.map((absence) => {
    const endDate = new Date(absence.startDate);
    endDate.setDate(endDate.getDate() + absence.days - 1);

    const formattedType: FormattedAbsenceType =
      absence.absenceType === "ANNUAL_LEAVE"
        ? "Annual Leave"
        : absence.absenceType === "SICKNESS"
          ? "Sickness"
          : "Medical";

    return {
      id: absence.id,
      employeeName: `${absence.employee.firstName} ${absence.employee.lastName}`,
      startDate: new Date(absence.startDate).toLocaleDateString(),
      endDate: endDate.toLocaleDateString(),
      days: `${absence.days} day${absence.days > 1 ? "s" : ""}`,
      type: formattedType,
      approved: absence.approved,
      conflicts: false, // Placeholder for conflict logic
    };
  });
};

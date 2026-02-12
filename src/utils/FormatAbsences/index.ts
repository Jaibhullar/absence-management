import type { Absence, FormattedAbsence, FormattedAbsenceType } from "@/types";

export const formatAbsences = (absences: Absence[]): FormattedAbsence[] => {
  return absences.map((absence) => {
    const endDate = new Date(absence.startDate);
    endDate.setDate(endDate.getDate() + absence.days);

    const formattedType: FormattedAbsenceType =
      absence.absenceType === "ANNUAL_LEAVE"
        ? "Annual Leave"
        : absence.absenceType === "SICKNESS"
          ? "Sickness"
          : "Medical";

    return {
      id: absence.id,
      userId: absence.employee.id,
      employeeName: `${absence.employee.firstName} ${absence.employee.lastName}`,
      startDate: formatDate(absence.startDate),
      endDate: formatDate(endDate.toISOString()),
      days: absence.days,
      type: formattedType,
      approved: absence.approved,
    };
  });
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

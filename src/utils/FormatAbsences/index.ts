import type {
  Absence,
  AbsenceType,
  FormattedAbsence,
  FormattedAbsenceType,
} from "@/types";

const ABSENCE_TYPE_LABELS: Record<AbsenceType, FormattedAbsenceType> = {
  ANNUAL_LEAVE: "Annual Leave",
  SICKNESS: "Sickness",
  MEDICAL: "Medical",
};

export const formatAbsences = (absences: Absence[]): FormattedAbsence[] => {
  return absences.map((absence) => {
    const endDate = new Date(absence.startDate);
    endDate.setDate(endDate.getDate() + absence.days);

    const formattedType = ABSENCE_TYPE_LABELS[absence.absenceType];

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
  const dateOnly = dateString.split("T")[0];
  const date = new Date(dateOnly + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

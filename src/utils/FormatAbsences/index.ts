import type {
  Absence,
  AbsenceType,
  FormattedAbsence,
  FormattedAbsenceType,
} from "@/types";
import { parseISO, addDays } from "date-fns";

const ABSENCE_TYPE_LABELS: Record<AbsenceType, FormattedAbsenceType> = {
  ANNUAL_LEAVE: "Annual Leave",
  SICKNESS: "Sickness",
  MEDICAL: "Medical",
};

export const formatAbsences = (absences: Absence[]): FormattedAbsence[] => {
  return absences.map((absence) => {
    const endDate = addDays(parseISO(absence.startDate), absence.days);

    const formattedType = ABSENCE_TYPE_LABELS[absence.absenceType];

    return {
      id: absence.id,
      userId: absence.employee.id,
      employeeName: `${absence.employee.firstName} ${absence.employee.lastName}`,
      startDate: absence.startDate,
      endDate: endDate.toISOString(),
      days: absence.days,
      type: formattedType,
      approved: absence.approved,
    };
  });
};

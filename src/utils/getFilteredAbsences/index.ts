import type { FormattedAbsence } from "@/types";

export const getFilteredAbsences = (
  absences: FormattedAbsence[],
  filteredUser: { name: string; id: string } | null,
) => {
  if (!filteredUser) {
    return absences;
  }

  return absences.filter((a) => !filteredUser || a.userId === filteredUser.id);
};

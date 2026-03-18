import type { FilteredUser, FormattedAbsence } from "@/types";

export const getFilteredAbsences = (
  absences: FormattedAbsence[],
  filteredUser: FilteredUser | null,
) => {
  if (!filteredUser) {
    return absences;
  }

  return absences.filter((a) => a.userId === filteredUser.id);
};

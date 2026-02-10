export type AbsenceConflictResponse = {
  conflicts: boolean;
};

export const getAbsenceConflict = async (
  absenceId: number,
): Promise<AbsenceConflictResponse> => {
  const url = `${import.meta.env.VITE_API_KEY}conflict/${absenceId}`;

  const res = await fetch(url);

  const data = await res.json();

  return data;
};

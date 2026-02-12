export type AbsenceConflictResponse = {
  conflicts: boolean;
};

export const getAbsenceConflict = async (
  absenceId: number,
): Promise<AbsenceConflictResponse> => {
  const url = `${import.meta.env.VITE_API_URL}conflict/${absenceId}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();

  return data;
};

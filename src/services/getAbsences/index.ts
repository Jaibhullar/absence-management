import type { Absence } from "@/types";

export type getAbsencesResponse = Absence[];

export const getAbsences = async (): Promise<getAbsencesResponse> => {
  const url = `${import.meta.env.VITE_API_KEY}absences`;

  const res = await fetch(url);

  const data = await res.json();

  return data as getAbsencesResponse;
};

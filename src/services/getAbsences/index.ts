import type { Absence } from "@/types";

export type getAbsencesResponse = Absence[];

export const getAbsences = async (): Promise<getAbsencesResponse> => {
  const url = `${import.meta.env.VITE_API_URL}absences`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();

  return data as getAbsencesResponse;
};

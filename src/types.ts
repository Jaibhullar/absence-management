export type Absence = {
  id: number;
  startDate: string;
  days: number;
  absenceType: AbsenceType;
  approved: boolean;
  employee: Employee;
};

export type Employee = {
  firstName: string;
  id: string;
  lastName: string;
};

export type AbsenceType = "ANNUAL_LEAVE" | "SICKNESS" | "MEDICAL";

export type FormattedAbsence = {
  id: number;
  userId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  days: number;
  type: FormattedAbsenceType;
  approved: boolean;
};

export type FormattedAbsenceType = "Annual Leave" | "Sickness" | "Medical";

import { CalendarIcon } from "lucide-react";
import { Container } from "../Container";

export const Header = () => {
  return (
    <div className="py-4">
      <Container className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-primary w-fit">
          <CalendarIcon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Absence Management</h1>
          <p className="text-muted-foreground text-sm">
            Track and manage employee absences
          </p>
        </div>
      </Container>
    </div>
  );
};

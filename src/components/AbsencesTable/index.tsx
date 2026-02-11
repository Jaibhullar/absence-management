import { TableTitle } from "./TableTitle";
import { TableContent } from "./TableContent";

export const AbsencesTable = () => {
  return (
    <section className="flex flex-col max-h-[calc(100vh-200px)] overflow-hidden px-4 py-6 rounded-md space-y-6">
      <div className="shrink-0">
        <TableTitle />
      </div>
      <div className="flex-1 min-h-0 overflow-auto border rounded-md">
        <TableContent />
      </div>
    </section>
  );
};

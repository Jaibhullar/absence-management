import type { SortKey } from "@/hooks/useAbsencesTable";
import { SortAscIcon } from "lucide-react";

type SortableCellProps = {
  sortBy: () => void;
  text: string;
};

const SortableCell = ({ sortBy, text }: SortableCellProps) => {
  return (
    <th className="py-3">
      <button
        className="mx-auto flex items-center gap-2 justify-center cursor-pointer"
        onClick={sortBy}
      >
        <span>{text}</span>
        <SortAscIcon className="size-4"></SortAscIcon>
      </button>
    </th>
  );
};

export type TableHeaderProps = {
  sortBy: (key: SortKey) => void;
};

export const TableHeader = ({ sortBy }: TableHeaderProps) => {
  return (
    <thead className="sticky top-0 z-10 bg-white">
      <tr className="border-b">
        <SortableCell
          sortBy={() => {
            sortBy("employeeName");
          }}
          text="Employee"
        />
        <SortableCell
          sortBy={() => {
            sortBy("startDate");
          }}
          text="Start Date"
        />
        <SortableCell
          sortBy={() => {
            sortBy("endDate");
          }}
          text="End Date"
        />
        <SortableCell
          sortBy={() => {
            sortBy("days");
          }}
          text="Days"
        />
        <SortableCell
          sortBy={() => {
            sortBy("type");
          }}
          text="Type"
        />
        <th className="py-3">
          <span>Status</span>
        </th>
        <th className="py-3">Conflicts</th>
      </tr>
    </thead>
  );
};

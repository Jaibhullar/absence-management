import type {
  AbsenceSortDirection,
  AbsenceSortKey,
} from "@/hooks/useSortTable";
import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon } from "lucide-react";

type SortableCellProps = {
  sortAbsencesBy: () => void;
  text: string;
  absenceSortDirection?: AbsenceSortDirection;
};

const SortIcon = ({
  absenceSortDirection,
}: {
  absenceSortDirection?: AbsenceSortDirection;
}) => {
  if (!absenceSortDirection)
    return <ArrowUpDown className="h-4 w-4"></ArrowUpDown>;
  if (absenceSortDirection === "asc")
    return <ArrowUpIcon className="h-4 w-4" />;
  return <ArrowDownIcon className="h-4 w-4" />;
};

const SortableCell = ({
  sortAbsencesBy,
  text,
  absenceSortDirection,
}: SortableCellProps) => {
  return (
    <th className="py-3">
      <button
        className="mx-auto flex items-center gap-2 justify-center cursor-pointer"
        onClick={sortAbsencesBy}
      >
        <span>{text}</span>
        <SortIcon absenceSortDirection={absenceSortDirection}></SortIcon>
      </button>
    </th>
  );
};

export type TableHeaderProps = {
  sortAbsencesBy: (key: AbsenceSortKey) => void;
  absenceSortKey: AbsenceSortKey | null;
  absenceSortDirection: AbsenceSortDirection;
};

export const TableHeader = ({
  sortAbsencesBy,
  absenceSortKey,
  absenceSortDirection,
}: TableHeaderProps) => {
  return (
    <thead className="sticky top-0 z-10 bg-white">
      <tr className="border-b">
        <SortableCell
          sortAbsencesBy={() => sortAbsencesBy("employeeName")}
          text="Employee"
          absenceSortDirection={
            absenceSortKey === "employeeName" ? absenceSortDirection : undefined
          }
        />
        <SortableCell
          sortAbsencesBy={() => sortAbsencesBy("startDate")}
          text="Start Date"
          absenceSortDirection={
            absenceSortKey === "startDate" ? absenceSortDirection : undefined
          }
        />
        <SortableCell
          sortAbsencesBy={() => sortAbsencesBy("endDate")}
          text="End Date"
          absenceSortDirection={
            absenceSortKey === "endDate" ? absenceSortDirection : undefined
          }
        />
        <SortableCell
          sortAbsencesBy={() => sortAbsencesBy("days")}
          text="Days"
          absenceSortDirection={
            absenceSortKey === "days" ? absenceSortDirection : undefined
          }
        />
        <SortableCell
          sortAbsencesBy={() => sortAbsencesBy("type")}
          text="Type"
          absenceSortDirection={
            absenceSortKey === "type" ? absenceSortDirection : undefined
          }
        />
        <th className="py-3">
          <span>Status</span>
        </th>
        <th className="py-3">Conflicts</th>
      </tr>
    </thead>
  );
};

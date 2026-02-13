import type { SortKey } from "@/hooks/useSortTable";
import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon } from "lucide-react";

type SortableCellProps = {
  sortBy: () => void;
  text: string;
  direction?: "asc" | "desc";
};

const SortIcon = ({ direction }: { direction?: "asc" | "desc" }) => {
  if (!direction) return <ArrowUpDown className="h-4 w-4"></ArrowUpDown>;
  if (direction === "asc") return <ArrowUpIcon className="h-4 w-4" />;
  return <ArrowDownIcon className="h-4 w-4" />;
};

const SortableCell = ({ sortBy, text, direction }: SortableCellProps) => {
  return (
    <th className="py-3">
      <button
        className="mx-auto flex items-center gap-2 justify-center cursor-pointer"
        onClick={sortBy}
      >
        <span>{text}</span>
        <SortIcon direction={direction}></SortIcon>
      </button>
    </th>
  );
};

export type TableHeaderProps = {
  sortBy: (key: SortKey) => void;
  sortKey: SortKey | null;
  sortDirection: "asc" | "desc";
};

export const TableHeader = ({
  sortBy,
  sortKey,
  sortDirection,
}: TableHeaderProps) => {
  return (
    <thead className="sticky top-0 z-10 bg-white">
      <tr className="border-b">
        <SortableCell
          sortBy={() => sortBy("employeeName")}
          text="Employee"
          direction={sortKey === "employeeName" ? sortDirection : undefined}
        />
        <SortableCell
          sortBy={() => sortBy("startDate")}
          text="Start Date"
          direction={sortKey === "startDate" ? sortDirection : undefined}
        />
        <SortableCell
          sortBy={() => sortBy("endDate")}
          text="End Date"
          direction={sortKey === "endDate" ? sortDirection : undefined}
        />
        <SortableCell
          sortBy={() => sortBy("days")}
          text="Days"
          direction={sortKey === "days" ? sortDirection : undefined}
        />
        <SortableCell
          sortBy={() => sortBy("type")}
          text="Type"
          direction={sortKey === "type" ? sortDirection : undefined}
        />
        <th className="py-3">
          <span>Status</span>
        </th>
        <th className="py-3">Conflicts</th>
      </tr>
    </thead>
  );
};

"use client";

import type { FormattedAbsence } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { AlertTriangle } from "lucide-react";

export const columns: ColumnDef<FormattedAbsence>[] = [
  {
    accessorKey: "employeeName",
    header: "Employee",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
  },
  {
    accessorKey: "endDate",
    header: "End Date",
  },
  {
    accessorKey: "days",
    header: "Duration",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "approved",
    header: "Status",
    cell: ({ row }) => {
      const approved = row.original.approved;
      return (
        <Badge variant={approved ? "default" : "destructive"}>
          {approved ? "Approved" : "Pending"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "conflicts",
    header: "Conflicts",
    cell: ({ row }) => {
      const conflicts = row.original.conflicts;
      if (!conflicts)
        return (
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-destructive w-5 h-5"></AlertTriangle>
            <span className="text-destructive text-sm">Conflict</span>
          </div>
        );
    },
  },
];

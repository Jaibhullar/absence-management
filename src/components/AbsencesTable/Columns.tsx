"use client";

import type { FormattedAbsence } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { AlertTriangle, ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { parseDate } from "@/utils/parseDate";

export const columns: ColumnDef<FormattedAbsence>[] = [
  {
    accessorKey: "employeeName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Employee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    sortingFn: (rowA, rowB) => {
      return (
        parseDate(rowA.original.startDate) - parseDate(rowB.original.startDate)
      );
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          End Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    sortingFn: (rowA, rowB) => {
      return (
        parseDate(rowA.original.startDate) - parseDate(rowB.original.startDate)
      );
    },
  },
  {
    accessorKey: "days",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Duration
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const days = row.original.days;
      return (
        <span>
          {days} {days > 1 ? "days" : "day"}
        </span>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "approved",
    header: "Status",
    cell: ({ row }) => {
      const approved = row.original.approved;
      return (
        <Badge variant={approved ? "success" : "warning"}>
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
      if (conflicts)
        return (
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-destructive w-5 h-5"></AlertTriangle>
            <span className="text-destructive text-sm">Conflict</span>
          </div>
        );
    },
  },
];

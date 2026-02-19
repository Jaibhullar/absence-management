import { TableRow } from "./TableRow";
import { TableHeader } from "./TableHeader";
import type { FormattedAbsence } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  AbsenceSortDirection,
  AbsenceSortKey,
} from "@/hooks/useSortTable";

const testIds = {
  tableSkeleton: "table-skeleton",
  errorMessage: "error-message",
  noResultsMessage: "no-results-message",
};

export type TableContentProps = {
  absences: FormattedAbsence[];
  absencesLoading: boolean;
  absencesError: string | null;
  filterAbsencesByUser: (userId: string, name: string) => void;
  sortAbsencesBy: (key: AbsenceSortKey) => void;
  absenceSortKey: AbsenceSortKey | null;
  absenceSortDirection: AbsenceSortDirection;
};

export const TableContent = ({
  absences,
  absencesLoading,
  absencesError,
  filterAbsencesByUser,
  sortAbsencesBy,
  absenceSortKey,
  absenceSortDirection,
}: TableContentProps) => {
  if (absencesLoading) {
    return <TableSkeleton />;
  }
  if (absencesError) {
    return (
      <div
        className="text-destructive text-center"
        data-testid={testIds.errorMessage}
      >
        {absencesError}
      </div>
    );
  }

  return (
    <table className="w-full border-collapse min-w-225 border-spacing-0">
      <TableHeader
        sortAbsencesBy={sortAbsencesBy}
        absenceSortKey={absenceSortKey}
        absenceSortDirection={absenceSortDirection}
      />
      <tbody>
        {absences.length === 0 ? (
          <tr>
            <td colSpan={7}>
              <p
                className="my-6 text-center text-muted-foreground text-sm"
                data-testid={testIds.noResultsMessage}
              >
                No results to show
              </p>
            </td>
          </tr>
        ) : (
          absences.map((absence) => {
            return (
              <TableRow
                key={absence.id}
                absence={absence}
                filterAbsenceByUser={filterAbsencesByUser}
              />
            );
          })
        )}
      </tbody>
    </table>
  );
};

const TableSkeleton = () => {
  const numOfRows = 20;
  const numOfCols = 7;

  const rows = Array.from({ length: numOfRows }, (_, i) => i);
  const cols = Array.from({ length: numOfCols }, (_, i) => i);

  return (
    <table
      className="w-full border-collapse min-w-225 border-spacing-0"
      data-testid={testIds.tableSkeleton}
    >
      <thead>
        <tr>
          {cols.map((_, colIndex) => {
            return (
              <th key={`header-col-${colIndex}`} className="py-3">
                <Skeleton className="w-24 h-8 mx-auto"></Skeleton>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {rows.map((_, rowIndex) => {
          return (
            <tr key={`row-${rowIndex}`}>
              {cols.map((_, colIndex) => {
                return (
                  <td
                    className="py-5 border-t border-b"
                    key={`row-${rowIndex}-col-${colIndex}`}
                  >
                    <Skeleton className="w-30 h-7 mx-auto"></Skeleton>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

TableContent.testIds = testIds;

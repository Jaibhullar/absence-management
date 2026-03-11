import { Skeleton } from "@/components/ui/Skeleton";

const testIds = {
  tableSkeleton: "table-skeleton",
  tableSkeletonCol: "table-skeleton-col",
  tableSkeletonRow: "table-skeleton-row",
  tableSkeletonCell: "table-skeleton-cell",
};

type TableSkeletonProps = {
  cols: number;
  rows: number;
  headerHeight?: number;
  rowHeight?: number;
};

export const TableSkeleton = ({
  cols,
  rows,
  headerHeight = 32,
  rowHeight = 28,
}: TableSkeletonProps) => {
  const rowArray = Array.from({ length: rows }, (_, i) => i);
  const colArray = Array.from({ length: cols }, (_, i) => i);

  return (
    <div
      className="w-full min-w-225"
      data-testid={testIds.tableSkeleton}
      role="status"
      aria-busy="true"
      aria-label="Loading table"
    >
      {/* Header row */}
      <div className="flex">
        {colArray.map((_, colIndex) => (
          <div
            key={`header-col-${colIndex}`}
            className="flex-1 py-3"
            data-testid={testIds.tableSkeletonCol}
          >
            <Skeleton className="mx-6" style={{ height: headerHeight }} />
          </div>
        ))}
      </div>

      {/* Body rows */}
      {rowArray.map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="flex border-t border-b"
          data-testid={testIds.tableSkeletonRow}
        >
          {colArray.map((_, colIndex) => (
            <div
              className="flex-1 py-5"
              key={`row-${rowIndex}-col-${colIndex}`}
              data-testid={testIds.tableSkeletonCell}
            >
              <Skeleton className="mx-4" style={{ height: rowHeight }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

TableSkeleton.testIds = testIds;

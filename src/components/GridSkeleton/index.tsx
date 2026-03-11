import { Skeleton } from "@/components/ui/Skeleton";

const testIds = {
  gridSkeleton: "grid-skeleton",
  gridSkeletonCol: "grid-skeleton-col",
  gridSkeletonRow: "grid-skeleton-row",
  gridSkeletonCell: "grid-skeleton-cell",
};

type GridSkeletonProps = {
  cols: number;
  rows: number;
  headerHeight?: number;
  rowHeight?: number;
};

export const GridSkeleton = ({
  cols,
  rows,
  headerHeight = 32,
  rowHeight = 28,
}: GridSkeletonProps) => {
  const rowArray = Array.from({ length: rows }, (_, i) => i);
  const colArray = Array.from({ length: cols }, (_, i) => i);

  return (
    <div
      className="w-full min-w-225"
      data-testid={testIds.gridSkeleton}
      role="status"
      aria-busy="true"
      aria-label="Loading grid"
    >
      {/* Header row */}
      <div className="flex">
        {colArray.map((_, colIndex) => (
          <div
            key={`header-col-${colIndex}`}
            className="flex-1 py-3"
            data-testid={testIds.gridSkeletonCol}
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
          data-testid={testIds.gridSkeletonRow}
        >
          {colArray.map((_, colIndex) => (
            <div
              className="flex-1 py-5"
              key={`row-${rowIndex}-col-${colIndex}`}
              data-testid={testIds.gridSkeletonCell}
            >
              <Skeleton className="mx-4" style={{ height: rowHeight }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

GridSkeleton.testIds = testIds;

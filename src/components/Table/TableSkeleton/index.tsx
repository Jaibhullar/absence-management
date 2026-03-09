import { Skeleton } from "@/components/Skeleton";

const testIds = {
  tableSkeleton: "table-skeleton",
  tableSkeletonCol: "table-skeleton-col",
};

type TableSkeletonProps = {
  cols: number;
  rows: number;
};

export const TableSkeleton = ({ cols, rows }: TableSkeletonProps) => {
  const rowArray = Array.from({ length: rows }, (_, i) => i);
  const colArray = Array.from({ length: cols }, (_, i) => i);

  return (
    <table
      className="w-full border-collapse min-w-225 border-spacing-0"
      data-testid={testIds.tableSkeleton}
      aria-label="Loading table"
    >
      <thead>
        <tr>
          {colArray.map((_, colIndex) => {
            return (
              <th
                key={`header-col-${colIndex}`}
                className="py-3"
                data-testid={testIds.tableSkeletonCol}
              >
                <Skeleton
                  className={`w-[calc(100%/${cols})] h-8 mx-6`}
                ></Skeleton>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {rowArray.map((_, rowIndex) => {
          return (
            <tr key={`row-${rowIndex}`}>
              {colArray.map((_, colIndex) => {
                return (
                  <td
                    className="py-5 border-t border-b"
                    key={`row-${rowIndex}-col-${colIndex}`}
                  >
                    <Skeleton
                      className={`w-[calc(100%/${cols})] h-7 mx-4`}
                    ></Skeleton>
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

TableSkeleton.testIds = testIds;

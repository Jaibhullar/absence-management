import { Button } from "@/components/Button";
import { ArrowLeftIcon } from "lucide-react";

export type FilteringByUserBannerProps = {
  filteredUser: {
    name: string;
    id: string;
  };
  clearFilterAbsencesByUser: () => void;
};

const testIds = {
  clearFiltersButton: "clear-filters-button",
};

export const FilteringByUserBanner = ({
  filteredUser,
  clearFilterAbsencesByUser,
}: FilteringByUserBannerProps) => {
  return (
    <div className="relative bg-secondary text-secondary-foreground rounded-md p-3 text-sm">
      <p className="text-center">
        Showing absences for
        <span className="font-bold text-primary ml-1">{filteredUser.name}</span>
      </p>
      <Button
        variant={"outline"}
        size={"icon-sm"}
        className="cursor-pointer absolute top-1/2 -translate-y-1/2 left-2"
        onClick={clearFilterAbsencesByUser}
        aria-label="Clear filter"
        data-testid={testIds.clearFiltersButton}
      >
        <ArrowLeftIcon className="size-4"></ArrowLeftIcon>
      </Button>
    </div>
  );
};

FilteringByUserBanner.testIds = testIds;

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export type FilteringByUserBannerProps = {
  filteredUser: string;
  clearFilter: () => void;
};

const testIds = {
  clearFiltersButton: "clear-filters-button",
};

export const FilteringByUserBanner = ({
  filteredUser,
  clearFilter,
}: FilteringByUserBannerProps) => {
  return (
    <div className="flex items-center justify-between bg-secondary text-secondary-foreground rounded-md p-2 text-sm">
      <p>
        Showing absences for{" "}
        <span className="font-bold text-primary">{filteredUser}</span>
      </p>
      <Button
        variant={"outline"}
        size={"icon-sm"}
        className="cursor-pointer"
        onClick={clearFilter}
        data-testid={testIds.clearFiltersButton}
      >
        <X></X>
      </Button>
    </div>
  );
};

FilteringByUserBanner.testIds = testIds;

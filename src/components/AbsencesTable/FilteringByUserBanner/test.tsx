import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { FilteringByUserBanner } from ".";

const testIds = FilteringByUserBanner.testIds;

describe("FilteringByUserBanner", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("calls clearFilter when the button is clicked", async () => {
    const user = userEvent.setup();
    const mockClearFilter = jest.fn();

    render(
      <FilteringByUserBanner
        filteredUser={{
          name: "John Doe",
          id: "1",
        }}
        clearFilter={mockClearFilter}
      />,
    );

    const clearFiltersButton = screen.getByTestId(testIds.clearFiltersButton);

    expect(clearFiltersButton).toBeInTheDocument();

    await user.click(clearFiltersButton);

    expect(mockClearFilter).toHaveBeenCalled();
  });
});

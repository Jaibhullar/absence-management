type CellValue = string | number | boolean | undefined;

export const compareValues = (
  aValue: CellValue,
  bValue: CellValue,
  direction: "asc" | "desc",
): number => {
  // Handle undefined values - push them to the end
  if (aValue === undefined && bValue === undefined) return 0;
  if (aValue === undefined) return 1;
  if (bValue === undefined) return -1;

  // Numeric comparison
  if (typeof aValue === "number" && typeof bValue === "number") {
    return direction === "asc" ? aValue - bValue : bValue - aValue;
  }

  // String comparison (convert booleans and other types to strings)
  const aString = aValue.toString();
  const bString = bValue.toString();

  return direction === "asc"
    ? aString.localeCompare(bString)
    : bString.localeCompare(aString);
};

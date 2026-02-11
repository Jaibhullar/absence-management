export const TableHeader = () => {
  return (
    <thead className="sticky top-0 z-10 bg-white">
      <tr className="border-b">
        <th className="py-3">Employee</th>
        <th className="py-3">Start Date</th>
        <th className="py-3">End Date</th>
        <th className="py-3">Type</th>
        <th className="py-3">Status</th>
        <th className="py-3">Conflicts</th>
      </tr>
    </thead>
  );
};

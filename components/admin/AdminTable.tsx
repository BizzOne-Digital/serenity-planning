export interface AdminTableColumn<T> {
  header: string;
  render: (row: T) => React.ReactNode;
}

export default function AdminTable<T extends { _id: string }>({
  columns,
  rows,
  emptyLabel = "No records found.",
  onRowClick,
}: {
  columns: AdminTableColumn<T>[];
  rows: T[];
  emptyLabel?: string;
  onRowClick?: (row: T) => void;
}) {
  if (rows.length === 0) {
    return <p className="rounded-card border border-ink/10 bg-white p-8 text-center text-sm text-ink/50">{emptyLabel}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-card border border-ink/10 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-ink/10 bg-cream/50">
          <tr>
            {columns.map((col) => (
              <th key={col.header} className="px-4 py-3 font-medium text-ink/60">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/5">
          {rows.map((row) => (
            <tr
              key={row._id}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? "cursor-pointer hover:bg-cream/40" : ""}
            >
              {columns.map((col) => (
                <td key={col.header} className="px-4 py-3 align-top text-ink/80">
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

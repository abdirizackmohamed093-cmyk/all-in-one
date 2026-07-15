"use client";

import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  getRowId: (row: T) => string;
  actions?: (row: T) => ReactNode;
}

export default function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyMessage = "No records found.",
  getRowId,
  actions,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-charcoal/60">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-charcoal/50 border border-dashed border-neutral-200 rounded">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-neutral-200 rounded-md">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50">
            {columns.map((col, i) => (
              <th
                key={i}
                className={`text-left px-4 py-3 font-semibold text-charcoal/70 uppercase tracking-wide text-xs ${col.className ?? ""}`}
              >
                {col.header}
              </th>
            ))}
            {actions && (
              <th className="text-right px-4 py-3 font-semibold text-charcoal/70 uppercase tracking-wide text-xs">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={getRowId(row)}
              className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors"
            >
              {columns.map((col, i) => (
                <td key={i} className={`px-4 py-3 text-charcoal ${col.className ?? ""}`}>
                  {typeof col.accessor === "function"
                    ? col.accessor(row)
                    : String(row[col.accessor] ?? "")}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">{actions(row)}</div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
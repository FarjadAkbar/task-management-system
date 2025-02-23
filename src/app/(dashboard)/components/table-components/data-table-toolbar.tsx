"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { IFilterConfig } from "@/types/filter";



interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filters: IFilterConfig[];
}
export function DataTableToolbar<TData>({
  table,
  filters,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
      {filters.map(({ name, label, options, isInput }) => {
          const column = table.getColumn(name);
          if (!column) return null; // Ensure column exists before rendering

          return isInput ? (
            <Input
              key={name}
              placeholder={`Search ${name}...`}
              value={(column.getFilterValue() as string) ?? ""}
              onChange={(event) => column.setFilterValue(event.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
            />
          ) : (
            <DataTableFacetedFilter
              key={name}
              column={column}
              title={label}
              options={options || []}
            />
          );
        })}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}

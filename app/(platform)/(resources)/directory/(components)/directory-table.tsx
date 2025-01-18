"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  ChevronUp,
  CircleAlert,
  CircleX,
  Ellipsis,
  ListFilter,
  Plus,
  Trash,
  Building2,
  CarFront,
  Wrench,
  ShoppingCart,
  Wallet,
  Calculator,
  Truck,
  HelpCircle,
} from "lucide-react";
import { useId, useRef, useState, useMemo, useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { EditForm } from "./edit-form";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  PaginationState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type DirectoryItem = Doc<"directory">;

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<DirectoryItem> = (
  row,
  columnId,
  filterValue
) => {
  const searchableRowContent =
    `${row.original.name} ${row.original.email} ${row.original.department}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const departmentIcons = {
  Management: Building2,
  Sales: CarFront,
  Service: Wrench,
  Parts: ShoppingCart,
  Finance: Wallet,
  Accounting: Calculator,
  Logistics: Truck,
  Other: HelpCircle,
} as const;

function PhoneCell({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex items-center">
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <span
            onClick={handleCopy}
            className="cursor-pointer hover:text-purple-500 transition-colors"
          >
            {value}
            {copied && (
              <span className="ml-2 text-xs text-emerald-500">Copied!</span>
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent className="text-xs">Click to copy</TooltipContent>
      </Tooltip>
    </div>
  );
}

function EmailCell({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex items-center">
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <span
            onClick={handleCopy}
            className="cursor-pointer hover:text-purple-500 transition-colors"
          >
            {value}
            {copied && (
              <span className="ml-2 text-xs text-emerald-500">Copied!</span>
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent className="text-xs">Click to copy</TooltipContent>
      </Tooltip>
    </div>
  );
}

const columns: ColumnDef<DirectoryItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
    size: 180,
    filterFn: multiColumnFilterFn,
    enableHiding: false,
    enableSorting: true,
  },
  {
    header: "Position",
    accessorKey: "position",
    size: 180,
    enableSorting: true,
  },
  {
    header: "Department",
    accessorKey: "department",
    cell: ({ row }) => {
      const department = row.getValue(
        "department"
      ) as keyof typeof departmentIcons;
      const Icon = departmentIcons[department] || HelpCircle;
      return (
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-muted-foreground" />
          <span>{department}</span>
        </div>
      );
    },
    size: 150,
    enableSorting: true,
  },
  {
    header: "Extension",
    accessorKey: "extension",
    size: 100,
    enableSorting: false,
  },
  {
    header: "Phone",
    accessorKey: "number",
    cell: ({ row }) => <PhoneCell value={row.getValue("number")} />,
    size: 150,
    enableSorting: false,
  },
  {
    header: "Email",
    accessorKey: "email",
    cell: ({ row }) => <EmailCell value={row.getValue("email")} />,
    size: 220,
    enableSorting: false,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 60,
    enableSorting: false,
    enableHiding: false,
  },
];

export default function DirectoryTable() {
  const id = useId();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 100,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [isAddingContact, setIsAddingContact] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "department",
      desc: false,
    },
    {
      id: "name",
      desc: false,
    },
  ]);

  // Fetch data from Convex
  const rawData = useQuery(api.directory.getAll);
  const data = useMemo(() => rawData ?? [], [rawData]);

  // Get unique departments
  const departments = useMemo(() => {
    const uniqueDepartments = new Set(data.map((item) => item.department));
    return Array.from(uniqueDepartments).sort();
  }, [data]);

  const deleteMany = useMutation(api.directory.deleteMany);

  const handleDeleteRows = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const ids = selectedRows.map((row) => row.original._id);
    await deleteMany({ ids });
    table.resetRowSelection();
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  });

  // Update table filters when department is selected
  useEffect(() => {
    if (selectedDepartment) {
      table.getColumn("department")?.setFilterValue(selectedDepartment);
    } else {
      table.getColumn("department")?.setFilterValue(undefined);
    }
  }, [selectedDepartment, table]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Filter by name or department */}
          <div className="relative">
            <Input
              id={`${id}-input`}
              ref={inputRef}
              className={cn(
                "peer min-w-64 ps-9",
                Boolean(table.getColumn("name")?.getFilterValue()) && "pe-9"
              )}
              value={
                (table.getColumn("name")?.getFilterValue() ?? "") as string
              }
              onChange={(e) =>
                table.getColumn("name")?.setFilterValue(e.target.value)
              }
              placeholder="Filter by name or department..."
              type="text"
              aria-label="Filter by name or department"
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
              <ListFilter size={16} strokeWidth={2} aria-hidden="true" />
            </div>
            {Boolean(table.getColumn("name")?.getFilterValue()) && (
              <button
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear filter"
                onClick={() => {
                  table.getColumn("name")?.setFilterValue("");
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }}
              >
                <CircleX size={16} strokeWidth={2} aria-hidden="true" />
              </button>
            )}
          </div>
          {/* Department filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                {selectedDepartment ? (
                  <>
                    {React.createElement(
                      departmentIcons[
                        selectedDepartment as keyof typeof departmentIcons
                      ] || HelpCircle,
                      {
                        size: 16,
                        className: "text-blue-500",
                      }
                    )}
                    {selectedDepartment}
                  </>
                ) : (
                  <>
                    <Building2 className="h-4 w-4 opacity-50" />
                    All Departments
                  </>
                )}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter by Department</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSelectedDepartment(null)}>
                <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>All Departments</span>
              </DropdownMenuItem>
              {departments.map((dept) => {
                const Icon =
                  departmentIcons[dept as keyof typeof departmentIcons] ||
                  HelpCircle;
                return (
                  <DropdownMenuItem
                    key={dept}
                    onClick={() => setSelectedDepartment(dept)}
                  >
                    <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{dept}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-3">
          {/* Delete button */}
          {table.getSelectedRowModel().rows.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="ml-auto" variant="outline">
                  <Trash
                    className="-ms-1 me-2 opacity-60"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  Delete
                  <span className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                    {table.getSelectedRowModel().rows.length}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
                    aria-hidden="true"
                  >
                    <CircleAlert
                      className="opacity-80"
                      size={16}
                      strokeWidth={2}
                    />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete{" "}
                      {table.getSelectedRowModel().rows.length} selected{" "}
                      {table.getSelectedRowModel().rows.length === 1
                        ? "row"
                        : "rows"}
                      .
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteRows}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {/* Add user button */}
          <Button
            className="ml-auto"
            variant="outline"
            onClick={() => setIsAddingContact(true)}
          >
            <Plus
              className="-ms-1 me-2 opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className="h-11"
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              "flex h-full cursor-pointer select-none items-center justify-between gap-2"
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            // Enhanced keyboard handling for sorting
                            if (
                              header.column.getCanSort() &&
                              (e.key === "Enter" || e.key === " ")
                            ) {
                              e.preventDefault();
                              header.column.getToggleSortingHandler()?.(e);
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: (
                              <ChevronUp
                                className="shrink-0 opacity-60"
                                size={16}
                                strokeWidth={2}
                                aria-hidden="true"
                              />
                            ),
                            desc: (
                              <ChevronDown
                                className="shrink-0 opacity-60"
                                size={16}
                                strokeWidth={2}
                                aria-hidden="true"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="last:py-0">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Page number information */}
      <div className="flex grow justify-end whitespace-nowrap text-sm text-muted-foreground">
        <p
          className="whitespace-nowrap text-sm text-muted-foreground"
          aria-live="polite"
        >
          <span className="text-foreground">
            Showing {table.getRowCount().toString()}
          </span>{" "}
          of{" "}
          <span className="text-foreground">
            {table.getRowCount().toString()} contacts
          </span>
        </p>
      </div>

      {/* Add Contact Form */}
      <EditForm
        isOpen={isAddingContact}
        onClose={() => setIsAddingContact(false)}
      />
    </div>
  );
}

function RowActions({ row }: { row: Row<DirectoryItem> }) {
  const [isEditing, setIsEditing] = useState(false);
  const deleteOne = useMutation(api.directory.deleteOne);

  const handleDelete = async () => {
    await deleteOne({ id: row.original._id });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end">
            <Button
              size="icon"
              variant="ghost"
              className="shadow-none"
              aria-label="Edit item"
            >
              <Ellipsis size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <span>Edit {row.original.name}</span>
              <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={handleDelete}
          >
            <span>Delete</span>
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditForm
        contact={row.original}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
      />
    </>
  );
}

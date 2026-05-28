'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  SlidersHorizontal,
  Download,
  Columns3,
  MoreHorizontal,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  filterColumns?: { key: string; label: string; options: { label: string; value: string }[] }[]
  onExport?: () => void
  onRowClick?: (row: TData) => void
  showRowSelection?: boolean
  pageSize?: number
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search...',
  filterColumns = [],
  onExport,
  onRowClick,
  showRowSelection = false,
  pageSize = 10,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState('')

  // Add selection column if needed
  const tableColumns = React.useMemo(() => {
    if (showRowSelection) {
      return [
        {
          id: 'select',
          header: ({ table }: { table: ReturnType<typeof useReactTable<TData>> }) => (
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
            />
          ),
          cell: ({ row }: { row: { getIsSelected: () => boolean; toggleSelected: (value: boolean) => void } }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          ),
          enableSorting: false,
          enableHiding: false,
        } as ColumnDef<TData, TValue>,
        ...columns,
      ]
    }
    return columns
  }, [columns, showRowSelection])

  const table = useReactTable({
    data,
    columns: tableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  })

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchKey ? (table.getColumn(searchKey)?.getFilterValue() as string) ?? '' : globalFilter}
              onChange={(e) =>
                searchKey
                  ? table.getColumn(searchKey)?.setFilterValue(e.target.value)
                  : setGlobalFilter(e.target.value)
              }
              className="pl-9"
            />
          </div>

          {/* Filters */}
          {filterColumns.map((filter) => (
            <Select
              key={filter.key}
              value={(table.getColumn(filter.key)?.getFilterValue() as string) ?? ''}
              onValueChange={(value) =>
                table.getColumn(filter.key)?.setFilterValue(value === 'all' ? '' : value)
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {filter.label}</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Columns3 className="h-4 w-4" />
                <span className="hidden sm:inline">Columns</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id.replace(/_/g, ' ')}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export */}
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport} className="gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          )}
        </div>
      </div>

      {/* Selection Info */}
      {showRowSelection && Object.keys(rowSelection).length > 0 && (
        <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2">
          <Check className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">
            {Object.keys(rowSelection).length} row(s) selected
          </span>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border bg-muted/50">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            'flex items-center gap-2',
                            header.column.getCanSort() && 'cursor-pointer select-none hover:text-foreground'
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <>
                              {header.column.getIsSorted() === 'asc' ? (
                                <ArrowUp className="h-3.5 w-3.5" />
                              ) : header.column.getIsSorted() === 'desc' ? (
                                <ArrowDown className="h-3.5 w-3.5" />
                              ) : (
                                <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    className={cn(
                      'border-b border-border last:border-0 transition-colors',
                      row.getIsSelected() && 'bg-primary/5',
                      onRowClick && 'cursor-pointer hover:bg-muted/50'
                    )}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={tableColumns.length} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <p className="text-sm">No results found</p>
                      <p className="text-xs mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          of {table.getFilteredRowModel().rows.length} entries
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 50, 100].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-sm">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper components for common column patterns
export function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    active: 'bg-success/10 text-success border-success/20',
    inactive: 'bg-muted text-muted-foreground border-muted-foreground/20',
    pending: 'bg-warning/10 text-warning border-warning/20',
    paid: 'bg-success/10 text-success border-success/20',
    overdue: 'bg-destructive/10 text-destructive border-destructive/20',
    approved: 'bg-success/10 text-success border-success/20',
    rejected: 'bg-destructive/10 text-destructive border-destructive/20',
    completed: 'bg-success/10 text-success border-success/20',
    scheduled: 'bg-primary/10 text-primary border-primary/20',
    'on-leave': 'bg-warning/10 text-warning border-warning/20',
    maintenance: 'bg-warning/10 text-warning border-warning/20',
    issued: 'bg-primary/10 text-primary border-primary/20',
    returned: 'bg-success/10 text-success border-success/20',
    late: 'bg-warning/10 text-warning border-warning/20',
    present: 'bg-success/10 text-success border-success/20',
    absent: 'bg-destructive/10 text-destructive border-destructive/20',
    online: 'bg-success/10 text-success border-success/20',
    offline: 'bg-muted text-muted-foreground border-muted-foreground/20',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize',
        variants[status] || variants.inactive
      )}
    >
      {status.replace(/-/g, ' ')}
    </span>
  )
}

export function ActionMenu({
  actions,
}: {
  actions: { label: string; onClick: () => void; destructive?: boolean }[]
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={(e) => {
              e.stopPropagation()
              action.onClick()
            }}
            className={cn(action.destructive && 'text-destructive focus:text-destructive')}
          >
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

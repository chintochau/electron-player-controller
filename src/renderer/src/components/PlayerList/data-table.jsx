import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel
} from '@tanstack/react-table'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Grid2X2, List, Loader2, MinusCircleIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Input } from '../../../../components/ui/input'
import { Button } from '../../../../components/ui/button'
import { ScrollArea, ScrollBar } from '../../../../components/ui/scroll-area'
import { cn } from '../../lib/utils'
import { useTable } from '../../context/tableContext'

export function DataTable({ columns, data, isCollapsed }) {
  const [sorting, setSorting] = useState([])
  const [globalFilter, setGlobalFilter] = useState([])
  const [searchString, setSearchString] = useState('')
  const [columnVisibility, setColumnVisibility] = useState({
    ip: false,
    version: false
  })
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      globalFilter,
      columnVisibility
    },
    onGlobalFilterChange: setGlobalFilter
  })

  const { isGridMode, setIsGridMode } = useTable()

  useEffect(() => {
    table.getAllColumns().map((column) => {
      switch (column.id) {
        case 'ip':
        case 'version':
          column.toggleVisibility(false)
          break
        case 'compact':
          column.toggleVisibility(isCollapsed)
          break
        default:
          column.toggleVisibility(!isCollapsed)
          break
      }
    })
  }, [isCollapsed, isGridMode])

  return (
    <>
      <div className="flex items-center justify-between py-4">
        <Input
          onChange={(e) => {
            setSearchString(e.target.value)
            table.setGlobalFilter(String(e.target.value))
          }}
          placeholder="Search device..."
          className="max-w-sm rounded-full"
        />

        {!isCollapsed && (
          <div className="flex">
            {!isGridMode && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto rounded-full">
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => {
                      return !['ip', 'version', 'compact'].includes(column.id)
                    })
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) => column.toggleVisibility(!!value)}
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      )
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button variant="outline" size="icon" className="rounded-xl ml-2">
              {!isGridMode ? (
                <Grid2X2 onClick={() => setIsGridMode(!isGridMode)} className="w-6 h-6" />
              ) : (
                <List onClick={() => setIsGridMode(!isGridMode)} className="w-6 h-6" />
              )}
            </Button>
          </div>
        )}
      </div>
      {(isCollapsed || !isGridMode) && (
        <div className="overflow-hidden rounded-xl border border-accent ">
          <div
            className={cn(
              'h-fit overflow-y-auto relative pb-4',
              isCollapsed ? 'max-h-[calc(100vh-145px)]' : 'max-h-[calc(100vh-270px)]'
            )}
          >
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="text-center">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      <p>Searching devices {searchString ? `matching '${searchString}'` : ''}</p>
                      <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  )
}

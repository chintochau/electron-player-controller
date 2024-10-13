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
import { Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Input } from '../../../../components/ui/input'
import { Button } from '../../../../components/ui/button'

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

  useEffect(() => {
    table.getAllColumns().map((column) => {
      switch (column.id) {
        case 'ip':
        case 'version':
          column.toggleVisibility(false)
          break
        case 'select':
          column.toggleVisibility(true)
          break
        case 'compact':
          column.toggleVisibility(isCollapsed)
          break
        default:
          column.toggleVisibility(!isCollapsed)
          break
      }
    })
  }, [isCollapsed])

  return (
    <>
      <div className="flex items-center py-4">
        <Input
          onChange={(e) => {
            setSearchString(e.target.value)
            table.setGlobalFilter(String(e.target.value))
          }}
          placeholder="Search device..."
          className="max-w-sm"
        />

        {!isCollapsed && <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
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
    </>
  )
}

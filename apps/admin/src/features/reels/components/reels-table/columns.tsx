'use client'

import { ExternalLink, Link2 } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header'
import { getActivities } from '@repo/actions/activities.actions'

import { CellAction } from './reel-cell-action'
import VideoPreview from './video-preview'

import type { Column, ColumnDef } from '@tanstack/react-table'
import type { TReelBase } from '@repo/db/schema/reels'
export type TReelRow = TReelBase & {
  activity?: { id: number; name: string } | null
}

export const columns: ColumnDef<TReelRow>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        // @ts-ignore
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'videoUrl',
    accessorKey: 'videoUrl',
    header: ({ column }: { column: Column<TReelRow, unknown> }) => <DataTableColumnHeader column={column} title='Video' />,
    cell: ({ row }) => {
      const url = row.getValue('videoUrl') as string
      const title = row.getValue('title') as string
      return <VideoPreview videoUrl={url} title={title} />
    },
    enableSorting: false,
  },

  {
    id: 'title',
    accessorKey: 'title',
    header: ({ column }: { column: Column<TReelRow, unknown> }) => <DataTableColumnHeader column={column} title='Title' />,
    cell: ({ row }) => {
      const value = row.getValue('title') as string
      return (
        <div className='font-medium max-w-[200px] truncate' title={value}>
          {value}
        </div>
      )
    },
    enableColumnFilter: true,
    meta: {
      label: 'Title',
      placeholder: 'Search title...',
      variant: 'text',
    },
    enableSorting: false,
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: ({ column }: { column: Column<TReelRow, unknown> }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => {
      const value = row.getValue('description') as string
      return (
        <div className='font-medium max-w-[200px] truncate' title={value}>
          {value}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    id: 'redirectUrl',
    accessorKey: 'redirectUrl',
    header: ({ column }: { column: Column<TReelRow, unknown> }) => (
      <DataTableColumnHeader column={column} title='Redirect URL' />
    ),
    cell: ({ row }) => {
      const value = row.getValue('redirectUrl') as string
      return (
        <div className='flex items-center gap-2'>
          <div className='font-medium max-w-[260px] truncate' title={value}>
            {value}
          </div>
          <Link target='_blank' href={value || '#'}>
            <Button size='icon' variant='ghost'>
              <ExternalLink />
            </Button>
          </Link>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }: { column: Column<TReelRow, unknown> }) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return <Badge variant={status === 'active' ? 'default' : 'secondary'}>{status}</Badge>
    },
    enableColumnFilter: true,
    enableSorting: false,
    meta: {
      placeholder: 'Status',
      variant: 'select',
      label: 'Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
  },
  {
    id: 'actions',
    enableHiding: false,

    cell: ({ row }) => <CellAction data={row.original} />,
  },
]

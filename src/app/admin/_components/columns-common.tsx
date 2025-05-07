
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown, CheckCircle, XCircle, AlertTriangle, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export const createSelectColumn = <TData,>(): ColumnDef<TData> => ({
  id: 'select',
  header: ({ table }) => (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && 'indeterminate')
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
  enableSorting: false,
  enableHiding: false,
});

export const createStatusColumn = <TData,>(accessorKey: keyof TData, title: string = "Status"): ColumnDef<TData> => ({
  accessorKey: accessorKey as string,
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }) => {
    const status = String(row.getValue(accessorKey as string)).toLowerCase();
    let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
    let Icon = AlertTriangle;

    if (status.includes('active') || status.includes('paid') || status.includes('delivered') || status.includes('approved') || status.includes('published') || status.includes('completed') || status.includes('resultuploaded')) {
      variant = 'default'; // Greenish, implies success via theme
      Icon = CheckCircle;
    } else if (status.includes('pending') || status.includes('processing') || status.includes('shipped') || status.includes('submitted') || status.includes('draft') || status.includes('scheduled') || status.includes('inprogress') || status.includes('samplecollected')) {
      variant = 'secondary'; // Bluish/Grayish, implies in-progress via theme
      Icon = AlertTriangle; // Could be Hourglass or similar
    } else if (status.includes('suspended') || status.includes('cancelled') || status.includes('rejected') || status.includes('expired') || status.includes('inactive') || status.includes('out_of_stock')) {
      variant = 'destructive';
      Icon = XCircle;
    } else if (status.includes('low_stock') || status.includes('near_expiry')) {
        variant = 'outline'; // Yellowish/Orangeish, implies warning via theme (default outline is neutral, custom theme can change this)
        Icon = AlertTriangle;
    }
    

    return (
      <Badge variant={variant} className="capitalize flex items-center gap-1">
        <Icon className="h-3.5 w-3.5" />
        {status.replace(/_/g, ' ')}
      </Badge>
    );
  },
});


interface ActionItem {
  label: string;
  icon: React.ElementType;
  href?: string; // For navigation
  onClick?: () => void; // For other actions
  isDestructive?: boolean;
}

interface ActionsColumnOptions<TData> {
  viewHref?: (id: string) => string;
  editHref?: (id: string) => string;
  onDelete?: (id: string) => void;
  customActions?: (item: TData) => ActionItem[];
}

export const createActionsColumn = <TData extends { id: string }>(
  options: ActionsColumnOptions<TData>
): ColumnDef<TData> => ({
  id: 'actions',
  enableHiding: false,
  cell: ({ row }) => {
    const item = row.original;
    const baseActions: ActionItem[] = [];

    if (options.viewHref) {
      baseActions.push({ label: 'View', icon: Eye, href: options.viewHref(item.id) });
    }
    if (options.editHref) {
      baseActions.push({ label: 'Edit', icon: Edit, href: options.editHref(item.id) });
    }
    
    const allActions = options.customActions ? [...baseActions, ...options.customActions(item)] : baseActions;

    if (options.onDelete) {
        allActions.push({ label: 'Delete', icon: Trash2, onClick: () => options.onDelete?.(item.id), isDestructive: true });
    }


    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {allActions.map((action, index) => (
            <DropdownMenuItem
              key={index}
              onClick={action.href ? undefined : action.onClick}
              className={action.isDestructive ? "text-destructive focus:text-destructive focus:bg-destructive/10" : ""}
              asChild={!!action.href}
            >
              {action.href ? (
                <Link href={action.href} className="flex items-center w-full">
                   <action.icon className="mr-2 h-4 w-4" />
                   {action.label}
                </Link>
              ) : (
                <>
                  <action.icon className="mr-2 h-4 w-4" />
                  {action.label}
                </>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
});

export const createGenericColumn = <TData,>(accessorKey: keyof TData, title: string, enableSorting: boolean = true): ColumnDef<TData> => ({
    accessorKey: accessorKey as string,
    header: ({ column }) => {
      if (!enableSorting) return title;
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {title}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue(accessorKey as string);
      if (typeof value === 'boolean') {
        return value ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />;
      }
      if (typeof value === 'number' && (title.toLowerCase().includes('price') || title.toLowerCase().includes('amount'))) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ETB' }).format(value);
      }
      return <div className="capitalize">{String(value)}</div>;
    },
});

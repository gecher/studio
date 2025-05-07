
'use client';

import *ాలు
import { ColumnDef } from '@tanstack/react-table';
import { ShieldAlert, CheckCircle, XCircle, CalendarDays, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/app/admin/_components/data-table';
import AdminHeader from '@/app/admin/_components/admin-header';
import { mockSecurityLogs } from '@/app/admin/_lib/mock-data';
import type { SecurityLog } from '@/app/admin/_types';
import { 
  createSelectColumn, 
  createGenericColumn
} from '@/app/admin/_components/columns-common';
import { Badge } from '@/components/ui/badge';
import { DatePickerWithRange } from '@/components/ui/date-range-picker'; // Assuming component exists

export default function SecurityLogsPage() {
  const [data, setData] = React.useState<SecurityLog[]>(mockSecurityLogs);
  // TODO: Add state for date range filter
  
  const columns: ColumnDef<SecurityLog>[] = [
    createSelectColumn<SecurityLog>(), // For potential bulk actions like "Archive Selected"
    createGenericColumn<SecurityLog>('id', 'Log ID'),
    {
        accessorKey: 'timestamp',
        header: 'Timestamp',
        cell: ({ row }) => new Date(row.getValue('timestamp')).toLocaleString()
    },
    createGenericColumn<SecurityLog>('actor', 'Actor/User'),
    createGenericColumn<SecurityLog>('action', 'Action'),
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as SecurityLog['status'];
            return status === 'success' ? 
                <Badge variant="default" className="flex items-center gap-1"><CheckCircle className="h-3 w-3"/> Success</Badge> : 
                <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3"/> Failure</Badge>;
        }
    },
    createGenericColumn<SecurityLog>('ipAddress', 'IP Address'),
    {
        accessorKey: 'details',
        header: 'Details',
        cell: ({row}) => <p className="truncate max-w-md">{row.getValue('details') || "N/A"}</p>
    }
    // No typical row actions for logs, but could have "View Full Details" if truncated
  ];

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="System Security Logs"
        breadcrumbs={[{ label: 'System Configuration', href:'/admin/settings/general' }, { label: 'Security Logs' }]}
      />
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-auto">
            {/* Date Range Picker - assuming you have this component */}
            {/* <DatePickerWithRange 
                onDateChange={(range) => console.log("Date range changed:", range)} 
                className="max-w-sm"
            /> */}
            <Button variant="outline" className="w-full md:w-auto">
                <CalendarDays className="mr-2 h-4 w-4"/> Filter by Date Range (Placeholder)
            </Button>
        </div>
         <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export Logs (CSV)
        </Button>
      </div>

      <DataTable 
        columns={columns} 
        data={data}
        searchKey="action" // Search by action description or actor
        searchPlaceholder="Search logs by action or actor..."
      />
    </div>
  );
}

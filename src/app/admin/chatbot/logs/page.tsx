
'use client';

import *ాలు
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link'; // Not strictly needed if no direct links from table
import { FileText, Languages, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button'; // Keep for potential future actions
import { DataTable } from '@/app/admin/_components/data-table';
import AdminHeader from '@/app/admin/_components/admin-header';
import { mockChatbotLogs } from '@/app/admin/_lib/mock-data';
import type { ChatbotLog } from '@/app/admin/_types';
import { 
  createSelectColumn, 
  createActionsColumn, // May not be needed if no row actions
  createGenericColumn
} from '@/app/admin/_components/columns-common';
import { Badge } from '@/components/ui/badge';

export default function ChatbotLogsPage() {
  const [data, setData] = React.useState<ChatbotLog[]>(mockChatbotLogs);
  
  // Usually logs are not deleted, but an archive or export function might be here

  const columns: ColumnDef<ChatbotLog>[] = [
    createSelectColumn<ChatbotLog>(), // Keep for bulk actions if any
    createGenericColumn<ChatbotLog>('id', 'Log ID'),
    {
        accessorKey: 'timestamp',
        header: 'Timestamp',
        cell: ({ row }) => new Date(row.getValue('timestamp')).toLocaleString()
    },
    createGenericColumn<ChatbotLog>('query', 'User Query'),
    {
        accessorKey: 'language',
        header: 'Language',
        cell: ({ row }) => <Badge variant="outline" className="capitalize">{row.getValue('language')}</Badge>
    },
    {
        accessorKey: 'response',
        header: 'Bot Response',
        cell: ({ row }) => <p className="truncate max-w-xs">{row.getValue('response') || <span className="text-muted-foreground italic">N/A</span>}</p>
    },
    {
        accessorKey: 'escalated',
        header: 'Escalated?',
        cell: ({ row }) => row.getValue('escalated') ? 
            <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Yes</Badge> : 
            <Badge variant="default">No</Badge>
    },
    // No typical row actions for logs, but could add "View Full Log" if truncated or "Create Response Rule"
    // createActionsColumn<ChatbotLog>({
    //   // custom actions like "Mark as Reviewed" or "Create rule from this query"
    // }),
  ];

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Chatbot Query Logs"
        breadcrumbs={[{ label: 'Chatbot Management', href:'/admin/chatbot/responses' }, { label: 'Query Logs' }]}
        // No "Add New Log" button, logs are system-generated
      />
      
      {/* TODO: Add filter controls: by date range, language, escalated status */}

      <DataTable 
        columns={columns} 
        data={data}
        searchKey="query"
        searchPlaceholder="Search user queries..."
      />
    </div>
  );
}

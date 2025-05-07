
'use client';

import *ాలు
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { PlusCircle, MessageSquare, Languages } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/app/admin/_components/data-table';
import AdminHeader from '@/app/admin/_components/admin-header';
import { mockChatbotResponses } from '@/app/admin/_lib/mock-data';
import type { ChatbotResponse } from '@/app/admin/_types';
import { 
  createSelectColumn, 
  createActionsColumn,
  createGenericColumn
} from '@/app/admin/_components/columns-common';
import { Badge } from '@/components/ui/badge';

export default function ChatbotResponsesPage() {
  const [data, setData] = React.useState<ChatbotResponse[]>(mockChatbotResponses);
  
  const handleDeleteResponse = (responseId: string) => {
    console.log("Delete response:", responseId);
    setData(prev => prev.filter(res => res.id !== responseId));
  };

  const columns: ColumnDef<ChatbotResponse>[] = [
    createSelectColumn<ChatbotResponse>(),
    createGenericColumn<ChatbotResponse>('id', 'Response ID'),
    createGenericColumn<ChatbotResponse>('queryPattern', 'Query Pattern'),
    {
        accessorKey: 'language',
        header: 'Language',
        cell: ({ row }) => <Badge variant="outline" className="capitalize">{row.getValue('language')}</Badge>
    },
    {
        accessorKey: 'responseEnglish',
        header: 'English Response',
        cell: ({ row }) => <p className="truncate max-w-xs">{row.getValue('responseEnglish')}</p>
    },
    {
        accessorKey: 'responseAmharic',
        header: 'Amharic Response',
        cell: ({ row }) => <p className="truncate max-w-xs">{row.getValue('responseAmharic')}</p>
    },
    createGenericColumn<ChatbotResponse>('lastUpdated', 'Last Updated'),
    createActionsColumn<ChatbotResponse>({
      editHref: (id) => `/admin/chatbot/responses/edit/${id}`,
      onDelete: handleDeleteResponse,
    }),
  ];

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Chatbot Responses Configuration"
        breadcrumbs={[{ label: 'Chatbot Management' }]}
        actionButton={
          <Link href="/admin/chatbot/responses/add" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Response
            </Button>
          </Link>
        }
      />
      
      <DataTable 
        columns={columns} 
        data={data}
        searchKey="queryPattern"
        searchPlaceholder="Search by query pattern..."
      />
    </div>
  );
}

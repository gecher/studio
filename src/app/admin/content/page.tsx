
'use client';

import *ాలు
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { PlusCircle, BookOpenText, Languages, Filter, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/app/admin/_components/data-table';
import AdminHeader from '@/app/admin/_components/admin-header';
import { mockContentItems } from '@/app/admin/_lib/mock-data';
import type { ContentItem } from '@/app/admin/_types';
import { 
  createSelectColumn, 
  createStatusColumn, 
  createActionsColumn,
  createGenericColumn
} from '@/app/admin/_components/columns-common';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export default function ContentManagementPage() {
  const [data, setData] = React.useState<ContentItem[]>(mockContentItems);
  const [typeFilter, setTypeFilter] = React.useState<string | undefined>();
  const [languageFilter, setLanguageFilter] = React.useState<string | undefined>();


  const handleDeleteContent = (contentId: string) => {
    console.log("Delete content:", contentId);
    setData(prev => prev.filter(item => item.id !== contentId));
  };

  const filteredData = React.useMemo(() => {
    return data.filter(item => {
        const typeMatch = typeFilter ? item.type === typeFilter : true;
        const langMatch = languageFilter ? item.language === languageFilter || item.language === 'both' : true;
        return typeMatch && langMatch;
    });
  }, [data, typeFilter, languageFilter]);

  const columns: ColumnDef<ContentItem>[] = [
    createSelectColumn<ContentItem>(),
    createGenericColumn<ContentItem>('id', 'Content ID'),
    createGenericColumn<ContentItem>('title', 'Title'),
    createGenericColumn<ContentItem>('type', 'Type'),
    createGenericColumn<ContentItem>('category', 'Category'),
    {
        accessorKey: 'language',
        header: 'Language',
        cell: ({ row }) => {
            const lang = row.getValue('language') as ContentItem['language'];
            return <Badge variant="secondary" className="capitalize">{lang}</Badge>
        }
    },
    createStatusColumn<ContentItem>('status', 'Status'),
    createGenericColumn<ContentItem>('publishDate', 'Publish Date'),
    createGenericColumn<ContentItem>('author', 'Author'),
    createActionsColumn<ContentItem>({
      viewHref: (id) => `/health-hub/${id}`, // Link to public view if possible, or admin detail view
      editHref: (id) => `/admin/content/edit/${id}`,
      onDelete: handleDeleteContent,
      customActions: (item) => [
        { label: 'Preview', icon: Eye, href: `/health-hub/${item.id}?preview=true`, }, // Example preview link
      ]
    }),
  ];

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Content Management (Health Hub)"
        actionButton={
          <Link href="/admin/content/add" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Content
            </Button>
          </Link>
        }
      />
      
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Type: {typeFilter || "All"}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={!typeFilter} onCheckedChange={() => setTypeFilter(undefined)}>All</DropdownMenuCheckboxItem>
            {['article', 'video', 'faq'].map(type => (
              <DropdownMenuCheckboxItem key={type} checked={typeFilter === type} onCheckedChange={() => setTypeFilter(type)}>{type.charAt(0).toUpperCase() + type.slice(1)}</DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline"><Languages className="mr-2 h-4 w-4" /> Language: {languageFilter || "All"}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filter by Language</DropdownMenuLabel>
            <DropdownMenuSeparator />
             <DropdownMenuCheckboxItem checked={!languageFilter} onCheckedChange={() => setLanguageFilter(undefined)}>All</DropdownMenuCheckboxItem>
            {['english', 'amharic', 'both'].map(lang => (
              <DropdownMenuCheckboxItem key={lang} checked={languageFilter === lang} onCheckedChange={() => setLanguageFilter(lang)}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredData}
        searchKey="title"
        searchPlaceholder="Search by title or category..."
      />
    </div>
  );
}

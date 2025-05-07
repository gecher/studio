
'use client';

import *ాలు
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { PlusCircle, Building } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/app/admin/_components/data-table';
import AdminHeader from '@/app/admin/_components/admin-header';
import { mockInsuranceProviders } from '@/app/admin/_lib/mock-data';
import type { InsuranceProvider } from '@/app/admin/_types';
import { 
  createSelectColumn, 
  createStatusColumn, 
  createActionsColumn,
  createGenericColumn
} from '@/app/admin/_components/columns-common';

export default function ManageProvidersPage() {
  const [data, setData] = React.useState<InsuranceProvider[]>(mockInsuranceProviders);
  
  const handleDeleteProvider = (providerId: string) => {
    console.log("Delete provider:", providerId);
    setData(prev => prev.filter(provider => provider.id !== providerId));
  };

  const columns: ColumnDef<InsuranceProvider>[] = [
    createSelectColumn<InsuranceProvider>(),
    createGenericColumn<InsuranceProvider>('id', 'Provider ID'),
    createGenericColumn<InsuranceProvider>('name', 'Provider Name'),
    createGenericColumn<InsuranceProvider>('contactEmail', 'Contact Email'),
    createGenericColumn<InsuranceProvider>('apiEndpoint', 'API Endpoint'),
    createStatusColumn<InsuranceProvider>('status', 'Status'),
    createActionsColumn<InsuranceProvider>({
      viewHref: (id) => `/admin/insurance/providers/${id}`,
      editHref: (id) => `/admin/insurance/providers/edit/${id}`,
      onDelete: handleDeleteProvider,
    }),
  ];

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Manage Insurance Providers"
        breadcrumbs={[{ label: 'Insurance Management', href: '/admin/insurance/claims' }, { label: 'Providers' }]}
        actionButton={
          <Link href="/admin/insurance/providers/add" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Provider
            </Button>
          </Link>
        }
      />
      
      <DataTable 
        columns={columns} 
        data={data}
        searchKey="name"
        searchPlaceholder="Search by provider name..."
      />
    </div>
  );
}


'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { PlusCircle, UserCheck, Activity } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/app/admin/_components/data-table';
import AdminHeader from '@/app/admin/_components/admin-header';
import { mockLabPartners } from '@/app/admin/_lib/mock-data';
import type { LabPartner } from '@/app/admin/_types';
import { 
  createSelectColumn, 
  createStatusColumn, 
  createActionsColumn,
  createGenericColumn
} from '@/app/admin/_components/columns-common';

export default function ManageLabsPage() {
  const [data, setData] = React.useState<LabPartner[]>(mockLabPartners);
  
  const handleDeleteLab = (labId: string) => {
    console.log("Delete lab:", labId);
    setData(prev => prev.filter(lab => lab.id !== labId));
  };

  const columns: ColumnDef<LabPartner>[] = [
    createSelectColumn<LabPartner>(),
    createGenericColumn<LabPartner>('id', 'Lab ID'),
    createGenericColumn<LabPartner>('name', 'Lab Name'),
    createGenericColumn<LabPartner>('location', 'Location'),
    createGenericColumn<LabPartner>('contactPerson', 'Contact Person'),
    createGenericColumn<LabPartner>('contactEmail', 'Contact Email'),
    createStatusColumn<LabPartner>('status', 'Status'),
    createActionsColumn<LabPartner>({
      viewHref: (id) => `/admin/diagnostics/labs/${id}`,
      editHref: (id) => `/admin/diagnostics/labs/edit/${id}`,
      onDelete: handleDeleteLab,
       customActions: (lab) => [
        { label: 'View Bookings', icon: Activity, href: `/admin/diagnostics/bookings?labId=${lab.id}` },
      ]
    }),
  ];

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Manage Lab Partnerships"
        breadcrumbs={[{ label: 'Diagnostics', href: '/admin/diagnostics/bookings' }, { label: 'Labs' }]}
        actionButton={
          <Link href="/admin/diagnostics/labs/add" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Lab Partner
            </Button>
          </Link>
        }
      />
      
      <DataTable 
        columns={columns} 
        data={data}
        searchKey="name"
        searchPlaceholder="Search by lab name or location..."
      />
    </div>
  );
}

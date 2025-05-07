
'use client';

import *ాలు
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { PlusCircle, FileText, Upload, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/app/admin/_components/data-table';
import AdminHeader from '@/app/admin/_components/admin-header';
import { mockInsuranceClaims, mockInsuranceProviders } from '@/app/admin/_lib/mock-data';
import type { InsuranceClaim, InsuranceProvider } from '@/app/admin/_types';
import { 
  createSelectColumn, 
  createStatusColumn, 
  createActionsColumn,
  createGenericColumn
} from '@/app/admin/_components/columns-common';

export default function ManageClaimsPage() {
  const [data, setData] = React.useState<InsuranceClaim[]>(mockInsuranceClaims);
  const [providers, setProviders] = React.useState<InsuranceProvider[]>(mockInsuranceProviders);
  
  const columns: ColumnDef<InsuranceClaim>[] = [
    createSelectColumn<InsuranceClaim>(),
    createGenericColumn<InsuranceClaim>('id', 'Claim ID'),
    createGenericColumn<InsuranceClaim>('policyNumber', 'Policy #'),
    // Add a column for Insurance Provider Name based on PolicyNumber or a direct link if available
    createGenericColumn<InsuranceClaim>('claimAmount', 'Amount (ETB)'),
    createGenericColumn<InsuranceClaim>('submissionDate', 'Submission Date'),
    createGenericColumn<InsuranceClaim>('serviceType', 'Service Type'),
    createStatusColumn<InsuranceClaim>('status', 'Status'),
    createActionsColumn<InsuranceClaim>({
      viewHref: (id) => `/admin/insurance/claims/${id}`, // Detail view
      editHref: (id) => `/admin/insurance/claims/edit/${id}`, // Edit status, add notes
      // No direct delete usually, but can be "Mark as Void" or similar
    }),
  ];

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Manage Insurance Claims"
        breadcrumbs={[{ label: 'Insurance Management' }]} // Main page for insurance
        actionButton={
          <div className="flex gap-2">
            <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" /> Bulk Upload Claims (CSV)
            </Button>
            <Link href="/admin/insurance/claims/add" passHref>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Submit New Claim
              </Button>
            </Link>
          </div>
        }
      />
      
      {/* TODO: Add filter controls: by provider, status, date range */}
      <div className="flex justify-end items-center">
         <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export All (CSV)
        </Button>
      </div>

      <DataTable 
        columns={columns} 
        data={data}
        searchKey="policyNumber"
        searchPlaceholder="Search by Policy # or Claim ID..."
      />
    </div>
  );
}


'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { ShieldCheck, CheckCircle, User, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/app/admin/_components/data-table';
import AdminHeader from '@/app/admin/_components/admin-header';
import { mockInsurancePolicies, mockUsers } from '@/app/admin/_lib/mock-data';
import type { InsurancePolicy, User as Customer } from '@/app/admin/_types';
import { 
  createSelectColumn, 
  createStatusColumn, 
  createActionsColumn,
  createGenericColumn
} from '@/app/admin/_components/columns-common';
import { Input } from '@/components/ui/input';

// Combine policy with user name for display
type DisplayPolicy = InsurancePolicy & { userName?: string };

export default function VerifyPoliciesPage() {
  const [users, setUsers] = React.useState<Customer[]>(mockUsers);
  const [policies, setPolicies] = React.useState<DisplayPolicy[]>(() => 
    mockInsurancePolicies.map(policy => ({
      ...policy,
      userName: users.find(u => u.id === policy.userId)?.name || 'Unknown User',
    }))
  );
  
  // In a real app, verification would be an API call.
  const handleVerifyPolicy = (policyId: string) => {
    setPolicies(prev => prev.map(p => p.id === policyId ? {...p, status: 'active', verificationDate: new Date().toISOString().split('T')[0]} : p));
    console.log("Verify policy:", policyId);
  };

  const columns: ColumnDef<DisplayPolicy>[] = [
    createSelectColumn<DisplayPolicy>(),
    createGenericColumn<DisplayPolicy>('id', 'Policy ID'),
    createGenericColumn<DisplayPolicy>('policyNumber', 'Policy Number'),
    {
        accessorKey: 'userName',
        header: 'User Name',
        cell: ({ row }) => {
            const policy = row.original;
            return policy.userId ? (
                <Link href={`/admin/users/${policy.userId}`} className="text-primary hover:underline">
                    {policy.userName}
                </Link>
            ) : (policy.userName || 'N/A');
        }
    },
    createGenericColumn<DisplayPolicy>('provider', 'Provider'),
    createStatusColumn<DisplayPolicy>('status', 'Status'),
    createGenericColumn<DisplayPolicy>('verificationDate', 'Verification Date'),
    createActionsColumn<DisplayPolicy>({
      // View could link to user profile or a policy detail page if exists
      viewHref: (id) => `/admin/users/${policies.find(p=>p.id===id)?.userId}`, 
      // Edit might be for correcting policy details
      editHref: (id) => `/admin/insurance/policies/edit/${id}`, // Assuming such a page exists
      customActions: (policy) => [
        ...(policy.status === 'pending_verification' ? [{ label: 'Mark as Verified', icon: CheckCircle, onClick: () => handleVerifyPolicy(policy.id) }] : []),
      ]
    }),
  ];

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Verify Insurance Policies"
        breadcrumbs={[{ label: 'Insurance Management', href: '/admin/insurance/claims' }, { label: 'Verify Policies' }]}
        // No "Add New" here as policies are usually linked by users or through bulk import
      />
      
      <div className="flex items-center gap-2">
        <Input placeholder="Search by Policy # or User Name..." className="max-w-sm" />
        <Button variant="outline"><Search className="mr-2 h-4 w-4"/>Search</Button>
        {/* Add filters for Provider, Status */}
      </div>

      <DataTable 
        columns={columns} 
        data={policies}
        searchKey="policyNumber" // Or userName if you adjust filter logic
        searchPlaceholder="Search by Policy # or User Name..."
      />
    </div>
  );
}

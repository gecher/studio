
'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { PlusCircle, Filter, CheckCircle, XCircle as LucideXCircle } from 'lucide-react'; // Renamed to avoid conflict

import { Button } from '@/components/ui/button';
import { DataTable } from '@/app/admin/_components/data-table';
import AdminHeader from '@/app/admin/_components/admin-header';
import { mockUsers } from '@/app/admin/_lib/mock-data';
import type { User } from '@/app/admin/_types';
import { 
  createSelectColumn, 
  createStatusColumn, 
  createActionsColumn,
  createGenericColumn
} from '@/app/admin/_components/columns-common';
import { Badge } from '@/components/ui/badge';
// Dropdown for filters is commented out, can be re-enabled if needed
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';

export default function UserManagementPage() {
  const [data, setData] = React.useState<User[]>(mockUsers);
  // TODO: Add state for filters if needed

  const handleDeleteUser = (userId: string) => {
    if (userId === 'usr_admin_001') { // Prevent deleting mock admin
        alert("Cannot delete the main admin user in this demo.");
        return;
    }
    console.log("Delete user:", userId);
    setData(prev => prev.filter(user => user.id !== userId));
  };
  
  const columns: ColumnDef<User>[] = [
    createSelectColumn<User>(),
    createGenericColumn<User>('id', 'User ID'),
    createGenericColumn<User>('name', 'Name'),
    createGenericColumn<User>('email', 'Email'),
    createGenericColumn<User>('role', 'Role'),
    {
        accessorKey: 'accountType',
        header: 'Acc. Type',
        cell: ({ row }) => {
            const user = row.original;
            if (user.role === 'customer') {
                return <Badge variant={user.accountType === 'easymeds_plus' ? "default" : "secondary"} className="capitalize">{user.accountType.replace('_', ' ')}</Badge>;
            }
            return <span className="text-muted-foreground">-</span>;
        }
    },
    createStatusColumn<User>('status', 'Status'),
    createGenericColumn<User>('insuranceProvider', 'Insurance'),
    createGenericColumn<User>('insurancePolicyNumber', 'Policy #'),
    createGenericColumn<User>('insuranceVerified', 'Ins. Verified'),
    createGenericColumn<User>('dateJoined', 'Date Joined'),
    createGenericColumn<User>('lastLogin', 'Last Login'),
    createActionsColumn<User>({
      viewHref: (id) => `/admin/users/${id}`,
      editHref: (id) => `/admin/users/edit/${id}`,
      onDelete: handleDeleteUser,
       customActions: (user) => [
        ...(user.insuranceProvider && !user.insuranceVerified && user.status !== 'suspended' ? [{ label: 'Verify Insurance', icon: CheckCircle, onClick: () => console.log(`Verify insurance for ${user.id}`) }] : []),
        ...(user.status === 'active' && user.id !== 'usr_admin_001' ? [{ label: 'Suspend User', icon: LucideXCircle, onClick: () => console.log(`Suspend user ${user.id}`), isDestructive: true }] : []),
        ...(user.status === 'suspended' ? [{ label: 'Reactivate User', icon: CheckCircle, onClick: () => console.log(`Reactivate user ${user.id}`) }] : []),
      ]
    }),
  ];

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="User Management"
        actionButton={
          <Link href="/admin/users/add" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New User
            </Button>
          </Link>
        }
      />
      
      <DataTable 
        columns={columns} 
        data={data}
        searchKey="name" 
        searchPlaceholder="Search by name or email..."
      />
    </div>
  );
}

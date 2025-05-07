
'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { PlusCircle, Filter, CheckCircle, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function UserManagementPage() {
  const [data, setData] = React.useState<User[]>(mockUsers);
  // TODO: Add state for filters if needed

  const handleDeleteUser = (userId: string) => {
    // Implement delete logic: API call, then update state
    console.log("Delete user:", userId);
    setData(prev => prev.filter(user => user.id !== userId));
    // Show toast notification
  };
  
  const columns: ColumnDef<User>[] = [
    createSelectColumn<User>(),
    createGenericColumn<User>('id', 'User ID'),
    createGenericColumn<User>('name', 'Name'),
    createGenericColumn<User>('email', 'Email'),
    createGenericColumn<User>('role', 'Role'),
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
      // Add custom actions like 'Verify Insurance', 'Suspend User' here
       customActions: (user) => [
        ...(user.insuranceProvider && !user.insuranceVerified && user.status !== 'suspended' ? [{ label: 'Verify Insurance', icon: CheckCircle, onClick: () => console.log(`Verify insurance for ${user.id}`) }] : []),
        ...(user.status === 'active' ? [{ label: 'Suspend User', icon: XCircle, onClick: () => console.log(`Suspend user ${user.id}`), isDestructive: true }] : []),
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
      
      {/* TODO: Add filter controls here if needed, e.g., by role, status */}
      {/* 
      <div className="flex items-center space-x-2">
         <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filter by Role
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {['admin', 'pharmacist', 'customer', 'doctor'].map(role => (
               <DropdownMenuCheckboxItem key={role} >{role}</DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        // Similar dropdown for status
      </div>
      */}

      <DataTable 
        columns={columns} 
        data={data}
        searchKey="name" // Or "email"
        searchPlaceholder="Search by name or email..."
      />
    </div>
  );
}


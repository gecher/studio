
'use client';

import *ాలు
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { PlusCircle, MapPin, Map } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/app/admin/_components/data-table';
import AdminHeader from '@/app/admin/_components/admin-header';
import { mockLocations } from '@/app/admin/_lib/mock-data';
import type { Location } from '@/app/admin/_types';
import { 
  createSelectColumn, 
  createStatusColumn, 
  createActionsColumn,
  createGenericColumn
} from '@/app/admin/_components/columns-common';
import { Badge } from '@/components/ui/badge';

export default function LocationManagementPage() {
  const [data, setData] = React.useState<Location[]>(mockLocations);
  
  const handleDeleteLocation = (locationId: string) => {
    console.log("Delete location:", locationId);
    setData(prev => prev.filter(loc => loc.id !== locationId));
  };

  const columns: ColumnDef<Location>[] = [
    createSelectColumn<Location>(),
    createGenericColumn<Location>('id', 'Location ID'),
    createGenericColumn<Location>('name', 'Name'),
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => <Badge variant="secondary" className="capitalize">{row.getValue('type')}</Badge>
    },
    createGenericColumn<Location>('address', 'Address'),
    createGenericColumn<Location>('contactNumber', 'Contact #'),
    createStatusColumn<Location>('status', 'Status'),
    {
        accessorKey: 'services',
        header: 'Services',
        cell: ({ row }) => {
            const services = row.getValue('services') as string[] | undefined;
            return services && services.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                    {services.slice(0,2).map(service => <Badge key={service} variant="outline" className="text-xs">{service}</Badge>)}
                    {services.length > 2 && <Badge variant="outline" className="text-xs">+{services.length - 2} more</Badge>}
                </div>
            ) : <span className="text-muted-foreground">N/A</span>;
        }
    },
    createActionsColumn<Location>({
      viewHref: (id) => `/admin/locations/${id}`,
      editHref: (id) => `/admin/locations/edit/${id}`,
      onDelete: handleDeleteLocation,
    }),
  ];

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Location Management (Pharmacies & Labs)"
        actionButton={
          <Link href="/admin/locations/add" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Location
            </Button>
          </Link>
        }
      />
      
      {/* TODO: Add filter controls, e.g., by type (pharmacy/lab), status */}

      <DataTable 
        columns={columns} 
        data={data}
        searchKey="name"
        searchPlaceholder="Search by name or address..."
      />
    </div>
  );
}

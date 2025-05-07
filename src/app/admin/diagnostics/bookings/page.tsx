
'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { FlaskConical, CalendarClock, Upload, UserCheck, XOctagon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/app/admin/_components/data-table';
import AdminHeader from '@/app/admin/_components/admin-header';
import { mockDiagnosticBookings, mockLabPartners } from '@/app/admin/_lib/mock-data';
import type { DiagnosticBooking, LabPartner } from '@/app/admin/_types';
import { 
  createSelectColumn, 
  createStatusColumn, 
  createActionsColumn,
  createGenericColumn
} from '@/app/admin/_components/columns-common';

export default function DiagnosticBookingsPage() {
  const [data, setData] = React.useState<DiagnosticBooking[]>(mockDiagnosticBookings);
  const [labs, setLabs] = React.useState<LabPartner[]>(mockLabPartners);
  
  const handleDeleteBooking = (bookingId: string) => {
    console.log("Delete booking:", bookingId);
    setData(prev => prev.filter(booking => booking.id !== bookingId));
  };

  const columns: ColumnDef<DiagnosticBooking>[] = [
    createSelectColumn<DiagnosticBooking>(),
    createGenericColumn<DiagnosticBooking>('id', 'Booking ID'),
    createGenericColumn<DiagnosticBooking>('patientName', 'Patient Name'),
    createGenericColumn<DiagnosticBooking>('testName', 'Test Name'),
    createGenericColumn<DiagnosticBooking>('bookingDate', 'Booking Date'),
    createGenericColumn<DiagnosticBooking>('collectionSlot', 'Collection Slot'),
    {
        accessorKey: 'labId',
        header: 'Assigned Lab',
        cell: ({ row }) => {
            const labId = row.getValue('labId') as string;
            const lab = labs.find(l => l.id === labId);
            return lab ? <Link href={`/admin/diagnostics/labs/${lab.id}`} className="text-primary hover:underline">{lab.name}</Link> : <span className="text-muted-foreground">N/A</span>;
        }
    },
    createStatusColumn<DiagnosticBooking>('status', 'Status'),
    createActionsColumn<DiagnosticBooking>({
      viewHref: (id) => `/admin/diagnostics/bookings/${id}`, // Detail view
      editHref: (id) => `/admin/diagnostics/bookings/edit/${id}`, // Edit status, slot, assign lab
      onDelete: handleDeleteBooking, // Or implement "Cancel Booking"
      customActions: (booking) => [
        ...(booking.status === 'Pending' ? [{ label: 'Assign Collection Slot', icon: CalendarClock, href: `/admin/diagnostics/bookings/assign-slot/${booking.id}` }] : []),
        ...(booking.status === 'SampleCollected' ? [{ label: 'Upload Results', icon: Upload, href: `/admin/diagnostics/results/upload?bookingId=${booking.id}` }] : []),
        ...(booking.status !== 'Cancelled' && booking.status !== 'Completed' ? [{ label: 'Cancel Booking', icon: XOctagon, onClick: () => console.log(`Cancel booking ${booking.id}`), isDestructive: true }] : []),
      ]
    }),
  ];

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Diagnostic Test Bookings"
        breadcrumbs={[{ label: 'Diagnostics', href: '/admin/diagnostics/bookings' }]} // Main diagnostics link might point here or a dashboard
         actionButton={
          <div className="flex gap-2">
            <Link href="/admin/diagnostics/labs" passHref>
                <Button variant="outline">
                    <UserCheck className="mr-2 h-4 w-4" /> Manage Labs
                </Button>
            </Link>
            <Link href="/admin/diagnostics/results" passHref>
                 <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" /> Manage Results
                </Button>
            </Link>
          </div>
        }
      />
      
      {/* TODO: Add filter controls, e.g., by status, lab, date range */}

      <DataTable 
        columns={columns} 
        data={data}
        searchKey="patientName" 
        searchPlaceholder="Search by patient name or test..."
      />
    </div>
  );
}


'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Video, MonitorPlay, User, UserCog } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/app/admin/_components/data-table';
import AdminHeader from '@/app/admin/_components/admin-header';
import { mockTeleconsultationAppointments, mockDoctorProfiles } from '@/app/admin/_lib/mock-data';
import type { TeleconsultationAppointment, DoctorProfile } from '@/app/admin/_types';
import { 
  createSelectColumn, 
  createStatusColumn, 
  createActionsColumn,
  createGenericColumn
} from '@/app/admin/_components/columns-common';

export default function TeleconsultationAppointmentsPage() {
  const [data, setData] = React.useState<TeleconsultationAppointment[]>(mockTeleconsultationAppointments);
  const [doctors, setDoctors] = React.useState<DoctorProfile[]>(mockDoctorProfiles);
  
  const handleDeleteAppointment = (appointmentId: string) => {
    console.log("Delete appointment:", appointmentId); // Should be "Cancel Appointment"
    setData(prev => prev.filter(appt => appt.id !== appointmentId));
  };

  const columns: ColumnDef<TeleconsultationAppointment>[] = [
    createSelectColumn<TeleconsultationAppointment>(),
    createGenericColumn<TeleconsultationAppointment>('id', 'Appointment ID'),
    createGenericColumn<TeleconsultationAppointment>('patientName', 'Patient'),
    {
      accessorKey: 'doctorName',
      header: 'Doctor',
      cell: ({ row }) => {
        const doctorName = row.getValue('doctorName') as string;
        const doctor = doctors.find(d => d.name === doctorName);
        return doctor ? (
            <Link href={`/admin/teleconsultations/doctors/${doctor.id}`} className="text-primary hover:underline">
                {doctorName}
            </Link>
        ) : doctorName;
      }
    },
    createGenericColumn<TeleconsultationAppointment>('specialty', 'Specialty'),
    createGenericColumn<TeleconsultationAppointment>('appointmentDate', 'Date'),
    createGenericColumn<TeleconsultationAppointment>('timeSlot', 'Time Slot'),
    createGenericColumn<TeleconsultationAppointment>('consultationFee', 'Fee (ETB)'),
    createStatusColumn<TeleconsultationAppointment>('status', 'Status'),
    createActionsColumn<TeleconsultationAppointment>({
      viewHref: (id) => `/admin/teleconsultations/appointments/${id}`, // Detail view
      // Edit could be for rescheduling or status update if not inline
      editHref: (id) => `/admin/teleconsultations/appointments/edit/${id}`, 
      onDelete: handleDeleteAppointment, // Or "Cancel Appointment"
      customActions: (appt) => [
        ...(appt.status === 'Scheduled' ? [{ label: 'Monitor Call (Simulate)', icon: MonitorPlay, onClick: () => console.log(`Monitor call for ${appt.id}`) }] : []),
      ]
    }),
  ];

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Teleconsultation Appointments"
        breadcrumbs={[{ label: 'Teleconsultations' }]}
        actionButton={
             <Link href="/admin/teleconsultations/doctors" passHref>
                <Button variant="outline">
                    <UserCog className="mr-2 h-4 w-4" /> Manage Doctors
                </Button>
            </Link>
        }
      />
      
      {/* TODO: Add filter controls, e.g., by doctor, specialty, status, date range */}

      <DataTable 
        columns={columns} 
        data={data}
        searchKey="patientName"
        searchPlaceholder="Search by patient or doctor name..."
      />
    </div>
  );
}

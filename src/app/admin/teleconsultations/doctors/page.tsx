
'use client';

import *ాలు
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { PlusCircle, UserCog, CheckCircle, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/app/admin/_components/data-table';
import AdminHeader from '@/app/admin/_components/admin-header';
import { mockDoctorProfiles } from '@/app/admin/_lib/mock-data';
import type { DoctorProfile } from '@/app/admin/_types';
import { 
  createSelectColumn, 
  createStatusColumn, 
  createActionsColumn,
  createGenericColumn
} from '@/app/admin/_components/columns-common';

export default function ManageDoctorsPage() {
  const [data, setData] = React.useState<DoctorProfile[]>(mockDoctorProfiles);
  
  const handleDeleteDoctor = (doctorId: string) => {
    console.log("Delete doctor:", doctorId);
    setData(prev => prev.filter(doc => doc.id !== doctorId));
  };

  const columns: ColumnDef<DoctorProfile>[] = [
    createSelectColumn<DoctorProfile>(),
    createGenericColumn<DoctorProfile>('id', 'Doctor ID'),
    createGenericColumn<DoctorProfile>('name', 'Name'),
    createGenericColumn<DoctorProfile>('specialty', 'Specialty'),
    createGenericColumn<DoctorProfile>('licenseNumber', 'License #'),
    createGenericColumn<DoctorProfile>('licenseVerified', 'License Verified'),
    createGenericColumn<DoctorProfile>('yearsExperience', 'Experience (Yrs)'),
    createStatusColumn<DoctorProfile>('status', 'Status'),
    createActionsColumn<DoctorProfile>({
      viewHref: (id) => `/admin/teleconsultations/doctors/${id}`,
      editHref: (id) => `/admin/teleconsultations/doctors/edit/${id}`,
      onDelete: handleDeleteDoctor,
      customActions: (doctor) => [
        ...(!doctor.licenseVerified && doctor.status !== 'inactive' ? [{ label: 'Verify License', icon: CheckCircle, onClick: () => console.log(`Verify license for ${doctor.id}`) }] : []),
         ...(doctor.status === 'active' ? [{ label: 'Set Inactive', icon: XCircle, onClick: () => console.log(`Set inactive ${doctor.id}`), isDestructive: true }] : []),
        ...(doctor.status === 'inactive' ? [{ label: 'Set Active', icon: CheckCircle, onClick: () => console.log(`Set active ${doctor.id}`) }] : []),
      ]
    }),
  ];

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Manage Doctor Profiles"
        breadcrumbs={[{ label: 'Teleconsultations', href:'/admin/teleconsultations/appointments'}, { label: 'Doctors' }]}
        actionButton={
          <Link href="/admin/teleconsultations/doctors/add" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Doctor
            </Button>
          </Link>
        }
      />
      
      <DataTable 
        columns={columns} 
        data={data}
        searchKey="name"
        searchPlaceholder="Search by doctor name or specialty..."
      />
    </div>
  );
}

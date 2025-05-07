
'use client';

import AdminHeader from '@/app/admin/_components/admin-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Search } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

// Mock data structure for results
interface DiagnosticResult {
  id: string;
  bookingId: string;
  patientName: string;
  testName: string;
  resultDate: string;
  labName: string;
  filePath?: string; // Path to the PDF result
  status: 'Pending Review' | 'Reviewed' | 'SentToPatient';
}

const mockResults: DiagnosticResult[] = [
  {
    id: 'res_001',
    bookingId: 'diag_001',
    patientName: 'Abebe Bikila',
    testName: 'Complete Blood Count',
    resultDate: '2024-01-20',
    labName: 'Central Lab PLC',
    filePath: '/results/diag_001_result.pdf',
    status: 'SentToPatient',
  },
   {
    id: 'res_002',
    bookingId: 'diag_002', // Assuming this booking got a result
    patientName: 'Tirunesh Dibaba',
    testName: 'Lipid Profile',
    resultDate: '2024-01-28',
    labName: 'Bole Advanced Diagnostics',
    status: 'Pending Review',
  },
];

export default function ManageResultsPage() {
  // TODO: Fetch and display results data
  // Implement DataTable for results

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Manage Diagnostic Results"
        breadcrumbs={[{ label: 'Diagnostics', href: '/admin/diagnostics/bookings' }, { label: 'Results' }]}
        actionButton={
            <Link href="/admin/diagnostics/results/upload" passHref>
                <Button>
                    <Upload className="mr-2 h-4 w-4" /> Upload New Result
                </Button>
            </Link>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText /> Diagnostic Test Results</CardTitle>
          <CardDescription>Review, manage, and distribute test results uploaded by labs or admin.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Input placeholder="Search by Booking ID, Patient Name..." className="max-w-sm" />
            <Button variant="outline"><Search className="mr-2 h-4 w-4" />Search</Button>
          </div>
          <p className="text-muted-foreground">Test results management interface will be here.</p>
           <ul className="mt-4 space-y-2">
            {mockResults.map(res => (
                <li key={res.id} className="p-3 border rounded-md flex justify-between items-center">
                    <div>
                        <strong>{res.patientName}</strong> - {res.testName} (Lab: {res.labName})
                        <br/>
                        <span className="text-xs text-muted-foreground">Booking ID: {res.bookingId} | Status: {res.status} | Date: {res.resultDate}</span>
                    </div>
                    <div className="space-x-2">
                        {res.filePath && <Button variant="outline" size="sm" asChild><Link href={res.filePath} target="_blank">View PDF</Link></Button>}
                        <Button variant="outline" size="sm">Review</Button>
                    </div>
                </li>
            ))}
          </ul>
          {/* Example: DataTable for results */}
        </CardContent>
      </Card>
    </div>
  );
}

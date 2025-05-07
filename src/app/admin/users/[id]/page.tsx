'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Edit, ArrowLeft, CheckCircle, XCircle, Shield, Briefcase, User as UserIcon, Mail, Phone, MapPinIcon, CalendarDays, BadgeCent } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AdminHeader from '@/app/admin/_components/admin-header';
import { useToast } from '@/hooks/use-toast';
import { mockUsers, mockOrders, mockTeleconsultationAppointments, mockDiagnosticBookings } from '@/app/admin/_lib/mock-data'; // Assuming these mocks exist
import type { User, Order, TeleconsultationAppointment, DiagnosticBooking } from '@/app/admin/_types';

export default function ViewUserPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const userId = params.id as string;

  const [user, setUser] = React.useState<User | null>(null);
  // Example related data - in a real app, these would be fetched based on userId
  const [userOrders, setUserOrders] = React.useState<Order[]>([]);
  const [userAppointments, setUserAppointments] = React.useState<TeleconsultationAppointment[]>([]);
  const [userDiagnostics, setUserDiagnostics] = React.useState<DiagnosticBooking[]>([]);


  React.useEffect(() => {
    const foundUser = mockUsers.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      // Mock fetching related data
      setUserOrders(mockOrders.filter(o => o.customerName === foundUser.name).slice(0, 3)); // Limit for display
      setUserAppointments(mockTeleconsultationAppointments.filter(a => a.patientName === foundUser.name).slice(0, 3));
      setUserDiagnostics(mockDiagnosticBookings.filter(d => d.patientName === foundUser.name).slice(0,3));
    } else {
      toast({ variant: "destructive", title: "User not found" });
      router.push('/admin/users');
    }
  }, [userId, router, toast]);

  if (!user) {
    return <div>Loading user data...</div>; // Or a proper loader
  }
  
  const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string | number | null | boolean}) => {
    if (value === undefined || value === null || value === '') return null;
    return (
        <div className="flex items-start text-sm">
            <Icon className="h-4 w-4 text-muted-foreground mr-2 mt-0.5 shrink-0" />
            <span className="font-medium text-muted-foreground w-32">{label}:</span>
            {typeof value === 'boolean' ? 
                (value ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />)
                : <span className="text-foreground">{String(value)}</span>
            }
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="User Profile"
        breadcrumbs={[{ label: 'User Management', href: '/admin/users' }, { label: user.name }]}
        actionButton={
          <div className="flex gap-2">
            <Link href="/admin/users" passHref>
              <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Users</Button>
            </Link>
            <Link href={`/admin/users/edit/${user.id}`} passHref>
              <Button><Edit className="mr-2 h-4 w-4" /> Edit User</Button>
            </Link>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="items-center text-center">
             <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={`https://picsum.photos/seed/${user.id}/200`} alt={user.name} data-ai-hint="user avatar" />
                <AvatarFallback>{user.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
             <Badge variant={user.status === 'active' ? 'default' : user.status === 'suspended' ? 'destructive' : 'secondary'} className="mt-2 capitalize">
                {user.status.replace('_', ' ')}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <DetailItem icon={UserIcon} label="Role" value={user.role} />
            <DetailItem icon={CalendarDays} label="Date Joined" value={user.dateJoined} />
            <DetailItem icon={CalendarDays} label="Last Login" value={user.lastLogin} />
            <Separator />
            <h4 className="font-medium text-md pt-2">Insurance Details</h4>
            <DetailItem icon={Shield} label="Provider" value={user.insuranceProvider} />
            <DetailItem icon={BadgeCent} label="Policy #" value={user.insurancePolicyNumber} />
            <DetailItem icon={CheckCircle} label="Verified" value={user.insuranceVerified} />
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {userOrders.length === 0 && userAppointments.length === 0 && userDiagnostics.length === 0 && (
                <p className="text-muted-foreground">No recent activity found for this user.</p>
              )}
              {userOrders.length > 0 && (
                <>
                  <h4 className="font-semibold text-sm mb-2">Recent Orders ({userOrders.length})</h4>
                  <ul className="space-y-1 text-xs list-disc list-inside pl-2">
                    {userOrders.map(order => (
                      <li key={order.id}>
                        <Link href={`/admin/orders/${order.id}`} className="text-primary hover:underline">
                          Order {order.id}
                        </Link> - {order.totalAmount} ETB ({order.status}) on {order.orderDate}
                      </li>
                    ))}
                  </ul>
                </>
              )}
               {userAppointments.length > 0 && (
                <>
                  <h4 className="font-semibold text-sm mt-3 mb-2">Recent Teleconsultations ({userAppointments.length})</h4>
                  <ul className="space-y-1 text-xs list-disc list-inside pl-2">
                    {userAppointments.map(appt => (
                      <li key={appt.id}>
                        <Link href={`/admin/teleconsultations/appointments/${appt.id}`} className="text-primary hover:underline">
                          Appt. with {appt.doctorName} ({appt.specialty})
                        </Link> - {appt.status} on {appt.appointmentDate}
                      </li>
                    ))}
                  </ul>
                </>
              )}
               {userDiagnostics.length > 0 && (
                <>
                  <h4 className="font-semibold text-sm mt-3 mb-2">Recent Diagnostic Bookings ({userDiagnostics.length})</h4>
                  <ul className="space-y-1 text-xs list-disc list-inside pl-2">
                    {userDiagnostics.map(diag => (
                      <li key={diag.id}>
                        <Link href={`/admin/diagnostics/bookings/${diag.id}`} className="text-primary hover:underline">
                         {diag.testName}
                        </Link> - {diag.status} on {diag.bookingDate}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>
          
          {/* Placeholder for other relevant user information cards */}
          <Card>
            <CardHeader><CardTitle>User Notes / Actions</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Future section for admin notes, manual verifications, or specific actions.</p>
              {/* Example: Button to manually verify insurance if pending */}
              {user.insuranceProvider && !user.insuranceVerified && (
                <Button variant="outline" size="sm" className="mt-2" onClick={() => alert(`Verify insurance for ${user.name}`)}>
                  <CheckCircle className="mr-2 h-4 w-4"/> Mark Insurance as Verified
                </Button>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

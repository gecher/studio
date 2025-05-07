
'use client';

import *ాలు
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Download, FileText, CalendarRange, BarChartHorizontalBig, Users, Package } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input'; // For date inputs
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AdminHeader from '@/app/admin/_components/admin-header';
import { useToast } from '@/hooks/use-toast';
import { DatePickerWithRange } from '@/components/ui/date-range-picker'; // Assuming this component exists or will be created
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

const reportSchema = z.object({
  reportType: z.enum(['sales', 'inventory', 'user_activity', 'financial_summary']),
  dateRange: z.object({
    from: z.date({ required_error: "Start date is required."}),
    to: z.date({ required_error: "End date is required."}),
  }).optional(),
  specificMonth: z.string().optional(), // YYYY-MM format
  outputFormat: z.enum(['csv', 'pdf']).default('csv'),
  // Add more specific filters based on reportType if needed
  productCategory: z.string().optional(), // For inventory/sales reports
  userSegment: z.string().optional(), // For user activity reports
});

type ReportFormData = z.infer<typeof reportSchema>;

export default function GenerateReportsPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const { register, handleSubmit, control, formState: { errors }, watch, setValue } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
        reportType: 'sales',
        outputFormat: 'csv',
    }
  });
  
  const selectedReportType = watch('reportType');

  const onSubmit: SubmitHandler<ReportFormData> = async (data) => {
    console.log('Generating report with data:', data);
    // Simulate report generation API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Report Generation Started",
      description: `Your ${data.reportType.replace('_',' ')} report in ${data.outputFormat.toUpperCase()} format is being generated. You will be notified upon completion.`,
    });
    // In a real app, this would trigger a background job and possibly provide a download link later.
    // For now, simulate a download.
    const fileName = `${data.reportType}_report_${new Date().toISOString().split('T')[0]}.${data.outputFormat}`;
    const blob = new Blob([`Mock report data for ${data.reportType}`], { type: data.outputFormat === 'csv' ? 'text/csv' : 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Generate Reports"
        breadcrumbs={[{ label: 'Analytics & Reporting', href: '/admin/analytics/dashboard' }, { label: 'Generate Reports' }]}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
            <CardDescription>Select report type, date range, and format.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Controller
                name="reportType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="reportType"><FileText className="mr-2 h-4 w-4 text-muted-foreground" /><SelectValue placeholder="Select report type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales Report</SelectItem>
                      <SelectItem value="inventory">Inventory Report</SelectItem>
                      <SelectItem value="user_activity">User Activity Report</SelectItem>
                      <SelectItem value="financial_summary">Financial Summary</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
                <Label htmlFor="dateRange">Date Range (Optional)</Label>
                <Controller
                    name="dateRange"
                    control={control}
                    render={({ field }) => (
                         <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                id="dateRange"
                                variant={"outline"}
                                className={`w-full justify-start text-left font-normal ${!field.value?.from && "text-muted-foreground"}`}
                            >
                                <CalendarRange className="mr-2 h-4 w-4" />
                                {field.value?.from ? (
                                field.value.to ? (
                                    <>{format(field.value.from, "LLL dd, y")} - {format(field.value.to, "LLL dd, y")}</>
                                ) : (
                                    format(field.value.from, "LLL dd, y")
                                )
                                ) : (
                                <span>Pick a date range</span>
                                )}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={field.value?.from}
                                selected={field.value as DateRange}
                                onSelect={field.onChange}
                                numberOfMonths={2}
                            />
                            </PopoverContent>
                        </Popover>
                    )}
                />
                 {errors.dateRange?.from && <p className="text-sm text-destructive mt-1">{errors.dateRange.from.message}</p>}
                 {errors.dateRange?.to && <p className="text-sm text-destructive mt-1">{errors.dateRange.to.message}</p>}
            </div>
            
            {/* Conditional Filters based on reportType */}
            {selectedReportType === 'inventory' && (
                 <div>
                    <Label htmlFor="productCategory">Product Category (Optional)</Label>
                    <Controller name="productCategory" control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                                <SelectTrigger id="productCategory"><Package className="mr-2 h-4 w-4 text-muted-foreground"/><SelectValue placeholder="All Categories" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Categories</SelectItem>
                                    <SelectItem value="Antibiotic">Antibiotics</SelectItem>
                                    <SelectItem value="Supplement">Supplements</SelectItem>
                                    <SelectItem value="Pain Relief">Pain Relief</SelectItem>
                                    {/* Populate with actual categories */}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            )}
             {selectedReportType === 'user_activity' && (
                 <div>
                    <Label htmlFor="userSegment">User Segment (Optional)</Label>
                     <Controller name="userSegment" control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                                <SelectTrigger id="userSegment"><Users className="mr-2 h-4 w-4 text-muted-foreground"/><SelectValue placeholder="All Users" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Users</SelectItem>
                                    <SelectItem value="new_users">New Users (Last 30 days)</SelectItem>
                                    <SelectItem value="active_subscribers">Active Subscribers</SelectItem>
                                    {/* Populate with actual segments */}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            )}


            <div>
              <Label htmlFor="outputFormat">Output Format</Label>
              <Controller
                name="outputFormat"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="outputFormat"><BarChartHorizontalBig className="mr-2 h-4 w-4 text-muted-foreground" /><SelectValue placeholder="Select format" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV (Comma Separated Values)</SelectItem>
                      <SelectItem value="pdf">PDF (Portable Document Format)</SelectItem>
                      {/* <SelectItem value="excel">Excel (XLSX)</SelectItem> */}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">
              <Download className="mr-2 h-4 w-4" /> Generate Report
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

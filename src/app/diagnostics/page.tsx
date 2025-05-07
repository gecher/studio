'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Microscope, CalendarDays, Clock, Users, CheckCircle, Search, Package, Home } from 'lucide-react';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';

// Mock data
const popularTests = [
  { id: 'test1', name: 'Complete Blood Count (CBC)', price: '300 ETB', description: 'Measures different components of your blood.', dataAiHint: 'blood test' },
  { id: 'test2', name: 'Lipid Profile', price: '450 ETB', description: 'Measures cholesterol and triglyceride levels.', dataAiHint: 'cholesterol test' },
  { id: 'test3', name: 'Thyroid Function Test (TFT)', price: '600 ETB', description: 'Checks how well your thyroid gland is working.', dataAiHint: 'thyroid scan' },
  { id: 'test4', name: 'Blood Sugar (Fasting)', price: '150 ETB', description: 'Measures glucose levels after fasting.', dataAiHint: 'glucose meter' },
];

const healthPackages = [
  { id: 'pkg1', name: 'Basic Health Checkup', price: '1200 ETB', tests: ['CBC', 'Lipid Profile', 'Blood Sugar'], description: 'Essential tests for a general health overview.', dataAiHint: 'health package' },
  { id: 'pkg2', name: 'Advanced Cardiac Profile', price: '2500 ETB', tests: ['Lipid Profile', 'ECG', 'Troponin-I'], description: 'Comprehensive heart health assessment.', dataAiHint: 'heart checkup' },
  { id: 'pkg3', name: 'Diabetes Care Package', price: '1800 ETB', tests: ['Blood Sugar (Fasting & PP)', 'HbA1c', 'Kidney Function Test'], description: 'Monitor and manage diabetes effectively.', dataAiHint: 'diabetes care' },
];

export default function DiagnosticsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | undefined>();
  const [selectedTestOrPackage, setSelectedTestOrPackage] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const availableTimeSlots = ['08:00 AM - 09:00 AM', '10:00 AM - 11:00 AM', '02:00 PM - 03:00 PM', '04:00 PM - 05:00 PM'];

  const handleBookTest = (item: any) => {
    setSelectedTestOrPackage(item);
    // Scroll to booking section or open modal
  };

  const handleConfirmBooking = () => {
    if (selectedTestOrPackage && selectedDate && selectedTimeSlot) {
      // Implement booking logic here
      alert(`Booking confirmed for ${selectedTestOrPackage.name} on ${format(selectedDate, 'PPP')} at ${selectedTimeSlot}`);
      setSelectedTestOrPackage(null); // Reset after booking
    } else {
      alert('Please select a test/package, date, and time slot.');
    }
  };
  
  const filteredTests = popularTests.filter(test => test.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredPackages = healthPackages.filter(pkg => pkg.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-2"><Microscope /> Diagnostic Test Booking</h1>
        <p className="text-muted-foreground">Book lab tests and health packages conveniently. Home sample collection available.</p>
      </header>
      
      <div className="relative max-w-xl mx-auto mb-8">
        <Input
          type="search"
          placeholder="Search for tests or packages (e.g., CBC, Basic Health Checkup)"
          className="h-12 pl-12 pr-4 text-base rounded-lg shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      </div>

      {/* Popular Tests Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><Microscope className="text-primary"/> Popular Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map(test => (
            <Card key={test.id} className="hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader>
                <CardTitle>{test.name}</CardTitle>
                <CardDescription>{test.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-lg font-semibold text-foreground">{test.price}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => handleBookTest(test)}>
                  Book Test
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
         {filteredTests.length === 0 && searchQuery && <p className="text-muted-foreground text-center py-4">No tests found for "{searchQuery}".</p>}
      </section>

      {/* Health Packages Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><Package className="text-primary"/> Health Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map(pkg => (
            <Card key={pkg.id} className="hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground mb-2">Includes: {pkg.tests.join(', ')}</p>
                <p className="text-lg font-semibold text-foreground">{pkg.price}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => handleBookTest(pkg)}>
                  Book Package
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        {filteredPackages.length === 0 && searchQuery && <p className="text-muted-foreground text-center py-4">No packages found for "{searchQuery}".</p>}
      </section>

      {/* Booking Details Section */}
      {selectedTestOrPackage && (
        <Card className="shadow-lg sticky bottom-4 z-10 md:static">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="text-accent" /> Booking: {selectedTestOrPackage.name}
            </CardTitle>
            <CardDescription>Schedule your home sample collection.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="test-date" className="mb-2 block font-medium">Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1)) } // Disable past dates
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="time-slot" className="mb-2 block font-medium">Select Time Slot</Label>
                <Select onValueChange={setSelectedTimeSlot} value={selectedTimeSlot}>
                  <SelectTrigger id="time-slot">
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimeSlots.map(slot => (
                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Alert className="bg-secondary/50">
                <Home className="h-4 w-4 text-primary" />
                <AlertTitle className="font-semibold">Home Sample Collection</AlertTitle>
                <AlertDescription>
                  Our certified phlebotomist will visit your provided address for sample collection. Please ensure you are available at the selected time.
                </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSelectedTestOrPackage(null)}>Cancel</Button>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleConfirmBooking}>Confirm Booking</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

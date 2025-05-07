
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video, CalendarDays, Clock, Search, UserMdIcon, MessageCircle, Star } from 'lucide-react'; // UserMdIcon needs to be created or replaced
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label'; // Added import

// Placeholder UserMdIcon (FontAwesome style)
const CustomUserMdIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props} fill="currentColor">
    <path d="M256 0c28.63 0 56.07 3.953 81.88 11.61C361.6 18.92 384 22.66 384 48v96c0 17.67-14.33 32-32 32h-48c-17.67 0-32-14.33-32-32V96c0-8.836-7.164-16-16-16s-16 7.164-16 16v48c0 17.67-14.33 32-32 32H160c-17.67 0-32-14.33-32-32V48c0-25.34 22.41-29.08 46.13-36.39C199.9 3.953 227.4 0 256 0zM320 256c0-17.67-14.33-32-32-32h-64c-17.67 0-32 14.33-32 32v192h128V256zM191.1 320H128C92.65 320 64 348.7 64 384v64C64 465.3 78.75 480 96 480h28.27c7.109 0 13.88-2.25 19.44-6.313l32-22.88C181.3 447.2 185.3 448 192 448h32c8.836 0 16-7.164 16-16s-7.164-16-16-16h-32c-11.84 0-22.95-2.906-32.59-8.5L139.8 391.1C134.2 386.1 128 379.3 128 376V352h63.13C195.1 352 199.1 348.2 199.1 344S195.1 336 191.1 336v-16H191.1zM384 320h-63.13c-4.016 0-8.031 3.75-8.031 8s4.016 8 8.031 8H384v16c0 8.836 7.164 16 16 16s16-7.164 16-16h-32c-6.703 0-12.81-2.859-17.44-7.5l-27.62-27.62C334.2 346.1 328 352.9 328 360v16c0 3.344 1.766 6.438 4.688 8.313l32 22.88C370.1 413.8 376.9 416 384 416h28.27C433.3 416 448 401.3 448 384v-64C448 300.7 419.3 272 384 272v48H384z"/>
  </svg>
);


// Mock data
const doctors = [
  { id: 'doc1', name: 'Dr. Alemayehu Kassa', specialty: 'General Physician', experience: '10+ Years', consultationFee: '500 ETB', image: 'https://picsum.photos/seed/doc1/200/200', availability: ['Mon', 'Wed', 'Fri'], rating: 4.8, dataAiHint: 'doctor portrait' },
  { id: 'doc2', name: 'Dr. Fatuma Ahmed', specialty: 'Pediatrician', experience: '8 Years', consultationFee: '600 ETB', image: 'https://picsum.photos/seed/doc2/200/200', availability: ['Tue', 'Thu', 'Sat'], rating: 4.9, dataAiHint: 'female doctor' },
  { id: 'doc3', name: 'Dr. Tsegaye Lemma', specialty: 'Cardiologist', experience: '15 Years', consultationFee: '800 ETB', image: 'https://picsum.photos/seed/doc3/200/200', availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], rating: 4.7, dataAiHint: 'male doctor' },
];

const specialties = ['All', 'General Physician', 'Pediatrician', 'Cardiologist', 'Dermatologist', 'Gynecologist'];

export default function TeleconsultationPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const availableTimeSlots = ['09:00 AM - 09:30 AM', '11:00 AM - 11:30 AM', '03:00 PM - 03:30 PM', '05:00 PM - 05:30 PM'];

  const handleBookAppointment = (doctor: any) => {
    setSelectedDoctor(doctor);
    // Scroll or show modal for booking
  };

  const handleConfirmBooking = () => {
    if (selectedDoctor && selectedDate && selectedTimeSlot) {
      // Implement booking logic here
      alert(`Appointment booked with ${selectedDoctor.name} on ${format(selectedDate, 'PPP')} at ${selectedTimeSlot}`);
      setSelectedDoctor(null); // Reset
    } else {
      alert('Please select a doctor, date, and time slot.');
    }
  };

  const filteredDoctors = doctors.filter(doc =>
    (doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedSpecialty === 'All' || doc.specialty === selectedSpecialty)
  );

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-2"><Video /> Teleconsultation</h1>
        <p className="text-muted-foreground">Consult with experienced doctors online from the comfort of your home.</p>
      </header>

      {/* Search and Filter Section */}
      <Card className="shadow-sm">
        <CardContent className="p-4 md:p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Input
                type="search"
                placeholder="Search by doctor name or specialty..."
                className="pl-10 h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="w-full md:w-[200px] h-11">
                <SelectValue placeholder="Filter by specialty" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map(spec => (
                  <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Doctor Listings */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Available Doctors</h2>
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map(doc => (
              <Card key={doc.id} className="hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader className="flex items-center gap-4">
                  <Image
                    src={doc.image}
                    alt={doc.name}
                    width={80}
                    height={80}
                    className="rounded-full border-2 border-primary"
                    data-ai-hint={doc.dataAiHint}
                  />
                  <div>
                    <CardTitle>{doc.name}</CardTitle>
                    <CardDescription>{doc.specialty}</CardDescription>
                    <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                        <span className="text-sm text-muted-foreground">{doc.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                  <p className="text-sm"><strong className="font-medium">Experience:</strong> {doc.experience}</p>
                  <p className="text-sm"><strong className="font-medium">Fee:</strong> {doc.consultationFee}</p>
                  <div className="flex flex-wrap gap-1">
                     <span className="text-sm font-medium">Availability:</span>
                    {doc.availability.map(day => <Badge key={day} variant="secondary" className="text-xs">{day}</Badge>)}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => handleBookAppointment(doc)}>
                    <Video className="mr-2 h-4 w-4" /> Book Appointment
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
              <CustomUserMdIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">No Doctors Found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </div>
        )}
      </section>

      {/* Appointment Booking Section */}
      {selectedDoctor && (
        <Card className="shadow-lg sticky bottom-4 z-10 md:static">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="text-accent" /> Book Appointment with {selectedDoctor.name}
            </CardTitle>
            <CardDescription>Select a date and time for your teleconsultation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="appointment-date" className="mb-2 block font-medium">Select Date</Label>
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
                      disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1)) }
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="appointment-time-slot" className="mb-2 block font-medium">Select Time Slot</Label>
                <Select onValueChange={setSelectedTimeSlot} value={selectedTimeSlot}>
                  <SelectTrigger id="appointment-time-slot">
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
            <div className="bg-secondary/50 p-4 rounded-md">
              <h4 className="font-semibold text-foreground mb-2">Consultation Details:</h4>
              <p className="text-sm"><strong>Doctor:</strong> {selectedDoctor.name}, {selectedDoctor.specialty}</p>
              <p className="text-sm"><strong>Fee:</strong> {selectedDoctor.consultationFee}</p>
              {selectedDate && selectedTimeSlot && (
                <p className="text-sm"><strong>Scheduled for:</strong> {format(selectedDate, 'PPP')} at {selectedTimeSlot}</p>
              )}
               <p className="text-xs text-muted-foreground mt-2">Note: Video call link will be shared upon confirmation. Ensure good internet connectivity.</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSelectedDoctor(null)}>Cancel</Button>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleConfirmBooking}>
              <Video className="mr-2 h-4 w-4" /> Confirm & Pay
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* How Teleconsultation Works */}
      <section className="bg-secondary/50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center p-4 rounded-md">
            <div className="bg-primary text-primary-foreground rounded-full p-3 mb-3 inline-block">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium mb-1">1. Find Your Doctor</h3>
            <p className="text-sm text-muted-foreground">Search by specialty or name.</p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-md">
             <div className="bg-primary text-primary-foreground rounded-full p-3 mb-3 inline-block">
              <CalendarDays className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium mb-1">2. Book an Appointment</h3>
            <p className="text-sm text-muted-foreground">Choose a convenient date and time.</p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-md">
             <div className="bg-primary text-primary-foreground rounded-full p-3 mb-3 inline-block">
              <Video className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium mb-1">3. Start Your Consultation</h3>
            <p className="text-sm text-muted-foreground">Connect via secure video/audio call.</p>
          </div>
        </div>
      </section>
    </div>
  );
}


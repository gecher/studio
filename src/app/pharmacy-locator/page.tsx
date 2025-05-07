
'use client';

import { useState, useEffect } from 'react';
import { getNearbyPharmacies, type Pharmacy } from '@/services/pharmacy-locator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Navigation, Phone, List } from 'lucide-react';
import Image from 'next/image';

// Simple placeholder for map. In a real app, use @vis.gl/react-google-maps or similar.
const MapPlaceholder = ({ pharmacies }: { pharmacies: Pharmacy[] }) => (
  <div className="w-full h-[400px] md:h-full bg-secondary rounded-lg flex items-center justify-center relative overflow-hidden shadow-inner">
    <Image 
      src="https://picsum.photos/seed/ethiopiamap/1200/800" 
      alt="Map of Addis Ababa showing pharmacy locations" 
      layout="fill" 
      objectFit="cover"
      data-ai-hint="city map"
    />
    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
    <div className="relative z-10 text-center p-4">
      <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
      <p className="text-lg font-semibold text-background">Map View of Pharmacies</p>
      <p className="text-sm text-gray-300">Interactive map will display here.</p>
      {pharmacies.map(pharmacy => (
        // Basic indication of pharmacy locations on the placeholder
        <div key={pharmacy.name} className="absolute text-primary-foreground" style={{ 
          // Approximate positioning based on mock lat/lng for visual cue
          // These are NOT accurate map coordinates for display, just for differentiation
          left: `${(pharmacy.lng - 38.75) * 2000 + 40}%`, 
          top: `${(9.01 - pharmacy.lat) * 2000 + 40}%`,
          transform: 'translate(-50%, -50%)'
        }}>
          <MapPin className="w-5 h-5 text-accent fill-accent" />
          <span className="text-xs bg-background/80 text-foreground px-1 py-0.5 rounded">{pharmacy.name.substring(0,10)}</span>
        </div>
      ))}
    </div>
  </div>
);

export default function PharmacyLocatorPage() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate getting user's location
    // In a real app, use navigator.geolocation.getCurrentPosition
    const mockUserLat = 9.007; // Slightly different from pharmacy locations for demo
    const mockUserLng = 38.76;
    setUserLocation({ lat: mockUserLat, lng: mockUserLng });

    getNearbyPharmacies(mockUserLat, mockUserLng)
      .then(data => {
        setPharmacies(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching pharmacies:", err);
        setError('Failed to load pharmacies. Please try again later.');
        setLoading(false);
      });
  }, []);

  const handleLocateMe = () => {
    // Placeholder for actual geolocation API call
    alert("Locating you... (This is a placeholder. Geolocation would activate here.)");
    // Potentially re-fetch pharmacies based on new location
  };

  const filteredPharmacies = pharmacies.filter(pharmacy => 
    pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-2"><MapPin /> Pharmacy & Lab Locator</h1>
        <p className="text-muted-foreground">Find partner pharmacies and diagnostic labs near you.</p>
      </header>

      <Card className="shadow-lg">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Input
                type="search"
                placeholder="Search by pharmacy name or area..."
                className="pl-10 h-11"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <Button onClick={handleLocateMe} variant="outline" className="h-11">
              <Navigation className="mr-2 h-4 w-4" /> Use My Current Location
            </Button>
          </div>
        
          <div className="flex flex-col md:flex-row gap-6 min-h-[400px] md:min-h-[500px]">
            {/* Map Area */}
            <div className="w-full md:w-2/3">
              <MapPlaceholder pharmacies={filteredPharmacies} />
            </div>

            {/* List Area */}
            <div className="w-full md:w-1/3">
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2"><List /> Nearby Pharmacies</h2>
              {loading && <p className="text-muted-foreground">Loading pharmacies...</p>}
              {error && <p className="text-destructive">{error}</p>}
              {!loading && !error && filteredPharmacies.length === 0 && (
                <p className="text-muted-foreground">No pharmacies found matching your search or near your location.</p>
              )}
              {!loading && !error && filteredPharmacies.length > 0 && (
                <div className="space-y-3 max-h-[400px] md:max-h-full overflow-y-auto pr-2">
                  {filteredPharmacies.map(pharmacy => (
                    <Card key={pharmacy.name} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{pharmacy.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        <p className="flex items-center gap-1"><MapPin className="h-4 w-4 text-primary"/> Location: Approx. Lat: {pharmacy.lat.toFixed(3)}, Lng: {pharmacy.lng.toFixed(3)}</p>
                        <p className="flex items-center gap-1"><Phone className="h-4 w-4 text-primary"/> {pharmacy.phoneNumber}</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="link" className="p-0 text-primary">Get Directions</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


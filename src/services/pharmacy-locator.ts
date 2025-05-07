/**
 * Represents a pharmacy with its location and contact information.
 */
export interface Pharmacy {
  /**
   * The name of the pharmacy.
   */
  name: string;
  /**
   * The latitude of the pharmacy's location.
   */
  lat: number;
  /**
   * The longitude of the pharmacy's location.
   */
  lng: number;
  /**
   * The phone number of the pharmacy.
   */
  phoneNumber: string;
}

/**
 * Asynchronously retrieves a list of nearby pharmacies based on a given location.
 * @param lat The latitude of the user's location.
 * @param lng The longitude of the user's location.
 * @returns A promise that resolves to an array of Pharmacy objects.
 */
export async function getNearbyPharmacies(lat: number, lng: number): Promise<Pharmacy[]> {
  // TODO: Implement this by calling an external API.

  return [
    {
      name: 'EasyMeds Pharmacy',
      lat: 9.005405,
      lng: 38.763611,
      phoneNumber: '+251911223344',
    },
    {
      name: 'Ethio Pharmacy',
      lat: 9.008578,
      lng: 38.757752,
      phoneNumber: '+251911556677',
    },
  ];
}



export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'pharmacist' | 'customer' | 'doctor' | 'partner'; // Added 'partner'
  status: 'active' | 'suspended' | 'pending_verification';
  lastLogin?: string;
  dateJoined: string;
  insuranceProvider?: 'Nyala Insurance' | 'CBHI' | 'Other' | null;
  insurancePolicyNumber?: string;
  insuranceVerified?: boolean;
  accountType: 'basic' | 'easymeds_plus'; // Added for Customer/User, can be optional or adjusted for others
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  status: 'in_stock' | 'out_of_stock' | 'low_stock';
  lastUpdated: string;
  requiresPrescription?: boolean;
  dataAiHint?: string; // Added for product card image hints
}

export interface Batch {
  id: string;
  productId: string;
  productName?: string; // For display
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  status: 'active' | 'near_expiry' | 'expired' | 'disposed';
}

export interface Order {
  id:string;
  customerName: string; // Could be linked to User ID in a real system
  orderDate: string;
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';
  paymentStatus: 'Paid' | 'Unpaid' | 'Pending Refund' | 'Refunded'; // Added 'Refunded'
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface DiagnosticBooking {
  id: string;
  patientName: string; // Could be linked to User ID
  testName: string;
  bookingDate: string;
  collectionSlot?: string;
  status: 'Pending' | 'SampleCollected' | 'ResultUploaded' | 'Completed' | 'Cancelled';
  labId?: string; // Link to LabPartner
}

export interface LabPartner { // This can serve as a base for 'Partner' role if lab-specific
    id: string;
    name: string;
    location: string; // Full address
    contactPerson: string;
    contactEmail: string;
    status: 'active' | 'inactive';
    // partner-specific fields like transactionFeeRate, premiumTier, etc. can be added
}

export interface TeleconsultationAppointment {
    id: string;
    patientName: string; // Could be linked to User ID
    doctorId: string; // Link to DoctorProfile
    doctorName?: string; // For display
    specialty: string;
    appointmentDate: string;
    timeSlot: string;
    status: 'Scheduled' | 'Completed' | 'Cancelled' | 'InProgress';
    consultationFee: number;
}

export interface DoctorProfile { // For 'doctor' role
    id: string; // Should map to a User ID
    name: string; // From User
    specialty: string;
    licenseNumber: string;
    licenseVerified: boolean;
    yearsExperience: number;
    status: 'active' | 'inactive' | 'pending_verification'; // Status of their doctor profile
    // contactEmail, contactPhone from User or separate professional contact
    // bio, profilePictureUrl
    avatarUrl?: string;
}

export interface InsurancePolicy {
    id: string;
    policyNumber: string;
    userId: string; // Link to user
    userName?: string; // For display
    provider: 'Nyala Insurance' | 'CBHI' | 'Other';
    status: 'active' | 'expired' | 'pending_verification';
    verificationDate?: string;
}

export interface InsuranceClaim {
    id: string;
    policyNumber: string;
    claimAmount: number;
    submissionDate: string;
    status: 'Submitted' | 'Processing' | 'Approved' | 'Rejected' | 'Paid';
    serviceType: 'Medicine' | 'Diagnostic' | 'Teleconsultation';
}

export interface InsuranceProvider {
    id: string;
    name: string;
    contactEmail: string;
    apiEndpoint?: string; // For potential future integration
    status: 'active' | 'inactive';
}

export interface ContentItem {
    id: string;
    title: string;
    type: 'article' | 'video' | 'faq';
    category: string;
    language: 'english' | 'amharic' | 'both';
    status: 'published' | 'draft' | 'archived';
    publishDate: string;
    author?: string;
    href?: string; // Added for linking
    summary?: string; // Added for card display
    image?: string; // Added for card display
    dataAiHint?: string; // Added for image hints
}

export interface Location { // For Pharmacy or Lab locations
    id: string;
    name: string;
    type: 'pharmacy' | 'lab';
    address: string;
    contactNumber: string;
    status: 'active' | 'inactive';
    services?: string[]; // e.g., ['Prescription Filling', 'OTC Sales'] or ['Blood Test', 'Urine Test']
    // lat, lng for map
    lat?: number;
    lng?: number;
}

export interface ChatbotResponse {
    id: string;
    queryPattern: string; // e.g., "order status *", "what is *?"
    responseAmharic: string;
    responseEnglish: string;
    language: 'amharic' | 'english' | 'both';
    lastUpdated: string;
}

export interface ChatbotLog {
    id: string;
    timestamp: string;
    query: string;
    language: 'amharic' | 'english';
    response?: string; // Bot's response text
    escalated: boolean;
}

export interface GeneralSetting {
    key: string;
    value: string | number | boolean;
    description: string;
    type: 'string' | 'number' | 'boolean' | 'select';
    options?: string[]; // For select type
}

export interface SecurityLog {
    id: string;
    timestamp: string;
    actor: string; // User ID or system process
    action: string; // e.g., "Login Attempt", "Password Change", "Admin Action: X"
    status: 'success' | 'failure';
    ipAddress?: string;
    details?: string;
}

export interface PaymentGatewaySetting {
    id: string;
    name: 'Stripe' | 'Chapa' | 'Telebirr'; // Example local + international
    apiKey: string;
    secretKey: string;
    isEnabled: boolean;
    environment: 'sandbox' | 'production';
}

// Pharmacy Partner type (could extend User if they log in, or be separate if managed by admin)
export interface PharmacyPartner {
  id: string; // Partner ID, could be linked to a User ID of role 'partner'
  pharmacyName: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  status: 'active' | 'inactive' | 'pending_approval';
  // inventory management features, order fulfillment features etc.
  // transactionFeeRate?: number;
  // premiumTier?: boolean;
}

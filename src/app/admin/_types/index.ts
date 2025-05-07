
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'pharmacist' | 'customer' | 'doctor';
  status: 'active' | 'suspended' | 'pending_verification';
  lastLogin?: string;
  dateJoined: string;
  insuranceProvider?: 'Nyala Insurance' | 'CBHI' | 'Other' | null;
  insurancePolicyNumber?: string;
  insuranceVerified?: boolean;
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
}

export interface Batch {
  id: string;
  productId: string;
  productName?: string; // For display
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  status: 'active' | 'near_expiry' | 'expired';
}

export interface Order {
  id:string;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';
  paymentStatus: 'Paid' | 'Unpaid' | 'Pending Refund';
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
  patientName: string;
  testName: string;
  bookingDate: string;
  collectionSlot?: string;
  status: 'Pending' | 'SampleCollected' | 'ResultUploaded' | 'Completed' | 'Cancelled';
  labId?: string;
}

export interface LabPartner {
    id: string;
    name: string;
    location: string;
    contactPerson: string;
    contactEmail: string;
    status: 'active' | 'inactive';
}

export interface TeleconsultationAppointment {
    id: string;
    patientName: string;
    doctorName: string;
    specialty: string;
    appointmentDate: string;
    timeSlot: string;
    status: 'Scheduled' | 'Completed' | 'Cancelled' | 'InProgress';
    consultationFee: number;
}

export interface DoctorProfile {
    id: string;
    name: string;
    specialty: string;
    licenseNumber: string;
    licenseVerified: boolean;
    yearsExperience: number;
    status: 'active' | 'inactive' | 'pending_verification';
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
    language: 'english' | 'amharic';
    status: 'published' | 'draft' | 'archived';
    publishDate: string;
    author?: string;
}

export interface Location {
    id: string;
    name: string;
    type: 'pharmacy' | 'lab';
    address: string;
    contactNumber: string;
    status: 'active' | 'inactive';
    services?: string[]; // e.g., ['Prescription Filling', 'OTC Sales'] or ['Blood Test', 'Urine Test']
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

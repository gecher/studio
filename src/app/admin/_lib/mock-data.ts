
import type { 
  User, Product, Batch, Order, DiagnosticBooking, LabPartner, 
  TeleconsultationAppointment, DoctorProfile, InsurancePolicy, InsuranceClaim,
  InsuranceProvider, ContentItem, Location, ChatbotResponse, ChatbotLog,
  GeneralSetting, SecurityLog, PaymentGatewaySetting, OrderItem
} from '../_types';
import { format } from 'date-fns';
import type { CartItem } from '@/contexts/cart-context';
import { 
  MOCK_ADMIN_USER, 
  MOCK_BASIC_CUSTOMER_USER, 
  MOCK_PLUS_CUSTOMER_USER, 
  MOCK_PHARMACIST_USER, 
  MOCK_DOCTOR_USER, 
  MOCK_PARTNER_USER 
} from '@/contexts/auth-context';

const today = new Date();
const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

// --- HMR-Proof Store for mutable mock data ---
declare global {
  interface Window {
    __MOCK_DATA_STORE__?: {
      orders: Order[];
      orderItems: Record<string, OrderItem[]>;
      users: User[]; // Added users to HMR store
    };
  }
}

const _initialMockOrdersData: Order[] = [
  { id: 'ord_001', customerName: 'Abebe Bikila', orderDate: formatDate(new Date(2024, 0, 20)), totalAmount: 210, status: 'Delivered', paymentStatus: 'Paid' },
  { id: 'ord_002', customerName: 'Tirunesh Dibaba', orderDate: formatDate(new Date(2024, 0, 22)), totalAmount: 150, status: 'Pending', paymentStatus: 'Unpaid' },
  { id: 'ord_003', customerName: 'Abebe Bikila', orderDate: formatDate(new Date(2024, 0, 15)), totalAmount: 500, status: 'Shipped', paymentStatus: 'Paid' },
  { id: 'ord_004', customerName: 'Guest User', orderDate: formatDate(new Date(2023, 11, 30)), totalAmount: 80, status: 'Cancelled', paymentStatus: 'Pending Refund' },
];

const _initialMockOrderItemsData: Record<string, OrderItem[]> = {
  'ord_001': [
    { id: 'oi_001', productId: 'prod_001', productName: 'Amoxicillin 250mg', quantity: 1, unitPrice: 80, totalPrice: 80},
    { id: 'oi_002', productId: 'prod_002', productName: 'Paracetamol 500mg', quantity: 2, unitPrice: 50, totalPrice: 100},
    { id: 'oi_003', productId: 'prod_003', productName: 'Vitamin C 1000mg', quantity: 1, unitPrice: 30, totalPrice: 30}, 
  ],
  'ord_002': [
    { id: 'oi_004', productId: 'prod_002', productName: 'Paracetamol 500mg', quantity: 3, unitPrice: 50, totalPrice: 150},
  ],
   'ord_003': [
    { id: 'oi_005', productId: 'prod_004', productName: 'Digital Thermometer', quantity: 2, unitPrice: 250, totalPrice: 500},
  ],
   'ord_004': [
    { id: 'oi_006', productId: 'prod_001', productName: 'Amoxicillin 250mg', quantity: 1, unitPrice: 80, totalPrice: 80},
  ],
};

// Ensure all mock users from auth-context are included and have accountType
const _initialMockUsersData: User[] = [
  MOCK_ADMIN_USER,
  MOCK_BASIC_CUSTOMER_USER,
  MOCK_PLUS_CUSTOMER_USER,
  MOCK_PHARMACIST_USER,
  MOCK_DOCTOR_USER,
  MOCK_PARTNER_USER,
  // Add other specific mock users ensuring accountType is present
  { 
    id: 'usr_001_legacy', // Renamed to avoid conflict if 'usr_001' is MOCK_BASIC_CUSTOMER_USER
    name: 'Legacy Abebe', 
    email: 'legacy.abebe@example.com', 
    role: 'customer', 
    status: 'active', 
    dateJoined: formatDate(new Date(2023, 0, 15)), 
    lastLogin: formatDate(today), 
    insuranceProvider: 'Nyala Insurance', 
    insurancePolicyNumber: 'NYL-LEGACY-123', 
    insuranceVerified: true,
    accountType: 'basic' // Added accountType
  },
  { 
    id: 'usr_004_legacy', // Renamed
    name: 'Legacy Tirunesh', 
    email: 'legacy.tirunesh@example.com', 
    role: 'customer', 
    status: 'suspended', 
    dateJoined: formatDate(new Date(2023, 5, 20)), 
    insuranceProvider: 'CBHI', 
    insurancePolicyNumber: 'CBHI-LEGACY-678', 
    insuranceVerified: false,
    accountType: 'basic' // Added accountType
  },
];


if (typeof window !== 'undefined') {
  if (!window.__MOCK_DATA_STORE__) {
    window.__MOCK_DATA_STORE__ = {
      orders: [..._initialMockOrdersData], 
      orderItems: JSON.parse(JSON.stringify(_initialMockOrderItemsData)),
      users: [..._initialMockUsersData], // Initialize users in HMR store
    };
  }
}

export const mockOrders: Order[] = typeof window !== 'undefined' 
  ? window.__MOCK_DATA_STORE__!.orders 
  : [..._initialMockOrdersData];

export const mockOrderItems: Record<string, OrderItem[]> = typeof window !== 'undefined' 
  ? window.__MOCK_DATA_STORE__!.orderItems 
  : JSON.parse(JSON.stringify(_initialMockOrderItemsData));

export const mockUsers: User[] = typeof window !== 'undefined'
  ? window.__MOCK_DATA_STORE__!.users
  : [..._initialMockUsersData];
// --- End HMR-Proof Store ---


export const mockProducts: Product[] = [
  { id: 'prod_001', name: 'Amoxicillin 250mg', category: 'Antibiotic', price: 80, stock: 150, sku: 'AMX250', status: 'in_stock', lastUpdated: formatDate(today), requiresPrescription: true, image: 'https://picsum.photos/seed/amox250/300/200', dataAiHint: 'antibiotic pills' },
  { id: 'prod_002', name: 'Paracetamol 500mg', category: 'Pain Relief', price: 50, stock: 300, sku: 'PAR500', status: 'in_stock', lastUpdated: formatDate(today), image: 'https://picsum.photos/seed/par500/300/200', dataAiHint: 'painkiller tablets' },
  { id: 'prod_003', name: 'Vitamin C 1000mg', category: 'Supplement', price: 120, stock: 8, sku: 'VITC1000', status: 'low_stock', lastUpdated: formatDate(today), image: 'https://picsum.photos/seed/vitc1000/300/200', dataAiHint: 'vitamin bottle' },
  { id: 'prod_004', name: 'Digital Thermometer', category: 'Medical Device', price: 250, stock: 0, sku: 'THERM01', status: 'out_of_stock', lastUpdated: formatDate(new Date(2023,11,10)), image: 'https://picsum.photos/seed/thermometer/300/200', dataAiHint: 'digital thermometer' },
  { id: 'prod_005', name: 'Loratadine 10mg', category: 'Allergy Relief', price: 120, stock: 75, sku: 'LOR10', status: 'in_stock', lastUpdated: formatDate(today), image: 'https://picsum.photos/seed/loratadine10/300/200', dataAiHint: 'allergy medicine' },
  { id: 'prod_006', name: 'Omeprazole 20mg', category: 'Acidity Relief', price: 150, stock: 90, sku: 'OME20', status: 'in_stock', lastUpdated: formatDate(today), requiresPrescription: true, image: 'https://picsum.photos/seed/omeprazole20/300/200', dataAiHint: 'capsules' },
  { id: 'prod_007', name: 'Saline Nasal Spray', category: 'Cold & Flu', price: 70, stock: 120, sku: 'SALNS', status: 'in_stock', lastUpdated: formatDate(today), image: 'https://picsum.photos/seed/nasalspray/300/200', dataAiHint: 'nasal spray' },
  { id: 'prod_008', name: 'Ibuprofen 200mg', category: 'Pain Relief', price: 60, stock: 200, sku: 'IBU200', status: 'in_stock', lastUpdated: formatDate(today), image: 'https://picsum.photos/seed/ibuprofen200/300/200', dataAiHint: 'pain relief tablets' },
];


export const mockBatches: Batch[] = [
  { id: 'batch_001', productId: 'prod_001', productName: 'Amoxicillin 250mg', batchNumber: 'B001A', expiryDate: formatDate(new Date(2025, 6, 30)), quantity: 100, status: 'active' },
  { id: 'batch_002', productId: 'prod_001', productName: 'Amoxicillin 250mg', batchNumber: 'B001B', expiryDate: formatDate(new Date(2024, 8, 15)), quantity: 50, status: 'near_expiry' },
  { id: 'batch_003', productId: 'prod_002', productName: 'Paracetamol 500mg', batchNumber: 'P001X', expiryDate: formatDate(new Date(2026, 0, 31)), quantity: 300, status: 'active' },
  { id: 'batch_004', productId: 'prod_003', productName: 'Vitamin C 1000mg', batchNumber: 'VC001', expiryDate: formatDate(new Date(2023, 10, 1)), quantity: 8, status: 'expired' },
];

export async function createMockOrder(
  cartItems: CartItem[],
  customerDetails: { name: string; email: string; phone: string; address: string },
  paymentMethod: 'cod' | 'online',
  totalAmount: number
): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => { 
      const newOrderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      
      const newOrder: Order = {
        id: newOrderId,
        customerName: customerDetails.name,
        orderDate: formatDate(new Date()),
        totalAmount: totalAmount,
        status: 'Pending', 
        paymentStatus: paymentMethod === 'cod' ? 'Unpaid' : 'Paid', 
      };
      
      // Simulate HMR-proof update if window is defined
      if (typeof window !== 'undefined' && window.__MOCK_DATA_STORE__) {
        window.__MOCK_DATA_STORE__.orders.push(newOrder);
      } else {
        mockOrders.push(newOrder); // Fallback for non-browser environments or if store not init
      }


      const newOrderItemsList: OrderItem[] = cartItems.map((cartItem, index) => ({
        id: `oi_${newOrderId}_${index}`,
        productId: cartItem.id,
        productName: cartItem.name,
        quantity: cartItem.quantity,
        unitPrice: cartItem.price,
        totalPrice: cartItem.price * cartItem.quantity,
      }));

      if (typeof window !== 'undefined' && window.__MOCK_DATA_STORE__) {
        window.__MOCK_DATA_STORE__.orderItems[newOrderId] = newOrderItemsList;
      } else {
         mockOrderItems[newOrderId] = newOrderItemsList;
      }
      
      console.log("New order created in mock data:", newOrder);
      console.log("New order items:", newOrderItemsList);
      resolve(newOrderId);
    }, 500); 
  });
}


export const mockDiagnosticBookings: DiagnosticBooking[] = [
  { id: 'diag_001', patientName: 'Abebe Bikila', testName: 'Complete Blood Count', bookingDate: formatDate(new Date(2024, 0, 18)), collectionSlot: '10:00 AM - 11:00 AM', status: 'ResultUploaded', labId: 'lab_001' },
  { id: 'diag_002', patientName: 'Tirunesh Dibaba', testName: 'Lipid Profile', bookingDate: formatDate(new Date(2024, 0, 25)), status: 'Pending' },
];

export const mockLabPartners: LabPartner[] = [
    {id: 'lab_001', name: 'Central Lab PLC', location: 'Mexico Square, Addis Ababa', contactPerson: 'Mr. John Doe', contactEmail: 'john.doe@centrallab.com', status: 'active'},
    {id: 'lab_002', name: 'Bole Advanced Diagnostics', location: 'Bole Medhanialem, Addis Ababa', contactPerson: 'Ms. Jane Smith', contactEmail: 'jane.smith@boleadvanced.com', status: 'inactive'},
];

export const mockTeleconsultationAppointments: TeleconsultationAppointment[] = [
    { id: 'tele_001', patientName: 'Abebe Bikila', doctorId: 'doc_002', doctorName: 'Dr. Fatuma Ahmed', specialty: 'Pediatrician', appointmentDate: formatDate(new Date(2024, 1, 10)), timeSlot: '09:00 AM', status: 'Scheduled', consultationFee: 600 },
    { id: 'tele_002', patientName: 'Tirunesh Dibaba', doctorId: 'doc_001', doctorName: 'Dr. Alemayehu Kassa', specialty: 'General Physician', appointmentDate: formatDate(new Date(2024, 1, 5)), timeSlot: '02:30 PM', status: 'Completed', consultationFee: 500 },
];

export const mockDoctorProfiles: DoctorProfile[] = [
    { id: 'doc_001', name: 'Dr. Alemayehu Kassa', specialty: 'General Physician', licenseNumber: 'GP12345', licenseVerified: true, yearsExperience: 10, status: 'active', avatarUrl: 'https://picsum.photos/seed/doc_001/200'},
    { id: 'doc_002', name: 'Dr. Fatuma Ahmed', specialty: 'Pediatrician', licenseNumber: 'PD67890', licenseVerified: true, yearsExperience: 8, status: 'active', avatarUrl: 'https://picsum.photos/seed/doc_002/200'},
    { id: 'doc_003', name: 'Dr. Tsegaye Lemma', specialty: 'Cardiologist', licenseNumber: 'CD11223', licenseVerified: false, yearsExperience: 15, status: 'pending_verification', avatarUrl: 'https://picsum.photos/seed/doc_003/200'},
];

export const mockInsurancePolicies: InsurancePolicy[] = [
    {id: 'pol_001', policyNumber: 'NYL-LEGACY-123', userId: 'usr_001_legacy', userName: 'Legacy Abebe', provider: 'Nyala Insurance', status: 'active', verificationDate: formatDate(new Date(2023,0,10))},
    {id: 'pol_002', policyNumber: 'CBHI-LEGACY-678', userId: 'usr_004_legacy', userName: 'Legacy Tirunesh', provider: 'CBHI', status: 'pending_verification'},
    {id: 'pol_003', policyNumber: 'NYL-CUST-123', userId: 'usr_customer_001', userName: 'Abebe Bikila', provider: 'Nyala Insurance', status: 'active', verificationDate: formatDate(new Date(2023,0,10))},
    {id: 'pol_004', policyNumber: 'CBHI-PLUS-456', userId: 'usr_customer_002', userName: 'Tirunesh Dibaba', provider: 'CBHI', status: 'active', verificationDate: formatDate(new Date(2023,0,10))},
];

export const mockInsuranceClaims: InsuranceClaim[] = [
    { id: 'clm_001', policyNumber: 'NYL-LEGACY-123', claimAmount: 150.00, submissionDate: formatDate(new Date(2024,0,21)), status: 'Approved', serviceType: 'Medicine' },
    { id: 'clm_002', policyNumber: 'CBHI-PLUS-456', claimAmount: 300.00, submissionDate: formatDate(new Date(2024,0,26)), status: 'Submitted', serviceType: 'Diagnostic' },
];

export const mockInsuranceProviders: InsuranceProvider[] = [
    {id: 'insprov_001', name: 'Nyala Insurance S.C.', contactEmail: 'claims@nyalainsurance.com', status: 'active' },
    {id: 'insprov_002', name: 'CBHI (Community Based Health Insurance)', contactEmail: 'info@cbhi.gov.et', status: 'active' },
    {id: 'insprov_003', name: 'Awash Insurance Company', contactEmail: 'contact@awashinsurance.com', status: 'inactive' },
];

export const mockContentItems: ContentItem[] = [
  { id: 'cont_001', title: 'Understanding Diabetes', type: 'article', category: 'Chronic Diseases', language: 'english', status: 'published', publishDate: formatDate(new Date(2023, 6, 15)), author: 'Dr. Haile', summary: 'A guide to diabetes.', image: 'https://picsum.photos/seed/diabetesinfo/400/250', dataAiHint: 'health book', href:'/health-hub/cont_001' },
  { id: 'cont_002', title: 'የስኳር በሽታን መረዳት', type: 'article', category: 'Chronic Diseases', language: 'amharic', status: 'published', publishDate: formatDate(new Date(2023, 6, 15)), author: 'ዶ/ር ኃይሌ', summary: 'የስኳር በሽታ መመሪያ', image: 'https://picsum.photos/seed/diabetesinfo/400/250', dataAiHint: 'health book', href:'/health-hub/cont_002' },
  { id: 'cont_003', title: 'Healthy Eating Video', type: 'video', category: 'Nutrition', language: 'english', status: 'draft', publishDate: formatDate(new Date(2023, 7, 1)), summary: 'Learn about healthy eating.', image: 'https://picsum.photos/seed/healthyeatingvideo/400/250', dataAiHint: 'vegetables', href:'/health-hub/cont_003' },
  { id: 'cont_004', title: 'FAQ: Common Cold', type: 'faq', category: 'General Health', language: 'english', status: 'published', publishDate: formatDate(new Date(2023, 5, 10)), summary: 'Answers about common cold.', image: 'https://picsum.photos/seed/commoncoldfaq/400/250', dataAiHint: 'tissue box', href:'/health-hub/cont_004' },
];

export const mockLocations: Location[] = [
  { id: 'loc_001', name: 'Bole Atlas Pharmacy', type: 'pharmacy', address: 'Atlas, Bole, Addis Ababa', contactNumber: '+251911111111', status: 'active', services: ['Prescription Filling', 'OTC Sales', 'Health Consultation'], lat: 9.005405, lng: 38.763611 },
  { id: 'loc_002', name: 'CMC Lab Services', type: 'lab', address: 'CMC, Addis Ababa', contactNumber: '+251922222222', status: 'active', services: ['Blood Test', 'Urine Test', 'COVID-19 PCR'], lat: 9.012345, lng: 38.789012 },
  { id: 'loc_003', name: 'Piassa Old Pharmacy', type: 'pharmacy', address: 'Piassa, Addis Ababa', contactNumber: '+251933333333', status: 'inactive', lat: 9.034567, lng: 38.751234 },
];

export const mockChatbotResponses: ChatbotResponse[] = [
  { id: 'cbr_001', queryPattern: 'order status *', responseEnglish: 'To check your order status, please provide your order ID.', responseAmharic: 'የትዕዛዝዎን ሁኔታ ለማወቅ፣ እባክዎ የትዕዛዝ ቁጥርዎን ያስገቡ።', language: 'both', lastUpdated: formatDate(today) },
  { id: 'cbr_002', queryPattern: 'delivery time?', responseEnglish: 'Delivery usually takes 1-3 business days within Addis Ababa.', responseAmharic: 'በአዲስ አበባ ውስጥ ማድረስ ብዙውን ጊዜ ከ1-3 የስራ ቀናት ይወስዳል።', language: 'both', lastUpdated: formatDate(new Date(2023, 11, 1)) },
];

export const mockChatbotLogs: ChatbotLog[] = [
  { id: 'log_001', timestamp: new Date(2024,0,28,10,30).toISOString(), query: 'What is my order status?', language: 'english', response: 'Please provide your order ID.', escalated: false },
  { id: 'log_002', timestamp: new Date(2024,0,28,11,15).toISOString(), query: 'የመድኃኒት ዋጋ ስንት ነው?', language: 'amharic', escalated: true },
];

export const mockGeneralSettings: GeneralSetting[] = [
  { key: 'site_name', value: 'EasyMeds Ethiopia', description: 'The public name of the platform.', type: 'string' },
  { key: 'default_currency', value: 'ETB', description: 'Default currency for transactions.', type: 'select', options: ['ETB', 'USD'] },
  { key: 'vat_rate', value: 15, description: 'Value Added Tax rate in percentage.', type: 'number' },
  { key: 'home_delivery_enabled', value: true, description: 'Enable/disable home delivery service.', type: 'boolean' },
];

export const mockSecurityLogs: SecurityLog[] = [
  { id: 'seclog_001', timestamp: new Date(2024,0,28,9,0).toISOString(), actor: 'usr_admin_001', action: 'Admin Login Success', status: 'success', ipAddress: '192.168.1.10' },
  { id: 'seclog_002', timestamp: new Date(2024,0,28,9,5).toISOString(), actor: 'unknown_user', action: 'Failed Login Attempt (user: nonexist@example.com)', status: 'failure', ipAddress: '10.0.0.5' },
  { id: 'seclog_003', timestamp: new Date(2024,0,27,14,30).toISOString(), actor: 'usr_pharmacist_001', action: 'Product Update (ID: prod_001)', status: 'success', details: 'Stock changed from 100 to 150.' },
];

export const mockPaymentGatewaySettings: PaymentGatewaySetting[] = [
    { id: 'pg_001', name: 'Chapa', apiKey: 'CHAPUBK_TEST_XXXXXXXXXXXX', secretKey: 'CHASECK_TEST_YYYYYYYYYYYY', isEnabled: true, environment: 'sandbox'},
    { id: 'pg_002', name: 'Telebirr', apiKey: 'TELEBIRR_APP_ID_ZZZZZ', secretKey: 'TELEBIRR_SECRET_KEY_AAAAA', isEnabled: false, environment: 'production'},
    { id: 'pg_003', name: 'Stripe', apiKey: 'pk_test_BBBBBBBBBBBBBB', secretKey: 'sk_test_CCCCCCCCCCCCCCCC', isEnabled: true, environment: 'sandbox'},
];

    
    
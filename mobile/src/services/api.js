import axios from 'axios';
import { Platform } from 'react-native';

// For Android Emulator, localhost is 10.0.2.2
const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000/api' : 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchHospitals = async (city = '', specialty = '') => {
  try {
    const params = {};
    if (city) params.city = city;
    if (specialty) params.specialty = specialty;
    const res = await api.get('/hospitals', { params });
    return res.data;
  } catch (err) {
    console.warn('API connection offline, using fallback hospital data', err.message);
    return [
      { id: 1, name: 'AIIMS New Delhi', city: 'Delhi', state: 'Delhi', rating: 4.9, specialty: 'Cardiology, Oncology, Neurology', bed_capacity: 2200, contact_phone: '+91 11 2658 8500', is_verified: true },
      { id: 2, name: 'Apollo Hospital', city: 'Chennai', state: 'Tamil Nadu', rating: 4.8, specialty: 'Organ Transplant, Cardiology', bed_capacity: 1000, contact_phone: '+91 44 2829 0200', is_verified: true },
      { id: 3, name: 'Fortis Escorts Heart Institute', city: 'New Delhi', state: 'Delhi', rating: 4.7, specialty: 'Cardiac Surgery, Electrophysiology', bed_capacity: 310, contact_phone: '+91 11 4713 5000', is_verified: true },
      { id: 4, name: 'Manipal Hospital', city: 'Bengaluru', state: 'Karnataka', rating: 4.7, specialty: 'Orthopedics, Multi-Specialty', bed_capacity: 600, contact_phone: '+91 80 2502 4444', is_verified: true },
    ];
  }
};

export const fetchDoctors = async (specialty = '') => {
  try {
    const params = {};
    if (specialty) params.specialty = specialty;
    const res = await api.get('/doctors', { params });
    return res.data;
  } catch (err) {
    console.warn('API connection offline, using fallback doctor data', err.message);
    return [
      { id: 1, full_name: 'Dr. Naresh Trehan', specialty: 'Cardiovascular Surgery', experience_years: 40, qualification: 'MBBS, MD', city: 'Gurugram', hospital_name: 'Medanta - The Medicity', fee: 1500, rating: 4.9 },
      { id: 2, name: 'Dr. Ashok Rajgopal', specialty: 'Orthopedics & Joint Replacement', experience_years: 35, qualification: 'MS (Ortho), FRCS', city: 'Gurugram', hospital_name: 'Medanta', fee: 1400, rating: 4.8 },
      { id: 3, name: 'Dr. Devi Prasad Shetty', specialty: 'Cardiac Surgery', experience_years: 38, qualification: 'MS, FRCS', city: 'Bengaluru', hospital_name: 'Narayana Health', fee: 1200, rating: 4.9 },
      { id: 4, name: 'Dr. Arvinder Singh Soin', specialty: 'Liver Transplant & Hepatobiliary', experience_years: 30, qualification: 'MBBS, MS, FRCS', city: 'Delhi NCR', hospital_name: 'Medanta', fee: 1600, rating: 4.9 },
    ];
  }
};

export const fetchEmergencyContacts = async () => {
  return {
    ambulance: '102 / 108',
    national_helpline: '112',
    medical_alert_hotline: '+91 1800 11 2026',
    hospitals: [
      { name: 'AIIMS Emergency Ward', location: 'Ansari Nagar, New Delhi', distance: '1.2 km', phone: '+91 11 2658 8700' },
      { name: 'Apollo Emergency Care', location: 'Greams Road, Chennai', distance: '2.5 km', phone: '+91 44 2829 3333' },
      { name: 'Fortis Urgent Care', location: 'Okhla Road, New Delhi', distance: '3.1 km', phone: '+91 11 4713 5555' }
    ]
  };
};

export default api;

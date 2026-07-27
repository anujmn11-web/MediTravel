const cities = ['Nagpur', 'Bengaluru', 'Mumbai', 'Hyderabad'];
const firstNames = ['Aarav', 'Aditi', 'Ananya', 'Arjun', 'Asha', 'Bhargav', 'Chetan', 'Deepa', 'Divya', 'Gaurav', 'Harini', 'Ishaan', 'Jaya', 'Kavya', 'Kunal', 'Meera', 'Naina', 'Nikhil', 'Pallavi', 'Pranav', 'Priya', 'Rahul', 'Riya', 'Sanjay', 'Sayali', 'Shreya', 'Siddharth', 'Sneha', 'Tanvi', 'Tejas', 'Uma', 'Varun', 'Veda', 'Vikram', 'Vivek', 'Yash', 'Zara'];
const lastNames = ['Rao', 'Sharma', 'Verma', 'Iyer', 'Menon', 'Joshi', 'Patel', 'Bhatia', 'Reddy', 'Singh', 'Kapoor', 'Nair', 'Kumar', 'Desai', 'Chopra', 'Malhotra', 'Seth', 'Das', 'Gupta', 'Kulkarni', 'Dixit', 'Pillai', 'Bharadwaj', 'Srinivasan'];
const designations = [
  { designation: 'Cardiologist', specialty: 'Cardiology' },
  { designation: 'Neurologist', specialty: 'Neurology' },
  { designation: 'Orthopedic Surgeon', specialty: 'Orthopedics' },
  { designation: 'Pediatrician', specialty: 'Pediatrics' },
  { designation: 'Dermatologist', specialty: 'Dermatology' },
  { designation: 'General Physician', specialty: 'General Medicine' },
  { designation: 'Gynecologist', specialty: 'Gynecology' },
  { designation: 'Pulmonologist', specialty: 'Pulmonology' },
  { designation: 'Gastroenterologist', specialty: 'Gastroenterology' },
  { designation: 'Endocrinologist', specialty: 'Endocrinology' },
  { designation: 'Oncologist', specialty: 'Oncology' },
  { designation: 'Urologist', specialty: 'Urology' },
  { designation: 'Nephrologist', specialty: 'Nephrology' },
  { designation: 'ENT Specialist', specialty: 'ENT' },
  { designation: 'Psychiatrist', specialty: 'Psychiatry' },
];

const hospitalSeeds = [
  'Sanket Heart Centre',
  'NeuroCare Hospital',
  'OrthoPlus Institute',
  'Lifespan Clinic',
  'Aster Prime Clinic',
  'CityCare Hospital',
  'Fortis Care Centre',
  'MediFocus Hospital',
  'HealWell MultiSpecialty',
  'Harbor View Medical',
];

const availabilitySlots = [
  'Mon-Fri • 9 AM - 6 PM',
  'Daily • 8 AM - 7 PM',
  'Mon-Sat • 10 AM - 5 PM',
  'Daily • 9 AM - 8 PM',
  'Tue-Sun • 10 AM - 6 PM',
  'Mon-Fri • 8 AM - 4 PM',
  'Daily • 10 AM - 7 PM',
  'Mon-Sat • 9 AM - 5 PM',
];

export const doctors = cities.flatMap((city, cityIndex) =>
  Array.from({ length: 50 }, (_, index) => {
    const base = designations[(cityIndex + index) % designations.length];
    const firstName = firstNames[(cityIndex * 10 + index) % firstNames.length];
    const lastName = lastNames[(cityIndex * 5 + index) % lastNames.length];
    const hospital = hospitalSeeds[(cityIndex + index) % hospitalSeeds.length];
    const availability = availabilitySlots[index % availabilitySlots.length];
    const experienceYears = 6 + ((cityIndex + index) % 12);
    const rating = (4.5 + ((index + cityIndex) % 5) * 0.1).toFixed(1);

    return {
      id: cityIndex * 50 + index + 1,
      name: `Dr. ${firstName} ${lastName}`,
      designation: base.designation,
      specialty: base.specialty,
      city,
      location: `${hospital}, ${city}`,
      availability,
      experience: `${experienceYears} years`,
      rating,
    };
  }),
);

export const hospitals = [
  {
    id: 1,
    name: 'Aster MedCity',
    city: 'Nagpur',
    type: 'Multi-specialty',
    address: 'Wardha Road medical district, Nagpur, Maharashtra',
    phone: '+91 712 240 4400',
    distance: '4.2 km from city center',
    coordinates: { lat: 21.1458, lng: 79.0882 },
    description: 'Advanced diagnostics and trauma support with 24/7 emergency services.',
    services: ['Emergency', 'ICU', 'Cardiology'],
  },
  {
    id: 2,
    name: 'Narayana Health',
    city: 'Bengaluru',
    type: 'Specialty',
    address: 'Bommasandra health campus, Bengaluru, Karnataka',
    phone: '+91 806 750 6900',
    distance: '6.8 km from city center',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    description: 'High-capacity hospital network with critical care and surgical excellence.',
    services: ['Neurology', 'Oncology', 'Intensive Care'],
  },
  {
    id: 3,
    name: 'Lilavati Hospital',
    city: 'Mumbai',
    type: 'Comprehensive',
    address: 'Bandra Reclamation, Mumbai, Maharashtra',
    phone: '+91 222 675 1000',
    distance: '3.5 km from city center',
    coordinates: { lat: 19.076, lng: 72.8777 },
    description: 'Trusted hospital for planned care, cardiac services, and urgent care.',
    services: ['Orthopedics', 'Pediatrics', 'Maternity'],
  },
  {
    id: 4,
    name: 'Continental Hospital',
    city: 'Hyderabad',
    type: 'Multi-specialty',
    address: 'Financial District, Hyderabad, Telangana',
    phone: '+91 406 700 0000',
    distance: '5.1 km from city center',
    coordinates: { lat: 17.385, lng: 78.4867 },
    description: 'International-standard care with integrated emergency and diagnostic care.',
    services: ['Pulmonology', 'General Medicine', 'Trauma'],
  },
];

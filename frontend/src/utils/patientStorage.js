const PATIENTS_KEY = 'meditravelPatients';
const CURRENT_PATIENT_KEY = 'meditravelCurrentPatientEmail';

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function loadPatients() {
  if (!canUseStorage()) return [];

  try {
    const savedPatients = window.localStorage.getItem(PATIENTS_KEY);
    const patients = savedPatients ? JSON.parse(savedPatients) : [];
    return Array.isArray(patients) ? patients : [];
  } catch {
    return [];
  }
}

export function savePatients(patients) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
}

export function findPatient(email) {
  const normalizedEmail = email.trim().toLowerCase();
  return loadPatients().find((patient) => patient.email === normalizedEmail) || null;
}

export function saveCurrentPatient(patient) {
  if (!canUseStorage()) return patient;

  const patients = loadPatients();
  const nextPatients = patients.some((savedPatient) => savedPatient.email === patient.email)
    ? patients.map((savedPatient) => (savedPatient.email === patient.email ? patient : savedPatient))
    : [patient, ...patients];

  savePatients(nextPatients);
  window.localStorage.setItem(CURRENT_PATIENT_KEY, patient.email);
  return patient;
}

export function loadCurrentPatient() {
  if (!canUseStorage()) return null;

  const currentPatientEmail = window.localStorage.getItem(CURRENT_PATIENT_KEY);
  if (!currentPatientEmail) return null;
  return findPatient(currentPatientEmail);
}

export function clearCurrentPatient() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(CURRENT_PATIENT_KEY);
}

export function createCondition(name, details = '') {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: name.trim(),
    details: details.trim(),
    addedAt: new Date().toISOString(),
  };
}

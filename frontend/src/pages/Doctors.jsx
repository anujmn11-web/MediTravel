import { useEffect, useMemo, useState } from 'react';
import { FaCalendarCheck, FaCheckCircle, FaExclamationCircle, FaSpinner, FaStar, FaTimes } from 'react-icons/fa';
import SectionHeader from '../components/SectionHeader';
import { doctors } from '../data/content';

const cityOptions = ['All', 'Nagpur', 'Bengaluru', 'Mumbai', 'Hyderabad'];
const timeSlots = ['09:00 AM', '10:30 AM', '12:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'];
const emptyDraft = {
  patientName: '',
  phone: '',
  date: '',
  time: '',
  concern: '',
};

function getTodayDate() {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().split('T')[0];
}

function readSavedAppointments() {
  if (typeof window === 'undefined') return [];

  try {
    const savedAppointments = window.localStorage.getItem('meditravelAppointments');
    const parsedAppointments = savedAppointments ? JSON.parse(savedAppointments) : [];
    return Array.isArray(parsedAppointments) ? parsedAppointments : [];
  } catch {
    return [];
  }
}

function saveAppointments(appointments) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('meditravelAppointments', JSON.stringify(appointments));
}

function Doctors() {
  const today = useMemo(() => getTodayDate(), []);
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [appointments, setAppointments] = useState(readSavedAppointments);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredDoctors = useMemo(() => {
    const search = query.trim().toLowerCase();

    const results = doctors.filter((doctor) => {
      const matchesCity = city === 'All' || doctor.city === city;
      const searchableValues = [doctor.name, doctor.designation, doctor.specialty, doctor.city, doctor.location];
      const matchesSearch = !search || searchableValues.some((value) => value.toLowerCase().includes(search));
      return matchesCity && matchesSearch;
    });

    return [...results].sort((a, b) => {
      if (sortBy === 'rating') return Number(b.rating) - Number(a.rating);
      if (sortBy === 'experience') return Number(b.experience.split(' ')[0]) - Number(a.experience.split(' ')[0]);
      if (sortBy === 'designation') return a.designation.localeCompare(b.designation);
      if (sortBy === 'city') return a.city.localeCompare(b.city);
      return a.name.localeCompare(b.name);
    });
  }, [city, query, sortBy]);

  const bookedDoctorIds = useMemo(() => new Set(appointments.map((appointment) => appointment.doctorId)), [appointments]);

  const validateAppointment = () => {
    const nextErrors = {};
    const phoneDigits = draft.phone.replace(/\D/g, '');

    if (!draft.patientName.trim()) nextErrors.patientName = 'Enter patient name.';
    if (phoneDigits.length < 10) nextErrors.phone = 'Enter a valid phone number.';
    if (!draft.date) nextErrors.date = 'Choose an appointment date.';
    if (draft.date && draft.date < today) nextErrors.date = 'Choose today or a future date.';
    if (!draft.time) nextErrors.time = 'Choose a time slot.';
    if (draft.concern.trim().length < 6) nextErrors.concern = 'Add a short visit reason.';

    return nextErrors;
  };

  const openBooking = (doctor) => {
    setSelectedDoctor(doctor);
    setDraft({ ...emptyDraft, date: today });
    setErrors({});
  };

  const closeBooking = () => {
    if (isSubmitting) return;
    setSelectedDoctor(null);
    setErrors({});
  };

  const handleDraftChange = (event) => {
    const { name, value } = event.target;

    setDraft((currentDraft) => ({ ...currentDraft, [name]: value }));
    setErrors((currentErrors) => {
      if (!currentErrors[name]) return currentErrors;
      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const handleAppointmentSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateAppointment();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setToast({ type: 'error', message: 'Please fix the highlighted appointment details.' });
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      const appointment = {
        id: `${selectedDoctor.id}-${Date.now()}`,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        designation: selectedDoctor.designation,
        city: selectedDoctor.city,
        location: selectedDoctor.location,
        patientName: draft.patientName.trim(),
        phone: draft.phone.trim(),
        date: draft.date,
        time: draft.time,
        concern: draft.concern.trim(),
        createdAt: new Date().toISOString(),
      };

      setAppointments((currentAppointments) => {
        const nextAppointments = [appointment, ...currentAppointments].slice(0, 5);
        saveAppointments(nextAppointments);
        return nextAppointments;
      });
      setIsSubmitting(false);
      setSelectedDoctor(null);
      setDraft(emptyDraft);
      setToast({ type: 'success', message: `Appointment request sent to ${selectedDoctor.name}.` });
    }, 650);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Find Doctors" title="Browse healthcare specialists across Nagpur, Bengaluru, Mumbai, and Hyderabad." description="Search by name, specialty, designation, or city to explore verified doctors with clear availability and experience details." />
        <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Available doctors</h2>
              <p className="mt-2 text-sm text-slate-600">Showing {filteredDoctors.length} specialists across the selected city and search criteria.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[42rem]">
              <select value={city} onChange={(event) => setCity(event.target.value)} className="w-full rounded-full border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100">
                {cityOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="w-full rounded-full border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100">
                <option value="rating">Sort by rating</option>
                <option value="experience">Sort by experience</option>
                <option value="name">Sort by name</option>
                <option value="designation">Sort by designation</option>
                <option value="city">Sort by city</option>
              </select>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search doctor or specialty" className="w-full rounded-full border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100" />
            </div>
          </div>

          {appointments.length > 0 && (
            <section className="mt-8 rounded-3xl border border-teal-100 bg-teal-50 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Recent appointment requests</h3>
                  <p className="mt-1 text-sm text-slate-600">{appointments.length} saved locally for this demo.</p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {appointments.slice(0, 2).map((appointment) => (
                    <div key={appointment.id} className="rounded-2xl border border-teal-100 bg-white px-4 py-3 text-sm">
                      <p className="font-semibold text-slate-900">{appointment.doctorName}</p>
                      <p className="mt-1 text-slate-600">{appointment.date} at {appointment.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {filteredDoctors.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-600">No doctors matched your search. Try another city or keyword.</div>
          ) : (
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {filteredDoctors.map((doctor) => {
                const hasAppointment = bookedDoctorIds.has(doctor.id);

                return (
                  <article key={doctor.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{doctor.name}</h3>
                        <p className="mt-2 text-sm font-medium text-teal-600">{doctor.designation}</p>
                        <p className="text-sm text-slate-500">{doctor.specialty}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-700">
                        <FaStar className="h-3.5 w-3.5" />
                        {doctor.rating}
                      </span>
                    </div>
                    <div className="mt-6 space-y-3 text-sm text-slate-600">
                      <p><span className="font-semibold text-slate-900">City:</span> {doctor.city}</p>
                      <p><span className="font-semibold text-slate-900">Location:</span> {doctor.location}</p>
                      <p><span className="font-semibold text-slate-900">Availability:</span> {doctor.availability}</p>
                      <p><span className="font-semibold text-slate-900">Experience:</span> {doctor.experience}</p>
                    </div>
                    <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className={`text-sm font-medium ${hasAppointment ? 'text-teal-700' : 'text-slate-500'}`}>
                        {hasAppointment ? 'Request saved' : 'Open slots available'}
                      </p>
                      <button type="button" onClick={() => openBooking(doctor)} className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-100 transition hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-100">
                        <FaCalendarCheck />
                        Book appointment
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedDoctor && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-labelledby="appointment-title">
          <section className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">Appointment</p>
                <h2 id="appointment-title" className="mt-2 text-2xl font-semibold text-slate-900">{selectedDoctor.name}</h2>
                <p className="mt-2 text-sm text-slate-600">{selectedDoctor.designation} at {selectedDoctor.location}</p>
              </div>
              <button type="button" onClick={closeBooking} className="rounded-full border border-slate-200 p-3 text-slate-500 transition hover:border-slate-300 hover:text-slate-800" aria-label="Close appointment form">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAppointmentSubmit} className="mt-8 grid gap-5">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Patient name
                <input name="patientName" value={draft.patientName} onChange={handleDraftChange} className={`rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-teal-100 ${errors.patientName ? 'border-rose-400' : 'border-slate-300 focus:border-teal-500'}`} placeholder="Full name" />
                {errors.patientName && <span className="text-xs font-medium text-rose-600">{errors.patientName}</span>}
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Phone number
                  <input name="phone" value={draft.phone} onChange={handleDraftChange} className={`rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-teal-100 ${errors.phone ? 'border-rose-400' : 'border-slate-300 focus:border-teal-500'}`} placeholder="+91 98765 43210" />
                  {errors.phone && <span className="text-xs font-medium text-rose-600">{errors.phone}</span>}
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Date
                  <input type="date" name="date" min={today} value={draft.date} onChange={handleDraftChange} className={`rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-teal-100 ${errors.date ? 'border-rose-400' : 'border-slate-300 focus:border-teal-500'}`} />
                  {errors.date && <span className="text-xs font-medium text-rose-600">{errors.date}</span>}
                </label>
              </div>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Time slot
                <select name="time" value={draft.time} onChange={handleDraftChange} className={`rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-teal-100 ${errors.time ? 'border-rose-400' : 'border-slate-300 focus:border-teal-500'}`}>
                  <option value="">Select slot</option>
                  {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                </select>
                {errors.time && <span className="text-xs font-medium text-rose-600">{errors.time}</span>}
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Visit reason
                <textarea name="concern" rows="4" value={draft.concern} onChange={handleDraftChange} className={`resize-none rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-teal-100 ${errors.concern ? 'border-rose-400' : 'border-slate-300 focus:border-teal-500'}`} placeholder="Briefly describe symptoms or consultation need" />
                {errors.concern && <span className="text-xs font-medium text-rose-600">{errors.concern}</span>}
              </label>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeBooking} className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-100 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-teal-400">
                  {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaCalendarCheck />}
                  {isSubmitting ? 'Sending request' : 'Send request'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {toast && (
        <div className={`fixed right-4 top-24 z-[80] flex max-w-sm items-start gap-3 rounded-2xl border bg-white p-4 text-sm shadow-xl ${toast.type === 'success' ? 'border-teal-100 text-teal-800' : 'border-rose-100 text-rose-700'}`} role="status">
          {toast.type === 'success' ? <FaCheckCircle className="mt-0.5 shrink-0" /> : <FaExclamationCircle className="mt-0.5 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}
    </main>
  );
}

export default Doctors;

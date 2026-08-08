import { useEffect, useMemo, useRef, useState } from 'react';
import { FaCalendarCheck, FaCheckCircle, FaExclamationCircle, FaSpinner, FaStar, FaTimes } from 'react-icons/fa';
import SectionHeader from '../components/SectionHeader';
import { doctors, getCitiesForState, INDIA_STATES } from '../data/content';

const timeSlots = ['09:00 AM', '10:30 AM', '12:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'];
const emptyDraft = {
  patientName: '',
  phone: '',
  date: '',
  time: '',
  concern: '',
};

const TIER_LABELS = { 1: 'Metro', 2: 'Major City', 3: 'Town' };
const TIER_COLORS = {
  1: 'bg-violet-100 text-violet-700',
  2: 'bg-sky-100 text-sky-700',
  3: 'bg-amber-100 text-amber-700',
};

function getTodayDate() {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().split('T')[0];
}

function readSavedAppointments() {
  if (typeof window === 'undefined') return [];
  try {
    const saved = window.localStorage.getItem('meditravelAppointments');
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
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

  // Filters
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [rawQuery, setRawQuery] = useState('');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  // Pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  // Booking
  const [appointments, setAppointments] = useState(readSavedAppointments);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Debounce search
  const debounceRef = useRef(null);
  const handleQueryChange = (e) => {
    const value = e.target.value;
    setRawQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQuery(value);
      setPage(1);
    }, 220);
  };

  // When state changes: reset city and page
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCity('');
    setPage(1);
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setPage(1);
  };

  const cityOptions = useMemo(
    () => (selectedState ? getCitiesForState(selectedState) : []),
    [selectedState],
  );

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredDoctors = useMemo(() => {
    const search = query.trim().toLowerCase();

    const results = doctors.filter((doctor) => {
      const matchesState = !selectedState || doctor.state === selectedState;
      const matchesCity = !selectedCity || doctor.city === selectedCity;
      const searchableValues = [
        doctor.name, doctor.designation, doctor.specialty,
        doctor.state, doctor.city, doctor.location,
      ];
      const matchesSearch = !search || searchableValues.some((v) => v.toLowerCase().includes(search));
      return matchesState && matchesCity && matchesSearch;
    });

    return [...results].sort((a, b) => {
      if (sortBy === 'rating') return Number(b.rating) - Number(a.rating);
      if (sortBy === 'experience') return Number(b.experience.split(' ')[0]) - Number(a.experience.split(' ')[0]);
      if (sortBy === 'designation') return a.designation.localeCompare(b.designation);
      if (sortBy === 'state') return a.state.localeCompare(b.state);
      if (sortBy === 'city') return a.city.localeCompare(b.city);
      return a.name.localeCompare(b.name);
    });
  }, [selectedState, selectedCity, query, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredDoctors.length / PAGE_SIZE));
  const pagedDoctors = filteredDoctors.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const bookedDoctorIds = useMemo(
    () => new Set(appointments.map((a) => a.doctorId)),
    [appointments],
  );

  // Booking helpers
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
    setDraft((d) => ({ ...d, [name]: value }));
    setErrors((e) => {
      if (!e[name]) return e;
      const next = { ...e };
      delete next[name];
      return next;
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
        state: selectedDoctor.state,
        city: selectedDoctor.city,
        location: selectedDoctor.location,
        patientName: draft.patientName.trim(),
        phone: draft.phone.trim(),
        date: draft.date,
        time: draft.time,
        concern: draft.concern.trim(),
        createdAt: new Date().toISOString(),
      };

      setAppointments((current) => {
        const next = [appointment, ...current].slice(0, 5);
        saveAppointments(next);
        return next;
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
        <SectionHeader
          eyebrow="Find Doctors"
          title="Browse healthcare specialists across all of India."
          description="Search by name, specialty, designation, state or city to discover 350+ verified doctors with clear availability and experience details."
        />

        <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Filters row */}
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Available doctors</h2>
              <p className="mt-2 text-sm text-slate-600">
                Showing <span className="font-semibold text-teal-700">{filteredDoctors.length}</span> specialists
                {selectedState ? ` in ${selectedCity || selectedState}` : ' across all of India'}.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:min-w-[56rem]">
              {/* State */}
              <select
                id="filter-state"
                value={selectedState}
                onChange={handleStateChange}
                className="w-full rounded-full border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              >
                <option value="">All States / UTs</option>
                {INDIA_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              {/* City (cascades from state) */}
              <select
                id="filter-city"
                value={selectedCity}
                onChange={handleCityChange}
                disabled={!selectedState}
                className="w-full rounded-full border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">All Cities</option>
                {cityOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                id="filter-sort"
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="w-full rounded-full border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              >
                <option value="rating">Sort by Rating</option>
                <option value="experience">Sort by Experience</option>
                <option value="name">Sort by Name</option>
                <option value="designation">Sort by Specialty</option>
                <option value="state">Sort by State</option>
                <option value="city">Sort by City</option>
              </select>

              {/* Search */}
              <input
                id="filter-search"
                value={rawQuery}
                onChange={handleQueryChange}
                placeholder="Search doctor or specialty…"
                className="w-full rounded-full border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              />
            </div>
          </div>

          {/* Recent appointments strip */}
          {appointments.length > 0 && (
            <section className="mt-8 rounded-3xl border border-teal-100 bg-teal-50 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Recent appointment requests</h3>
                  <p className="mt-1 text-sm text-slate-600">{appointments.length} saved locally for this demo.</p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {appointments.slice(0, 2).map((appt) => (
                    <div key={appt.id} className="rounded-2xl border border-teal-100 bg-white px-4 py-3 text-sm">
                      <p className="font-semibold text-slate-900">{appt.doctorName}</p>
                      <p className="mt-1 text-slate-600">{appt.date} at {appt.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Doctor cards */}
          {pagedDoctors.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-600">
              No doctors matched your search. Try a different state, city or keyword.
            </div>
          ) : (
            <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {pagedDoctors.map((doctor) => {
                const hasAppointment = bookedDoctorIds.has(doctor.id);
                const tierColor = TIER_COLORS[doctor.tier] || TIER_COLORS[2];
                const tierLabel = TIER_LABELS[doctor.tier] || 'City';

                return (
                  <article key={doctor.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 flex flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-slate-900 truncate">{doctor.name}</h3>
                        <p className="mt-1 text-sm font-medium text-teal-600">{doctor.designation}</p>
                        <p className="text-xs text-slate-500">{doctor.specialty}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">
                          <FaStar className="h-3 w-3" />
                          {doctor.rating}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${tierColor}`}>
                          {tierLabel}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 space-y-2 text-sm text-slate-600 flex-1">
                      <p>
                        <span className="font-semibold text-slate-800">Location: </span>
                        {doctor.city}, {doctor.state}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-800">Hospital: </span>
                        {doctor.location}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-800">Availability: </span>
                        {doctor.availability}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-800">Experience: </span>
                        {doctor.experience}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className={`text-xs font-medium ${hasAppointment ? 'text-teal-700' : 'text-slate-500'}`}>
                        {hasAppointment ? '✓ Request saved' : 'Open slots available'}
                      </p>
                      <button
                        type="button"
                        onClick={() => openBooking(doctor)}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-100 transition hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-100"
                      >
                        <FaCalendarCheck />
                        Book
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-400 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const pageNum = totalPages <= 7
                  ? i + 1
                  : page <= 4
                    ? i + 1
                    : page >= totalPages - 3
                      ? totalPages - 6 + i
                      : page - 3 + i;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setPage(pageNum)}
                    className={`h-9 w-9 rounded-full text-sm font-semibold transition ${
                      page === pageNum
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-100'
                        : 'border border-slate-300 text-slate-700 hover:border-teal-400 hover:text-teal-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-400 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>
              <span className="text-xs text-slate-500 w-full text-center mt-1">
                Page {page} of {totalPages} · {filteredDoctors.length} results
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Booking modal */}
      {selectedDoctor && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="appointment-title"
        >
          <section className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">Appointment</p>
                <h2 id="appointment-title" className="mt-2 text-2xl font-semibold text-slate-900">
                  {selectedDoctor.name}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {selectedDoctor.designation} · {selectedDoctor.city}, {selectedDoctor.state}
                </p>
                <p className="mt-1 text-xs text-slate-500">{selectedDoctor.location}</p>
              </div>
              <button
                type="button"
                onClick={closeBooking}
                className="rounded-full border border-slate-200 p-3 text-slate-500 transition hover:border-slate-300 hover:text-slate-800"
                aria-label="Close appointment form"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAppointmentSubmit} className="mt-8 grid gap-5">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Patient name
                <input
                  name="patientName"
                  value={draft.patientName}
                  onChange={handleDraftChange}
                  className={`rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-teal-100 ${errors.patientName ? 'border-rose-400' : 'border-slate-300 focus:border-teal-500'}`}
                  placeholder="Full name"
                />
                {errors.patientName && <span className="text-xs font-medium text-rose-600">{errors.patientName}</span>}
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Phone number
                  <input
                    name="phone"
                    value={draft.phone}
                    onChange={handleDraftChange}
                    className={`rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-teal-100 ${errors.phone ? 'border-rose-400' : 'border-slate-300 focus:border-teal-500'}`}
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && <span className="text-xs font-medium text-rose-600">{errors.phone}</span>}
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Date
                  <input
                    type="date"
                    name="date"
                    min={today}
                    value={draft.date}
                    onChange={handleDraftChange}
                    className={`rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-teal-100 ${errors.date ? 'border-rose-400' : 'border-slate-300 focus:border-teal-500'}`}
                  />
                  {errors.date && <span className="text-xs font-medium text-rose-600">{errors.date}</span>}
                </label>
              </div>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Time slot
                <select
                  name="time"
                  value={draft.time}
                  onChange={handleDraftChange}
                  className={`rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-teal-100 ${errors.time ? 'border-rose-400' : 'border-slate-300 focus:border-teal-500'}`}
                >
                  <option value="">Select slot</option>
                  {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                </select>
                {errors.time && <span className="text-xs font-medium text-rose-600">{errors.time}</span>}
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Visit reason
                <textarea
                  name="concern"
                  rows="4"
                  value={draft.concern}
                  onChange={handleDraftChange}
                  className={`resize-none rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-teal-100 ${errors.concern ? 'border-rose-400' : 'border-slate-300 focus:border-teal-500'}`}
                  placeholder="Briefly describe symptoms or consultation need"
                />
                {errors.concern && <span className="text-xs font-medium text-rose-600">{errors.concern}</span>}
              </label>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeBooking}
                  className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-100 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-teal-400"
                >
                  {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaCalendarCheck />}
                  {isSubmitting ? 'Sending request…' : 'Send request'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed right-4 top-24 z-[80] flex max-w-sm items-start gap-3 rounded-2xl border bg-white p-4 text-sm shadow-xl ${
            toast.type === 'success' ? 'border-teal-100 text-teal-800' : 'border-rose-100 text-rose-700'
          }`}
          role="status"
        >
          {toast.type === 'success'
            ? <FaCheckCircle className="mt-0.5 shrink-0" />
            : <FaExclamationCircle className="mt-0.5 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}
    </main>
  );
}

export default Doctors;

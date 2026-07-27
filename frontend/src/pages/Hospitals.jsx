import { useEffect, useMemo, useState } from 'react';
import { FaDirections, FaHospital, FaMapMarkerAlt, FaPhoneAlt, FaSpinner } from 'react-icons/fa';
import SectionHeader from '../components/SectionHeader';
import { hospitals } from '../data/content';

const cityOptions = ['All', ...new Set(hospitals.map((hospital) => hospital.city))];
const mapDelta = 0.045;

function getMapUrl(hospital) {
  const { lat, lng } = hospital.coordinates;
  const bbox = [lng - mapDelta, lat - mapDelta, lng + mapDelta, lat + mapDelta].join(',');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
}

function getDirectionsUrl(hospital) {
  const query = encodeURIComponent(`${hospital.name}, ${hospital.address}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function getPhoneLink(phone) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

function Hospitals() {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('All');
  const [selectedHospitalId, setSelectedHospitalId] = useState(hospitals[0].id);
  const [isMapLoading, setIsMapLoading] = useState(true);

  const filteredHospitals = useMemo(() => {
    const search = query.trim().toLowerCase();

    return hospitals.filter((hospital) => {
      const matchesCity = city === 'All' || hospital.city === city;
      const searchableValues = [hospital.name, hospital.city, hospital.type, hospital.address, ...hospital.services];
      const matchesSearch = !search || searchableValues.some((value) => value.toLowerCase().includes(search));
      return matchesCity && matchesSearch;
    });
  }, [city, query]);

  useEffect(() => {
    if (filteredHospitals.length === 0) return;
    const selectedIsVisible = filteredHospitals.some((hospital) => hospital.id === selectedHospitalId);
    if (!selectedIsVisible) setSelectedHospitalId(filteredHospitals[0].id);
  }, [filteredHospitals, selectedHospitalId]);

  useEffect(() => {
    setIsMapLoading(true);
  }, [selectedHospitalId]);

  const selectedHospital = useMemo(
    () => hospitals.find((hospital) => hospital.id === selectedHospitalId) || hospitals[0],
    [selectedHospitalId],
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Hospitals" title="Trusted medical centers across major travel cities." description="View hospital profiles, map locations, directions, and emergency contact details from one place." />

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Hospital locator</h2>
                <p className="mt-2 text-sm text-slate-600">Showing {filteredHospitals.length} hospitals for the selected filters.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 md:min-w-[26rem]">
                <select value={city} onChange={(event) => setCity(event.target.value)} className="w-full rounded-full border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100">
                  {cityOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search hospital or service" className="w-full rounded-full border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100" />
              </div>
            </div>

            {filteredHospitals.length === 0 ? (
              <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-600">No hospitals matched your search. Try another city or care service.</div>
            ) : (
              <div className="mt-8 space-y-4">
                {filteredHospitals.map((hospital) => {
                  const isSelected = hospital.id === selectedHospital.id;

                  return (
                    <article key={hospital.id} className={`rounded-3xl border p-5 transition ${isSelected ? 'border-teal-300 bg-teal-50' : 'border-slate-200 bg-slate-50 hover:border-teal-200'}`}>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-teal-600 shadow-sm">
                              <FaHospital />
                            </span>
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">{hospital.name}</h3>
                              <p className="mt-1 text-sm font-medium text-teal-700">{hospital.city}</p>
                            </div>
                          </div>
                          <p className="mt-4 text-sm leading-7 text-slate-600">{hospital.description}</p>
                        </div>
                        <span className="w-fit rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">{hospital.type}</span>
                      </div>

                      <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                        <p className="flex items-start gap-2"><FaMapMarkerAlt className="mt-1 shrink-0 text-teal-600" />{hospital.address}</p>
                        <p className="flex items-start gap-2"><FaPhoneAlt className="mt-1 shrink-0 text-teal-600" />{hospital.phone}</p>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {hospital.services.map((service) => <span key={service} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600">{service}</span>)}
                      </div>

                      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <button type="button" onClick={() => setSelectedHospitalId(hospital.id)} className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-100 transition hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-100">
                          <FaMapMarkerAlt />
                          View map
                        </button>
                        <a href={getDirectionsUrl(hospital)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-500 hover:text-teal-700">
                          <FaDirections />
                          Directions
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">Map preview</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">{selectedHospital.name}</h2>
                <p className="mt-2 text-sm text-slate-600">{selectedHospital.distance}</p>
              </div>
              <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{selectedHospital.city}</span>
            </div>

            <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
              {isMapLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/85 text-sm font-semibold text-teal-700">
                  <FaSpinner className="mr-2 animate-spin" />
                  Loading map
                </div>
              )}
              <iframe
                key={selectedHospital.id}
                title={`${selectedHospital.name} map`}
                src={getMapUrl(selectedHospital)}
                onLoad={() => setIsMapLoading(false)}
                className="h-full w-full border-0"
                loading="lazy"
              />
            </div>

            <div className="mt-6 grid gap-4 text-sm text-slate-600">
              <p className="flex items-start gap-3"><FaMapMarkerAlt className="mt-1 shrink-0 text-teal-600" /><span>{selectedHospital.address}</span></p>
              <p className="flex items-start gap-3"><FaPhoneAlt className="mt-1 shrink-0 text-teal-600" /><span>{selectedHospital.phone}</span></p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href={getDirectionsUrl(selectedHospital)} target="_blank" rel="noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-100 transition hover:bg-teal-700">
                <FaDirections />
                Open directions
              </a>
              <a href={getPhoneLink(selectedHospital.phone)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-500 hover:text-teal-700">
                <FaPhoneAlt />
                Call hospital
              </a>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Hospitals;

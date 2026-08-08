import { useEffect, useMemo, useState } from 'react';
import { FaDirections, FaHospital, FaMapMarkerAlt, FaPhoneAlt, FaSpinner, FaLocationArrow, FaTimes, FaGlobeAsia } from 'react-icons/fa';
import SectionHeader from '../components/SectionHeader';
import { getCitiesForState, hospitals, INDIA_STATES, getLocationMeta } from '../data/content';

const mapDelta = 0.045;

const TIER_LABELS = { 1: 'Metro', 2: 'Major City', 3: 'Town' };
const TIER_COLORS = {
  1: 'bg-violet-100 text-violet-700',
  2: 'bg-sky-100 text-sky-700',
  3: 'bg-amber-100 text-amber-700',
};

// Haversine formula to compute distance in kilometers between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

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
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [query, setQuery] = useState('');
  const [selectedHospitalId, setSelectedHospitalId] = useState(hospitals[0].id);
  const [isMapLoading, setIsMapLoading] = useState(true);

  // Geolocation & Manual Reference States
  const [userCoords, setUserCoords] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const [locationMode, setLocationMode] = useState('gps'); // 'gps' | 'manual'

  // Manual selected state & city for coordinates
  const [manualState, setManualState] = useState('');
  const [manualCity, setManualCity] = useState('');

  const cityOptions = useMemo(
    () => (selectedState ? getCitiesForState(selectedState) : []),
    [selectedState],
  );

  const manualCityOptions = useMemo(
    () => (manualState ? getCitiesForState(manualState) : []),
    [manualState],
  );

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCity('');
  };

  const handleManualStateChange = (e) => {
    setManualState(e.target.value);
    setManualCity('');
  };

  // When manual city is picked, calculate coordinates
  const handleManualCityChange = (e) => {
    const city = e.target.value;
    setManualCity(city);
    if (!city) {
      setUserCoords(null);
      return;
    }
    const meta = getLocationMeta(manualState, city);
    if (meta && meta.coordinates) {
      setUserCoords({
        lat: meta.coordinates.lat,
        lng: meta.coordinates.lng,
        name: city,
        isManual: true,
      });
      setScanError('');
      // Clear filters so they see closest to their manually set location
      setSelectedState('');
      setSelectedCity('');
    } else {
      setScanError('Coordinates not found for this city.');
    }
  };

  const handleScanLocation = () => {
    if (!navigator.geolocation) {
      setScanError('Geolocation is not supported by your browser.');
      return;
    }

    setIsScanning(true);
    setScanError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          name: 'Your GPS location',
          isManual: false,
        });
        setIsScanning(false);
        // Clear filters to show nearest overall
        setSelectedState('');
        setSelectedCity('');
      },
      (error) => {
        setIsScanning(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setScanError('Location permission denied. Please allow location access or use Manual selection.');
            break;
          case error.POSITION_UNAVAILABLE:
            setScanError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setScanError('Location request timed out.');
            break;
          default:
            setScanError('An unknown error occurred while retrieving location.');
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleClearLocation = () => {
    setUserCoords(null);
    setScanError('');
    setManualState('');
    setManualCity('');
  };

  // Compute distance for all hospitals if location coordinates exist
  const hospitalsWithDistance = useMemo(() => {
    if (!userCoords) return hospitals;
    return hospitals.map((h) => {
      const distance = calculateDistance(
        userCoords.lat,
        userCoords.lng,
        h.coordinates.lat,
        h.coordinates.lng
      );
      return { ...h, calculatedDistance: distance };
    });
  }, [userCoords]);

  // Filter & Sort list of hospitals
  const filteredHospitals = useMemo(() => {
    const search = query.trim().toLowerCase();

    const results = hospitalsWithDistance.filter((hospital) => {
      const matchesState = !selectedState || hospital.state === selectedState;
      const matchesCity = !selectedCity || hospital.city === selectedCity;
      const searchableValues = [
        hospital.name,
        hospital.state,
        hospital.city,
        hospital.type,
        hospital.address,
        ...(hospital.services || []),
      ];
      const matchesSearch =
        !search || searchableValues.some((v) => v.toLowerCase().includes(search));
      return matchesState && matchesCity && matchesSearch;
    });

    // Sort by calculated distance if coords are present, otherwise preserve default DB order
    if (userCoords) {
      return [...results].sort((a, b) => a.calculatedDistance - b.calculatedDistance);
    }
    return results;
  }, [hospitalsWithDistance, selectedState, selectedCity, query, userCoords]);

  useEffect(() => {
    if (filteredHospitals.length === 0) return;
    const selectedIsVisible = filteredHospitals.some((h) => h.id === selectedHospitalId);
    if (!selectedIsVisible) setSelectedHospitalId(filteredHospitals[0].id);
  }, [filteredHospitals, selectedHospitalId]);

  useEffect(() => {
    setIsMapLoading(true);
  }, [selectedHospitalId]);

  const selectedHospital = useMemo(() => {
    const found = hospitalsWithDistance.find((h) => h.id === selectedHospitalId);
    return found || hospitalsWithDistance[0] || hospitals[0];
  }, [selectedHospitalId, hospitalsWithDistance]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Hospitals"
          title="Trusted medical centres across all of India."
          description="Scan your live coordinates or select a location manually to discover nearby hospitals, clinics, emergency facilities, and specialized care centres."
        />

        {/* Scan & Manual location selector widget */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Header tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setLocationMode('gps');
                handleClearLocation();
              }}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition ${
                locationMode === 'gps'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-white'
              }`}
            >
              <FaLocationArrow />
              ⚡ Live GPS Scan
            </button>
            <button
              type="button"
              onClick={() => {
                setLocationMode('manual');
                handleClearLocation();
              }}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition ${
                locationMode === 'manual'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-white'
              }`}
            >
              <FaGlobeAsia />
              📍 Manual Location Select
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-5 flex flex-col items-center justify-between gap-4 md:flex-row md:px-6">
            <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                {locationMode === 'gps' ? <FaLocationArrow className={isScanning ? 'animate-pulse' : ''} /> : <FaGlobeAsia />}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {locationMode === 'gps' ? 'Find nearest hospitals using GPS' : 'Set location manually to compute distances'}
                </h3>
                <p className="text-xs text-slate-500">
                  {userCoords
                    ? `Active point: ${userCoords.name} (${userCoords.lat.toFixed(3)}°, ${userCoords.lng.toFixed(3)}°)`
                    : locationMode === 'gps'
                    ? 'Let the browser locate you to calculate absolute distances to hospitals.'
                    : 'Select a State and City below to calculate distances relative to that city.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
              {scanError && (
                <span className="rounded-full bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs text-rose-700 font-medium max-w-xs truncate">
                  ⚠️ {scanError}
                </span>
              )}

              {/* GPS Scan Controls */}
              {locationMode === 'gps' && (
                userCoords ? (
                  <button
                    type="button"
                    onClick={handleClearLocation}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-rose-400 hover:text-rose-600"
                  >
                    <FaTimes />
                    Clear GPS location
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleScanLocation}
                    disabled={isScanning}
                    className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-teal-100 transition hover:bg-teal-700 disabled:bg-teal-400 disabled:cursor-not-allowed"
                  >
                    {isScanning ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Scanning location...
                      </>
                    ) : (
                      <>
                        <FaLocationArrow />
                        Scan current location
                      </>
                    )}
                  </button>
                )
              )}

              {/* Manual Selection Controls */}
              {locationMode === 'manual' && (
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <select
                    value={manualState}
                    onChange={handleManualStateChange}
                    className="rounded-full border border-slate-300 px-3 py-2 text-xs text-slate-700 outline-none focus:border-teal-500"
                  >
                    <option value="">Select State / UT</option>
                    {INDIA_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <select
                    value={manualCity}
                    onChange={handleManualCityChange}
                    disabled={!manualState}
                    className="rounded-full border border-slate-300 px-3 py-2 text-xs text-slate-700 outline-none focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">Select City</option>
                    {manualCityOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {userCoords && (
                    <button
                      type="button"
                      onClick={handleClearLocation}
                      className="rounded-full border border-slate-300 bg-white p-2 text-slate-600 hover:text-rose-600"
                      title="Clear location"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {/* Filter bar */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Hospital locator</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Showing <span className="font-semibold text-teal-700">{filteredHospitals.length}</span> hospitals
                  {userCoords
                    ? ` sorted by proximity to ${userCoords.name}`
                    : selectedState
                    ? ` in ${selectedCity || selectedState}`
                    : ' across India'}.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 md:min-w-[38rem]">
                {/* State */}
                <select
                  id="hospital-filter-state"
                  value={selectedState}
                  onChange={handleStateChange}
                  className="w-full rounded-full border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                >
                  <option value="">All States / UTs</option>
                  {INDIA_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                {/* City (cascades) */}
                <select
                  id="hospital-filter-city"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedState}
                  className="w-full rounded-full border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value="">All Cities</option>
                  {cityOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                {/* Search */}
                <input
                  id="hospital-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search hospital or service…"
                  className="w-full rounded-full border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                />
              </div>
            </div>

            {/* Hospital list */}
            {filteredHospitals.length === 0 ? (
              <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-600">
                No hospitals matched your search. Try a different state, city or service.
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {filteredHospitals.map((hospital) => {
                  const isSelected = hospital.id === selectedHospital.id;
                  const tierColor = TIER_COLORS[hospital.tier] || TIER_COLORS[2];
                  const tierLabel = TIER_LABELS[hospital.tier] || 'City';

                  return (
                    <article
                      key={hospital.id}
                      className={`rounded-3xl border p-5 transition ${
                        isSelected ? 'border-teal-300 bg-teal-50' : 'border-slate-200 bg-slate-50 hover:border-teal-200'
                      }`}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-teal-600 shadow-sm">
                              <FaHospital />
                            </span>
                            <div className="min-w-0">
                              <h3 className="text-base font-semibold text-slate-900 leading-snug">
                                {hospital.name}
                              </h3>
                              <p className="mt-0.5 text-sm font-medium text-teal-700">
                                {hospital.city}, {hospital.state}
                              </p>
                            </div>
                          </div>
                          <p className="mt-3 text-sm leading-7 text-slate-600">{hospital.description}</p>

                          {/* Distance warning/badge if active */}
                          {hospital.calculatedDistance !== undefined && (
                            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white w-fit">
                              📍 {hospital.calculatedDistance.toFixed(1)} km from {userCoords.name}
                            </span>
                          )}

                          {/* Tier-3 nearest major hospital note */}
                          {hospital.tier === 3 && hospital.nearestMajorCity && (
                            <p className="mt-2 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 inline-block">
                              ℹ️ Complex cases: nearest major hospital in {hospital.nearestMajorCity}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-start gap-2 sm:items-end shrink-0">
                          <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {hospital.type}
                          </span>
                          <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${tierColor}`}>
                            {tierLabel}
                          </span>
                          {hospital.accreditation && (
                            <span className="w-fit rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
                              {hospital.accreditation}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                        <p className="flex items-start gap-2">
                          <FaMapMarkerAlt className="mt-1 shrink-0 text-teal-600" />
                          {hospital.address}
                        </p>
                        <p className="flex items-start gap-2">
                          <FaPhoneAlt className="mt-1 shrink-0 text-teal-600" />
                          {hospital.phone}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {hospital.services.map((service) => (
                          <span
                            key={service}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600"
                          >
                            {service}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => setSelectedHospitalId(hospital.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-100 transition hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-100"
                        >
                          <FaMapMarkerAlt />
                          View map
                        </button>
                        <a
                          href={getDirectionsUrl(hospital)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-teal-500 hover:text-teal-700"
                        >
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

          {/* Map panel */}
          <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">Map preview</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">{selectedHospital.name}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedHospital.city}, {selectedHospital.state}
                </p>
                {selectedHospital.calculatedDistance !== undefined ? (
                  <p className="text-xs text-teal-600 font-semibold mt-1">
                    📍 {selectedHospital.calculatedDistance.toFixed(1)} km from {userCoords.name}
                  </p>
                ) : (
                  selectedHospital.distance && (
                    <p className="text-xs text-slate-400 mt-0.5">{selectedHospital.distance}</p>
                  )
                )}
              </div>
              <div className="flex flex-col gap-1.5 items-start sm:items-end shrink-0">
                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                    TIER_COLORS[selectedHospital.tier] || TIER_COLORS[2]
                  }`}
                >
                  {TIER_LABELS[selectedHospital.tier] || 'City'}
                </span>
                {selectedHospital.accreditation && (
                  <span className="w-fit rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    {selectedHospital.accreditation}
                  </span>
                )}
              </div>
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

            {selectedHospital.tier === 3 && selectedHospital.nearestMajorCity && (
              <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 font-medium">
                ℹ️ This is a tier-3 facility. For complex procedures, the nearest major hospital is in{' '}
                <strong>{selectedHospital.nearestMajorCity}</strong>.
              </div>
            )}

            <div className="mt-5 grid gap-3 text-sm text-slate-600">
              <p className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 shrink-0 text-teal-600" />
                <span>{selectedHospital.address}</span>
              </p>
              <p className="flex items-start gap-3">
                <FaPhoneAlt className="mt-1 shrink-0 text-teal-600" />
                <span>{selectedHospital.phone}</span>
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href={getDirectionsUrl(selectedHospital)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-100 transition hover:bg-teal-700"
              >
                <FaDirections />
                Open directions
              </a>
              <a
                href={getPhoneLink(selectedHospital.phone)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-500 hover:text-teal-700"
              >
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

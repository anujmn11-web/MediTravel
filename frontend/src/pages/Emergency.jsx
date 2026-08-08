import { useMemo, useState } from 'react';
import { FaAmbulance, FaHeartbeat, FaPhone, FaPhoneAlt, FaShieldAlt } from 'react-icons/fa';
import SectionHeader from '../components/SectionHeader';
import { INDIA_STATES, stateEmergencyNumbers } from '../data/content';

const nationalHotlines = [
  {
    name: 'National Emergency Number',
    number: '112',
    detail: 'Single national emergency helpline — police, fire, and ambulance. Works in every state and UT.',
    highlight: true,
  },
  {
    name: 'National Ambulance (General)',
    number: '108',
    detail: 'Government ambulance service available in most Indian states at no charge.',
    highlight: false,
  },
  {
    name: 'Travel Medical Hotline',
    number: '+91 1800 120 6000',
    detail: 'Dedicated advice for travelers and international visitors navigating Indian healthcare.',
    highlight: false,
  },
];

function Emergency() {
  const [selectedState, setSelectedState] = useState('');

  const stateNumbers = useMemo(
    () => (selectedState ? stateEmergencyNumbers[selectedState] || null : null),
    [selectedState],
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Emergency"
          title="Immediate assistance when every second matters."
          description="Access trusted national and state-specific emergency channels for medical situations anywhere in India."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left: contacts */}
          <div className="space-y-6">
            {/* National hotlines */}
            <div className="rounded-[2rem] border border-rose-100 bg-rose-50 p-8 shadow-sm">
              <div className="flex items-center gap-3 text-rose-700">
                <FaPhoneAlt />
                <h3 className="text-xl font-semibold">National emergency contacts</h3>
              </div>
              <div className="mt-6 space-y-4">
                {nationalHotlines.map((item) => (
                  <div
                    key={item.name}
                    className={`rounded-2xl border p-5 ${item.highlight ? 'border-rose-300 bg-rose-100' : 'border-rose-200 bg-white'}`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-base font-semibold text-slate-900">{item.name}</p>
                        <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                      </div>
                      <a
                        href={`tel:${item.number.replace(/[^\d+]/g, '')}`}
                        className={`inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                          item.highlight
                            ? 'bg-rose-600 text-white shadow-md shadow-rose-200 hover:bg-rose-700'
                            : 'border border-rose-200 bg-white text-rose-700 hover:border-rose-400'
                        }`}
                      >
                        <FaPhone />
                        {item.number}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* State-specific numbers */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 text-teal-700">
                <FaAmbulance />
                <h3 className="text-xl font-semibold">State-specific emergency numbers</h3>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Select your state to see the local ambulance and helpline numbers.
              </p>

              <select
                id="emergency-state-picker"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="mt-5 w-full rounded-full border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              >
                <option value="">Select a state or UT…</option>
                {INDIA_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              {selectedState && (
                <div className="mt-5">
                  {stateNumbers ? (
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        { label: 'Ambulance', number: stateNumbers.ambulance, color: 'rose' },
                        { label: 'Police',    number: stateNumbers.police,    color: 'blue' },
                        { label: 'Helpline',  number: stateNumbers.helpline,  color: 'teal' },
                      ].map(({ label, number, color }) => (
                        <div
                          key={label}
                          className={`rounded-2xl border bg-${color}-50 border-${color}-200 p-4 text-center`}
                        >
                          <p className={`text-xs font-semibold uppercase tracking-wide text-${color}-600`}>{label}</p>
                          <a
                            href={`tel:${number}`}
                            className={`mt-2 block text-2xl font-bold text-${color}-700 hover:underline`}
                          >
                            {number}
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                      No specific mapping found for <strong>{selectedState}</strong>. Use the national number{' '}
                      <a href="tel:112" className="font-bold text-rose-600 hover:underline">112</a>.
                    </div>
                  )}
                  <p className="mt-3 text-xs text-slate-500">
                    Numbers sourced from government directories. Always verify locally.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: context panels */}
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 text-teal-700">
                <FaShieldAlt />
                <h3 className="text-xl font-semibold">Why MediTravel AI helps</h3>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                The platform combines rapid triage guidance, hospital coordination, and support resources
                to keep patients and travelers informed during urgent moments — whether you're in a tier-1
                metro or a remote tier-3 town.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-900 p-8 text-white shadow-sm">
              <div className="flex items-center gap-3 text-teal-300">
                <FaHeartbeat />
                <h3 className="text-xl font-semibold">Fast care coordination</h3>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Reach local emergency support, navigate nearby hospitals, and prepare for next steps
                without losing time — from Kashmir to Kanyakumari.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-center text-sm">
                {[
                  ['36', 'States & UTs'],
                  ['350+', 'Listed Doctors'],
                  ['38+', 'Hospitals'],
                  ['112', 'National SOS'],
                ].map(([stat, label]) => (
                  <div key={label} className="rounded-2xl bg-white/10 px-4 py-3">
                    <p className="text-xl font-bold text-teal-300">{stat}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Emergency;

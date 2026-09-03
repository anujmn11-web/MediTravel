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
    <main style={{ backgroundColor: 'var(--color-bg)' }} className="min-h-screen px-4 py-20 sm:px-6 lg:px-8 transition-colors">
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
            <div style={{ borderColor: 'var(--color-danger-light)', backgroundColor: 'var(--color-danger-light)' }} className="rounded-[2rem] border p-8 shadow-sm">
              <div style={{ color: 'var(--color-danger)' }} className="flex items-center gap-3">
                <FaPhoneAlt />
                <h3 className="text-xl font-semibold">National emergency contacts</h3>
              </div>
              <div className="mt-6 space-y-4">
                {nationalHotlines.map((item) => (
                  <div
                    key={item.name}
                    style={{
                      borderColor: item.highlight ? 'var(--color-danger)' : 'var(--color-border)',
                      backgroundColor: item.highlight ? 'rgba(220, 38, 38, 0.1)' : 'var(--color-surface)',
                    }}
                    className="rounded-2xl border p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p style={{ color: 'var(--color-text)' }} className="text-base font-semibold">{item.name}</p>
                        <p style={{ color: 'var(--color-text-secondary)' }} className="mt-1 text-sm">{item.detail}</p>
                      </div>
                      <a
                        href={`tel:${item.number.replace(/[^\d+]/g, '')}`}
                        style={{
                          backgroundColor: item.highlight ? 'var(--color-danger)' : 'transparent',
                          borderColor: 'var(--color-border)',
                          color: item.highlight ? 'white' : 'var(--color-danger)',
                        }}
                        className={`inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                          item.highlight ? 'shadow-md hover:opacity-90' : 'border hover:border-[var(--color-danger)]'
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
            <div style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }} className="rounded-[2rem] border p-8 shadow-sm">
              <div style={{ color: 'var(--color-accent)' }} className="flex items-center gap-3">
                <FaAmbulance />
                <h3 className="text-xl font-semibold">State-specific emergency numbers</h3>
              </div>
              <p style={{ color: 'var(--color-text-secondary)' }} className="mt-2 text-sm">
                Select your state to see the local ambulance and helpline numbers.
              </p>

              <select
                id="emergency-state-picker"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                className="mt-5 w-full rounded-full border px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent)] focus:ring-4"
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
                        { label: 'Ambulance', number: stateNumbers.ambulance, color: 'var(--color-danger)', lightColor: 'var(--color-danger-light)' },
                        { label: 'Police', number: stateNumbers.police, color: 'var(--color-info)', lightColor: 'var(--color-info-light)' },
                        { label: 'Helpline', number: stateNumbers.helpline, color: 'var(--color-accent)', lightColor: 'var(--color-accent-light)' },
                      ].map(({ label, number, color, lightColor }) => (
                        <div
                          key={label}
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: color }}
                          className="rounded-2xl border p-4 text-center"
                        >
                          <p style={{ color: color }} className="text-xs font-semibold uppercase tracking-wide">{label}</p>
                          <a
                            href={`tel:${number}`}
                            style={{ color: color }}
                            className="mt-2 block text-2xl font-bold hover:underline"
                          >
                            {number}
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }} className="rounded-2xl border p-4 text-sm">
                      No specific mapping found for <strong>{selectedState}</strong>. Use the national number{' '}
                      <a href="tel:112" style={{ color: 'var(--color-danger)' }} className="font-bold hover:underline">112</a>.
                    </div>
                  )}
                  <p style={{ color: 'var(--color-text-light)' }} className="mt-3 text-xs">
                    Numbers sourced from government directories. Always verify locally.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: context panels */}
          <div className="space-y-6">
            <div style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }} className="rounded-[2rem] border p-8 shadow-sm">
              <div style={{ color: 'var(--color-accent)' }} className="flex items-center gap-3">
                <FaShieldAlt />
                <h3 className="text-xl font-semibold">Why MediTravel AI helps</h3>
              </div>
              <p style={{ color: 'var(--color-text-secondary)' }} className="mt-4 text-sm leading-7">
                The platform combines rapid triage guidance, hospital coordination, and support resources
                to keep patients and travelers informed during urgent moments — whether you're in a tier-1
                metro or a remote tier-3 town.
              </p>
            </div>

            <div style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }} className="rounded-[2rem] border p-8 shadow-sm">
              <div style={{ color: 'var(--color-accent)' }} className="flex items-center gap-3">
                <FaHeartbeat />
                <h3 style={{ color: 'var(--color-text)' }} className="text-xl font-semibold">Fast care coordination</h3>
              </div>
              <p style={{ color: 'var(--color-text-secondary)' }} className="mt-4 text-sm leading-7">
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
                  <div key={label} style={{ backgroundColor: 'rgba(var(--color-accent), 0.1)', borderColor: 'var(--color-border)' }} className="rounded-2xl border px-4 py-3">
                    <p style={{ color: 'var(--color-accent)' }} className="text-xl font-bold">{stat}</p>
                    <p style={{ color: 'var(--color-text-light)' }} className="mt-0.5 text-xs">{label}</p>
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

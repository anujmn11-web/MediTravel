import { FaPhoneAlt, FaShieldAlt, FaHeartbeat } from 'react-icons/fa';
import SectionHeader from '../components/SectionHeader';

const hotlines = [
  { name: 'National Emergency', number: '112', detail: 'Immediate emergency response and ambulance dispatch.' },
  { name: 'Travel Medical Hotline', number: '+91 1800 120 6000', detail: 'Dedicated advice for travelers and international visitors.' },
  { name: 'Critical Care Desk', number: '+91 9999 999 999', detail: 'Priority support for urgent specialist communication.' },
];

function Emergency() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Emergency" title="Immediate assistance when every second matters." description="Access trusted emergency channels and quick support for medical situations while traveling." />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-rose-100 bg-rose-50 p-8 shadow-sm">
            <div className="flex items-center gap-3 text-rose-700"><FaPhoneAlt /><h3 className="text-xl font-semibold">Emergency contacts</h3></div>
            <div className="mt-8 space-y-4">
              {hotlines.map((item) => (
                <div key={item.name} className="rounded-2xl border border-rose-200 bg-white p-5">
                  <p className="text-lg font-semibold text-slate-900">{item.name}</p>
                  <p className="mt-2 text-sm font-medium text-rose-600">{item.number}</p>
                  <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 text-teal-700"><FaShieldAlt /><h3 className="text-xl font-semibold">Why MediTravel AI helps</h3></div>
              <p className="mt-4 text-sm leading-7 text-slate-600">The platform combines rapid triage guidance, hospital coordination, and support resources to keep travelers informed during urgent moments.</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-slate-900 p-8 text-white shadow-sm">
              <div className="flex items-center gap-3 text-teal-300"><FaHeartbeat /><h3 className="text-xl font-semibold">Fast care coordination</h3></div>
              <p className="mt-4 text-sm leading-7 text-slate-300">Reach local emergency support, navigate nearby clinics, and prepare for the next step without losing time.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Emergency;

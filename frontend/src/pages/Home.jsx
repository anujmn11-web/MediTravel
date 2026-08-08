import { FaStethoscope, FaMapMarkedAlt, FaBrain, FaAmbulance } from 'react-icons/fa';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';

const features = [
  { title: 'Verified Doctors', description: 'Find trusted healthcare professionals with transparent credentials and patient-focused care.', icon: FaStethoscope, accent: 'bg-teal-600' },
  { title: 'Hospital Locator', description: 'Locate nearby hospitals quickly using a clean, scalable mapping experience.', icon: FaMapMarkedAlt, accent: 'bg-sky-600' },
  { title: 'AI Recommendations', description: 'Future-ready recommendations designed for seamless machine learning integration.', icon: FaBrain, accent: 'bg-violet-600' },
  { title: 'Emergency Help', description: 'Access urgent care support instantly through a dedicated healthcare response pathway.', icon: FaAmbulance, accent: 'bg-rose-600' },
];

const steps = ['Enter Symptoms', 'Choose Location', 'Get Recommendations', 'Visit Hospital'];
const benefits = [
  ['Trusted Providers', 'Verified care networks and professional support.'],
  ['Transparent Costs', 'Clear expectations and streamlined guidance.'],
  ['Fast Assistance', 'Quick access to local medical help.'],
  ['AI Powered', 'Future-ready recommendations with growth potential.'],
];

function Home() {
  return (
    <main className="bg-slate-50">
      <HeroSection />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-600">Why it matters</p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">Modern healthcare support designed for every journey across India.</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">The platform combines trusted provider discovery across all 36 states and UTs, emergency response, and future-focused recommendations into one elegant experience.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (<FeatureCard key={feature.title} {...feature} />))}
        </div>
      </section>
      <section className="border-y border-slate-200 bg-white/70">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-600">How it works</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">A simple experience from start to finish.</h2>
          </div>
          <div className="mt-12 flex flex-col items-center gap-4 lg:flex-row lg:justify-center">
            {steps.map((step, idx) => (
              <div key={step} className="flex items-center gap-4">
                <div className="rounded-2xl border border-teal-200 bg-teal-50 px-6 py-4 text-center text-sm font-semibold text-teal-700 shadow-sm">
                  <div className="text-xs uppercase tracking-[0.2em] text-teal-500">Step {idx + 1}</div>
                  <div className="mt-2">{step}</div>
                </div>
                {idx < steps.length - 1 && <div className="hidden text-2xl text-slate-400 lg:block">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-600">Why choose us</p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">Built for trust, clarity, and speed.</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map(([title, description]) => (<div key={title} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"><h3 className="text-xl font-semibold text-slate-900">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{description}</p></div>))}
        </div>
      </section>
    </main>
  );
}

export default Home;

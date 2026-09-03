import { FaStethoscope, FaMapMarkedAlt, FaBrain, FaAmbulance } from 'react-icons/fa';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';

const features = [
  { title: 'Verified Doctors', description: 'Find trusted healthcare professionals with transparent credentials and patient-focused care.', icon: FaStethoscope, accent: '#0d9488' },
  { title: 'Hospital Locator', description: 'Locate nearby hospitals quickly using a clean, scalable mapping experience.', icon: FaMapMarkedAlt, accent: '#0284c7' },
  { title: 'AI Recommendations', description: 'Future-ready recommendations designed for seamless machine learning integration.', icon: FaBrain, accent: '#9333ea' },
  { title: 'Emergency Help', description: 'Access urgent care support instantly through a dedicated healthcare response pathway.', icon: FaAmbulance, accent: '#dc2626' },
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
    <main style={{ backgroundColor: 'var(--color-bg)' }} className="transition-colors">
      <HeroSection />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p style={{ color: 'var(--color-accent)' }} className="text-sm font-semibold uppercase tracking-[0.25em]">Why it matters</p>
          <h2 style={{ color: 'var(--color-text)' }} className="mt-4 text-3xl font-semibold sm:text-4xl">Modern healthcare support designed for every journey across India.</h2>
          <p style={{ color: 'var(--color-text-secondary)' }} className="mt-4 text-lg leading-8">The platform combines trusted provider discovery across all 36 states and UTs, emergency response, and future-focused recommendations into one elegant experience.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (<FeatureCard key={feature.title} {...feature} />))}
        </div>
      </section>
      <section style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }} className="border-y transition-colors">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p style={{ color: 'var(--color-accent)' }} className="text-sm font-semibold uppercase tracking-[0.25em]">How it works</p>
            <h2 style={{ color: 'var(--color-text)' }} className="mt-4 text-3xl font-semibold sm:text-4xl">A simple experience from start to finish.</h2>
          </div>
          <div className="mt-12 flex flex-col items-center gap-4 lg:flex-row lg:justify-center">
            {steps.map((step, idx) => (
              <div key={step} className="flex items-center gap-4">
                <div style={{ borderColor: 'var(--color-accent-light)', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }} className="rounded-2xl border px-6 py-4 text-center text-sm font-semibold shadow-sm">
                  <div className="text-xs uppercase tracking-[0.2em]">Step {idx + 1}</div>
                  <div className="mt-2">{step}</div>
                </div>
                {idx < steps.length - 1 && <div style={{ color: 'var(--color-text-light)' }} className="hidden text-2xl lg:block">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p style={{ color: 'var(--color-accent)' }} className="text-sm font-semibold uppercase tracking-[0.25em]">Why choose us</p>
          <h2 style={{ color: 'var(--color-text)' }} className="mt-4 text-3xl font-semibold sm:text-4xl">Built for trust, clarity, and speed.</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map(([title, description]) => (<div key={title} style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }} className="rounded-3xl border p-8 shadow-sm"><h3 style={{ color: 'var(--color-text)' }} className="text-xl font-semibold">{title}</h3><p style={{ color: 'var(--color-text-secondary)' }} className="mt-3 text-sm leading-7">{description}</p></div>))}
        </div>
      </section>
    </main>
  );
}

export default Home;

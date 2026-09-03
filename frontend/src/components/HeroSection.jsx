import { Link } from 'react-router-dom';
import heroIllustration from '../assets/medical-hero.svg';
import SearchBar from './SearchBar';

function HeroSection() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, var(--color-bg) 0%, rgba(13, 148, 136, 0.08) 100%)',
      backgroundColor: 'var(--color-bg)',
    }} className="relative overflow-hidden py-20 text-[var(--color-text)] sm:py-24">
      <div className="absolute inset-0 opacity-20" style={{
        background: 'radial-gradient(circle at top left, var(--color-accent), transparent 45%)',
      }} />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <span style={{ borderColor: 'rgba(var(--color-accent), 0.4)', backgroundColor: 'rgba(var(--color-accent), 0.1)', color: 'var(--color-accent)' }} className="inline-flex rounded-full border px-4 py-2 text-sm font-medium backdrop-blur">Smart Healthcare Assistance for Travelers</span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl" style={{ color: 'var(--color-text)' }}>Find trusted healthcare anywhere you travel.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 sm:text-xl" style={{ color: 'var(--color-text-secondary)' }}>Locate verified doctors, nearby hospitals, and emergency care in seconds with a modern experience built for global travelers.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link style={{ backgroundColor: 'var(--color-accent)' }} to="/doctors" className="rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">Find Doctors</Link>
            <Link style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-accent)' }} to="/emergency" className="rounded-full border px-6 py-3 text-sm font-semibold transition hover:opacity-80">Emergency Help</Link>
          </div>
          <div className="mt-10"><SearchBar /></div>
        </div>
        <div style={{ borderColor: 'rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} className="rounded-[2rem] border p-4 shadow-2xl backdrop-blur"><img src={heroIllustration} alt="Healthcare support illustration" className="w-full rounded-[1.5rem]" /></div>
      </div>
    </section>
  );
}

export default HeroSection;

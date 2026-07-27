import { Link } from 'react-router-dom';
import heroIllustration from '../assets/medical-hero.svg';
import SearchBar from './SearchBar';

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-teal-900 py-20 text-white sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.25),_transparent_45%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <span className="inline-flex rounded-full border border-teal-400/40 bg-white/10 px-4 py-2 text-sm font-medium text-teal-200 backdrop-blur">Smart Healthcare Assistance for Travelers</span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">Find trusted healthcare anywhere you travel.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">Locate verified doctors, nearby hospitals, and emergency care in seconds with a modern experience built for global travelers.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/doctors" className="rounded-full bg-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-400">Find Doctors</Link>
            <Link to="/emergency" className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">Emergency Help</Link>
          </div>
          <div className="mt-10"><SearchBar /></div>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl shadow-black/20 backdrop-blur"><img src={heroIllustration} alt="Healthcare support illustration" className="w-full rounded-[1.5rem]" /></div>
      </div>
    </section>
  );
}

export default HeroSection;

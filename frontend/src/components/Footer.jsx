import { Link } from 'react-router-dom';
import { FaHeartbeat, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3 text-lg font-semibold text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-600 text-white"><FaHeartbeat /></span>
            <span>MediTravel AI</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">Smart healthcare assistance for travelers with trusted care, transparent guidance, and rapid emergency response.</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Quick Links</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link to="/doctors" className="transition hover:text-teal-400">Find Doctors</Link></li>
            <li><Link to="/hospitals" className="transition hover:text-teal-400">Hospitals</Link></li>
            <li><Link to="/emergency" className="transition hover:text-teal-400">Emergency</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Follow Us</h3>
          <div className="mt-4 flex gap-3">
            <a href="https://www.instagram.com" className="rounded-full border border-slate-700 p-3 transition hover:border-teal-500 hover:text-teal-400" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://www.twitter.com" className="rounded-full border border-slate-700 p-3 transition hover:border-teal-500 hover:text-teal-400" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://www.linkedin.com" className="rounded-full border border-slate-700 p-3 transition hover:border-teal-500 hover:text-teal-400" aria-label="LinkedIn"><FaLinkedin /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 px-4 py-4 text-center text-sm text-slate-500 sm:px-6 lg:px-8">© 2026 MediTravel AI. All rights reserved.</div>
    </footer>
  );
}

export default Footer;

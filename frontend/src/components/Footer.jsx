import { Link } from 'react-router-dom';
import { FaHeartbeat, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--color-bg-secondary)',
      borderColor: 'var(--color-border)',
      color: 'var(--color-text-muted)',
    }} className="border-t transition-colors">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <div style={{ color: 'var(--color-text)' }} className="flex items-center gap-3 text-lg font-semibold">
            <span style={{ backgroundColor: 'var(--color-accent)' }} className="flex h-10 w-10 items-center justify-center rounded-2xl text-white"><FaHeartbeat /></span>
            <span>MediTravel AI</span>
          </div>
          <p style={{ color: 'var(--color-text-secondary)' }} className="mt-4 max-w-md text-sm leading-7">Smart healthcare assistance for travelers with trusted care, transparent guidance, and rapid emergency response.</p>
        </div>
        <div>
          <h3 style={{ color: 'var(--color-text)' }} className="text-sm font-semibold uppercase tracking-[0.2em]">Quick Links</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link to="/doctors" className="transition hover:text-[var(--color-accent)]">Find Doctors</Link></li>
            <li><Link to="/hospitals" className="transition hover:text-[var(--color-accent)]">Hospitals</Link></li>
            <li><Link to="/emergency" className="transition hover:text-[var(--color-accent)]">Emergency</Link></li>
          </ul>
        </div>
        <div>
          <h3 style={{ color: 'var(--color-text)' }} className="text-sm font-semibold uppercase tracking-[0.2em]">Follow Us</h3>
          <div className="mt-4 flex gap-3">
            <a href="https://www.instagram.com" style={{ borderColor: 'var(--color-border)' }} className="rounded-full border p-3 transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://www.twitter.com" style={{ borderColor: 'var(--color-border)' }} className="rounded-full border p-3 transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://www.linkedin.com" style={{ borderColor: 'var(--color-border)' }} className="rounded-full border p-3 transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]" aria-label="LinkedIn"><FaLinkedin /></a>
          </div>
        </div>
      </div>
      <div style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-light)' }} className="border-t px-4 py-4 text-center text-sm sm:px-6 lg:px-8">© 2026 MediTravel AI. All rights reserved.</div>
    </footer>
  );
}

export default Footer;

import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaHeartbeat, FaMoon, FaSun, FaPalette } from 'react-icons/fa';
import { useTheme } from '../hooks/useTheme';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Find Doctors', path: '/doctors' },
  { name: 'Hospitals', path: '/hospitals' },
  { name: 'Medical History', path: '/medical-history' },
  { name: 'Emergency', path: '/emergency' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

function Navbar({ currentUser, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAccentPalette, setShowAccentPalette] = useState(false);
  const { theme, toggleTheme, accentColor, setAccentColor, accentPalette } = useTheme();
  const firstName = currentUser?.fullName?.split(' ')[0] || 'Patient';

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[color:rgba(var(--color-surface-rgb),0.9)] backdrop-blur transition-colors duration-200" style={{
      '--color-surface-rgb': theme === 'dark' ? '30, 41, 59' : '255, 255, 255'
    }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-lg font-semibold transition-colors hover:opacity-80">
          <span style={{ backgroundColor: 'var(--color-accent)' }} className="flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-lg transition">
            <FaHeartbeat />
          </span>
          <span className="text-xl font-semibold tracking-tight">MediTravel AI</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]'}`}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {/* Accent color selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAccentPalette(!showAccentPalette)}
              style={{ color: 'var(--color-accent)' }}
              className="rounded-full border border-[var(--color-border)] p-2 transition hover:bg-[var(--color-surface-secondary)]"
              aria-label="Select accent color"
              title="Accent color"
            >
              <FaPalette />
            </button>
            {showAccentPalette && (
              <div className="absolute right-0 top-full mt-2 flex gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-lg">
                {accentPalette.map((accent) => (
                  <button
                    key={accent.name}
                    onClick={() => {
                      setAccentColor(accent.name);
                      setShowAccentPalette(false);
                    }}
                    className={`h-6 w-6 rounded-full transition hover:ring-2 hover:ring-offset-2 ${
                      accentColor === accent.name ? 'ring-2 ring-offset-2' : ''
                    }`}
                    style={{
                      backgroundColor: theme === 'dark' ? accent.dark.accent : accent.light.accent,
                      ringColor: 'var(--color-text-muted)',
                      ringOffsetColor: 'var(--color-surface)',
                    }}
                    aria-label={accent.label}
                    title={accent.label}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full border border-[var(--color-border)] p-2 transition hover:bg-[var(--color-surface-secondary)]"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? <FaMoon className="text-[var(--color-text-secondary)]" /> : <FaSun className="text-[var(--color-accent)]" />}
          </button>

          {currentUser ? (
            <>
              <Link to="/medical-history" className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]">{firstName}</Link>
              <button type="button" onClick={handleLogout} style={{ backgroundColor: 'var(--color-accent)' }} className="rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-90">Logout</button>
            </>
          ) : (
            <Link to="/login" style={{ backgroundColor: 'var(--color-accent)' }} className="rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-90">Login / Sign Up</Link>
          )}
        </div>

        <button type="button" className="rounded-full border border-[var(--color-border)] p-2 text-[var(--color-text-secondary)] md:hidden transition hover:bg-[var(--color-surface-secondary)]" onClick={() => setIsOpen((value) => !value)} aria-label="Toggle navigation">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} onClick={() => setIsOpen(false)} className={({ isActive }) => `rounded-xl px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]'}`}>
                {item.name}
              </NavLink>
            ))}
            <div className="mt-3 flex gap-2 border-t border-[var(--color-border)] pt-3">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm font-medium transition hover:bg-[var(--color-surface-secondary)] flex-1"
              >
                {theme === 'light' ? <FaMoon className="text-[var(--color-text-secondary)]" /> : <FaSun className="text-[var(--color-accent)]" />}
                {theme === 'light' ? 'Dark' : 'Light'}
              </button>
            </div>
            {currentUser ? (
              <button type="button" onClick={handleLogout} style={{ backgroundColor: 'var(--color-accent)' }} className="rounded-full px-4 py-2 text-center text-sm font-semibold text-white">Logout</button>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} style={{ backgroundColor: 'var(--color-accent)' }} className="rounded-full px-4 py-2 text-center text-sm font-semibold text-white">Login / Sign Up</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;

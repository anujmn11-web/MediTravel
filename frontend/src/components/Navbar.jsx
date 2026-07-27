import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaHeartbeat } from 'react-icons/fa';

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
  const firstName = currentUser?.fullName?.split(' ')[0] || 'Patient';

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-lg font-semibold text-slate-900">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-200">
            <FaHeartbeat />
          </span>
          <span className="text-xl font-semibold tracking-tight">MediTravel AI</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `text-sm font-medium transition ${isActive ? 'text-teal-600' : 'text-slate-600 hover:text-teal-600'}`}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {currentUser ? (
            <>
              <Link to="/medical-history" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-500 hover:text-teal-600">{firstName}</Link>
              <button type="button" onClick={handleLogout} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:bg-slate-700">Logout</button>
            </>
          ) : (
            <Link to="/login" className="rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-teal-200 transition hover:bg-teal-700">Login / Sign Up</Link>
          )}
        </div>

        <button type="button" className="rounded-full border border-slate-300 p-2 text-slate-700 md:hidden" onClick={() => setIsOpen((value) => !value)} aria-label="Toggle navigation">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} onClick={() => setIsOpen(false)} className={({ isActive }) => `rounded-xl px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                {item.name}
              </NavLink>
            ))}
            {currentUser ? (
              <button type="button" onClick={handleLogout} className="rounded-full bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white">Logout</button>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="rounded-full bg-teal-600 px-4 py-2 text-center text-sm font-semibold text-white">Login / Sign Up</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;

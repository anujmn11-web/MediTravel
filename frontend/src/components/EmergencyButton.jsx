import { Link } from 'react-router-dom';
import { FaAmbulance } from 'react-icons/fa';

function EmergencyButton() {
  return (
    <Link to="/emergency" style={{
      backgroundColor: 'var(--color-danger)',
      boxShadow: '0 20px 25px -5px rgba(220, 38, 38, 0.25)',
      bottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
    }} className="fixed right-6 z-40 flex items-center gap-3 rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
      <FaAmbulance />
      Emergency Help
    </Link>
  );
}

export default EmergencyButton;

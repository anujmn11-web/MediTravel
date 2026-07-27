import { Link } from 'react-router-dom';
import { FaAmbulance } from 'react-icons/fa';

function EmergencyButton() {
  return (
    <Link to="/emergency" className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-2xl shadow-rose-200 transition hover:bg-rose-700">
      <FaAmbulance />
      Emergency Help
    </Link>
  );
}

export default EmergencyButton;

import { Link } from 'react-router-dom';
import { FaAmbulance } from 'react-icons/fa';

function EmergencyButton() {
  return (
    <Link to="/emergency" style={{
      boxShadow: '0 20px 25px -5px rgba(220, 38, 38, 0.25)',
      bottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
    }} className="btn-55 fixed right-6 z-40 shadow-2xl">
      <span>
        <FaAmbulance />
        Emergency Help
      </span>
    </Link>
  );
}

export default EmergencyButton;

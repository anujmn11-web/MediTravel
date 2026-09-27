import { Link } from 'react-router-dom';
import { FaAmbulance } from 'react-icons/fa';

function EmergencyButton() {
  return (
    <Link to="/emergency" style={{
      bottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
    }} className="btn-55 fixed right-6 z-40 shadow-2xl">
      <span style={{ display: 'flex', gap: '8px' }}>
        <FaAmbulance />
        Emergency Help
      </span>
    </Link>
  );
}

export default EmergencyButton;

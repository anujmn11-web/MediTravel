import { Link } from 'react-router-dom';
import { FaAmbulance } from 'react-icons/fa';

function EmergencyButton() {
  return (
    <Link to="/emergency" style={{
      position: 'fixed',
      right: '1.5rem',
      bottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      borderRadius: '9999px',
      padding: '0.75rem 1.25rem',
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#ffffff',
      backgroundColor: 'var(--color-danger)',
      boxShadow: '0 20px 25px -5px rgba(220, 38, 38, 0.25)',
      textDecoration: 'none',
    }}>
      <FaAmbulance />
      Emergency Help
    </Link>
  );
}

export default EmergencyButton;


import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const LicenseWarningBanner = () => {
  const { user, isRenter, isLicenseVerified } = useAuth();

  if (!isRenter || isLicenseVerified) return null;

  return (
    <div className="license-warning-banner">
      <span>⚠️ Your driver license is not verified yet. </span>
      <Link to="/profile">Upload your license here</Link>
      <span> to book cars.</span>
    </div>
  );
};

export default LicenseWarningBanner;
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Shows a warning banner for renters who haven't uploaded their driver license yet.
 * This is a soft guard — they can still browse, but cannot rent until verified.
 */
const LicenseWarningBanner = () => {
  const { isRenter, isLicenseVerified, isAuthenticated } = useAuth();

  if (!isAuthenticated || !isRenter || isLicenseVerified) return null;

  return (
    <div className="license-banner">
      ⚠️ Your driver license is not yet verified.{' '}
      <Link to="/profile">Upload it here</Link> to start renting cars.
    </div>
  );
};

export default LicenseWarningBanner;

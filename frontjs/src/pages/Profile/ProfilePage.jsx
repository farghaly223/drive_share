import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { authApi } from '../../services/authApi';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [licenseUrl, setLicenseUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!licenseUrl.trim()) { setError('Enter a license URL'); return; }
    setUploading(true);
    try { await authApi.uploadLicense(licenseUrl); setMessage('License uploaded!'); await refreshUser(); } catch (err) { setError(err.message); }
    finally { setUploading(false); }
  };

  return (
    <div>
      <h2>Profile</h2>
      <p><strong>Email:</strong> {user?.email}</p><p><strong>Role:</strong> {user?.role}</p>
      {user?.role === 'renter' && <>
        <p><strong>License Verified:</strong> {user?.isLicenseVerified ? 'Yes' : 'No'}</p>
        <div><h3>Upload Driver License</h3><form onSubmit={handleUpload}><input type="url" placeholder="https://example.com/license.jpg" value={licenseUrl} onChange={e => setLicenseUrl(e.target.value)} required /><button type="submit" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</button></form>{message && <div className="success-message">{message}</div>}{error && <div className="error-alert">{error}</div>}</div>
      </>}
    </div>
  );
};
export default ProfilePage;
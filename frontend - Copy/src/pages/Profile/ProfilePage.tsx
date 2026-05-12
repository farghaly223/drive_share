import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { authApi } from '../../services/authApi';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [licenseUrl, setLicenseUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseUrl.trim()) {
      setError('Please enter a license URL');
      return;
    }
    setUploading(true);
    setError('');
    setMessage('');
    try {
      await authApi.uploadLicense(licenseUrl);
      setMessage('License uploaded successfully! It is now under review.');
      setLicenseUrl('');
      await refreshUser(); // update user context with new license status
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-page">
      <h2>Profile</h2>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Role:</strong> {user?.role}</p>
      {user?.role === 'renter' && (
        <p><strong>License Verified:</strong> {user?.isLicenseVerified ? 'Yes' : 'No'}</p>
      )}

      {user?.role === 'renter' && (
        <div className="license-upload">
          <h3>Driver License Verification</h3>
          <p>Upload a URL to your driver license image (e.g., from cloud storage).</p>
          <form onSubmit={handleUpload}>
            <input
              type="url"
              placeholder="https://example.com/my-license.jpg"
              value={licenseUrl}
              onChange={(e) => setLicenseUrl(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
            />
            <button type="submit" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload License'}
            </button>
          </form>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
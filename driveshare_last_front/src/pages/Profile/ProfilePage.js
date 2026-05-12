import React, { useState } from 'react';
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
      await refreshUser();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-page">
      <h2>My Profile</h2>

      <div className="profile-card">
        <div className="profile-row">
          <span className="profile-label">Email</span>
          <span>{user?.email}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Role</span>
          <span className="role-badge">{user?.role}</span>
        </div>
        {user?.role?.toLowerCase() === 'renter' && (
          <div className="profile-row">
            <span className="profile-label">License Verified</span>
            <span className={user?.isLicenseVerified ? 'text-success' : 'text-warning'}>
              {user?.isLicenseVerified ? '✅ Verified' : '⏳ Pending / Not uploaded'}
            </span>
          </div>
        )}
        <div className="profile-row">
          <span className="profile-label">Can Add Cars</span>
          <span>{user?.canAddCars ? '✅ Yes' : '❌ No'}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Can Rent Cars</span>
          <span>{user?.canRentCars ? '✅ Yes' : '❌ No'}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Account Status</span>
          <span className={user?.isSuspended ? 'text-danger' : 'text-success'}>
            {user?.isSuspended ? '🚫 Suspended' : '✅ Active'}
          </span>
        </div>
      </div>

      {user?.role?.toLowerCase() === 'renter' && (
        <div className="license-upload">
          <h3>Driver License Verification</h3>
          <p>Upload a URL to your driver license image (e.g., from cloud storage).</p>
          <form onSubmit={handleUpload}>
            <div className="form-group">
              <input
                type="url"
                placeholder="https://example.com/my-license.jpg"
                value={licenseUrl}
                onChange={(e) => setLicenseUrl(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={uploading} className="btn-primary">
              {uploading ? 'Uploading...' : 'Upload License'}
            </button>
          </form>
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

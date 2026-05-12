import { useState } from 'react';
import PendingOwnersList from './PendingOwnersList';
import PendingCarsList from './PendingCarsList';
import UserRoleManager from './UserRoleManager';
import PendingLicensesList from './PendingLicensesList';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'owners' | 'cars' | 'users' | 'licenses'>('owners');

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'owners' ? 'active' : ''} 
          onClick={() => setActiveTab('owners')}
        >
          Pending Owners
        </button>
        <button 
          className={activeTab === 'cars' ? 'active' : ''} 
          onClick={() => setActiveTab('cars')}
        >
          Pending Car Posts
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          Manage User Roles
        </button>
        <button 
          className={activeTab === 'licenses' ? 'active' : ''} 
          onClick={() => setActiveTab('licenses')}
        >
          Review Licenses
        </button>
      </div>

      <div className="admin-tab-content">
        {activeTab === 'owners' && <PendingOwnersList />}
        {activeTab === 'cars' && <PendingCarsList />}
        {activeTab === 'users' && <UserRoleManager />}
        {activeTab === 'licenses' && <PendingLicensesList />}
      </div>
    </div>
  );
};

export default AdminDashboard;
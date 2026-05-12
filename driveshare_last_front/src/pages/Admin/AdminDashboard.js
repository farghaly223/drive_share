import React, { useState } from 'react';
import PendingOwnersList from './PendingOwnersList';
import PendingCarsList from './PendingCarsList';
import UserRoleManager from './UserRoleManager';
import PendingLicensesList from './PendingLicensesList';

const tabs = [
  { key: 'owners', label: 'Pending Owners' },
  { key: 'cars', label: 'Pending Car Posts' },
  { key: 'users', label: 'Manage User Roles' },
  { key: 'licenses', label: 'Review Licenses' },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('owners');

  return (
    <div className="admin-dashboard">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
      </div>

      <div className="admin-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
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

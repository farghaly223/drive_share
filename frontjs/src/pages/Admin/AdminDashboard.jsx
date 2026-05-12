import { useState } from 'react';
import PendingOwnersList from './PendingOwnersList';
import PendingCarsList from './PendingCarsList';
import UserRoleManager from './UserRoleManager';
import PendingLicensesList from './PendingLicensesList';
import ManagePermissions from './ManagePermissions';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('owners');
  const tabs = [
    { key: 'owners', label: 'Pending Owners', Component: PendingOwnersList },
    { key: 'cars', label: 'Pending Car Posts', Component: PendingCarsList },
    { key: 'users', label: 'Manage User Roles', Component: UserRoleManager },
    { key: 'licenses', label: 'Review Licenses', Component: PendingLicensesList },
  ];
  const ActiveComponent = tabs.find(t => t.key === activeTab)?.Component || (() => null);
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-tabs">
        {tabs.map(tab => (
          <button key={tab.key} className={activeTab === tab.key ? 'active' : ''} onClick={() => setActiveTab(tab.key)}>{tab.label}</button>
        ))}
      </div>
      <div className="admin-tab-content">
        <ActiveComponent />
      </div>
    </div>
  );
};
export default AdminDashboard;
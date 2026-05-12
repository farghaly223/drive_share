import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import LicenseWarningBanner from './LicenseWarningBanner';

const Layout = () => (
  <div className="app-container">
    <Navbar />
    <LicenseWarningBanner />
    <main className="main-content"><Outlet /></main>
  </div>
);
export default Layout;
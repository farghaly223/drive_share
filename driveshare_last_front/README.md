# DriveShare — React JS Frontend

Peer-to-peer car rental platform built with React JS.

## Features

- **Frontend Authorization** with role-based route guards (`PrivateRoute`)
- Authentication (JWT stored in localStorage)
- Role-based navigation: Admin / Owner / Renter
- Notification bell with polling
- Browse & filter cars (public)
- Booking requests & management
- Admin dashboard: pending owners, car posts, license verification, user permissions
- Driver license upload & verification flow
- Review submission for completed bookings

## Authorization Guard Pipeline

```
Request to protected route
        │
  ┌─────▼─────┐
  │ Logged in?│ No → /login
  └─────┬─────┘
        │ Yes
  ┌─────▼──────────┐
  │  Suspended?    │ Yes → /suspended
  └─────┬──────────┘
        │ No
  ┌─────▼──────────────┐
  │  Correct role?     │ No → /
  └─────┬──────────────┘
        │ Yes
   Render Page ✅
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set your API URL
cp .env.example .env
# Edit .env: REACT_APP_API_BASE_URL=http://localhost:5000/api

# 3. Run dev server
npm start
```

## Project Structure

```
src/
├── App.js                        # Router + all route guards
├── context/
│   ├── AuthContext.js            # Auth state + login/logout
│   └── NotificationContext.js   # Notification polling
├── hooks/
│   ├── useAuth.js
│   └── useNotification.js
├── services/
│   ├── api.js                    # Axios base + interceptors
│   ├── authApi.js
│   ├── carsApi.js
│   ├── bookingApi.js
│   ├── browsingApi.js
│   ├── adminApi.js
│   ├── notificationApi.js
│   └── reviewApi.js
├── components/common/
│   ├── PrivateRoute.js           # 🔐 Core authorization guard
│   ├── Layout.js
│   ├── Navbar.js
│   ├── Loading.js
│   ├── ErrorAlert.js
│   └── LicenseWarningBanner.js
└── pages/
    ├── Admin/     AdminDashboard, ManageOwnerPage,
    │              PendingOwnersList, PendingCarsList,
    │              PendingLicensesList, UserRoleManager
    ├── Auth/      LoginPage, RegisterPage
    ├── Bookings/  MyBookingsPage, BookingRequestsPage
    ├── Browsing/  BrowseCarsPage, CarPublicDetailPage
    ├── Cars/      CarListPage, CarFormPage
    ├── Home/      HomePage
    ├── Profile/   ProfilePage
    └── Suspended/ SuspendedPage
```

## Roles & Permissions

| Route | Guard |
|---|---|
| `/browse`, `/browse/:id` | Public |
| `/login`, `/register` | Public |
| `/profile` | Any authenticated user |
| `/admin/*` | `role === 'admin'` |
| `/cars/*`, `/bookings/requests` | `role === 'owner'` |
| `/bookings/my` | `role === 'renter'` |
| Any route | Suspended → `/suspended` |

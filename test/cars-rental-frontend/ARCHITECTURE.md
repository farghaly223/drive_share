# 📊 Project Architecture & Data Flow

## 🏗️ Application Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Browser (Vite Dev Server)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     React App (App.jsx)                 │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │         AuthProvider (AuthContext.jsx)         │   │  │
│  │  │  ┌──────────────────────────────────────────┐  │   │  │
│  │  │  │   Router (React Router v6)              │  │   │  │
│  │  │  │  ┌────────────────────────────────────┐ │  │   │  │
│  │  │  │  │   Navbar (Global Navigation)       │ │  │   │  │
│  │  │  │  └────────────────────────────────────┘ │  │   │  │
│  │  │  │  ┌────────────────────────────────────┐ │  │   │  │
│  │  │  │  │   Routes                           │ │  │   │  │
│  │  │  │  │  ├─ Public: Home, Login, Register │ │  │   │  │
│  │  │  │  │  ├─ Protected (RBAC)              │ │  │   │  │
│  │  │  │  │  │  ├─ Owner: Dashboard           │ │  │   │  │
│  │  │  │  │  │  ├─ Renter: Browse, Bookings  │ │  │   │  │
│  │  │  │  │  │  └─ Admin: Management          │ │  │   │  │
│  │  │  │  │  └─ Error: 404, 403              │ │  │   │  │
│  │  │  │  └────────────────────────────────────┘ │  │   │  │
│  │  │  └──────────────────────────────────────────┘  │   │  │
│  │  │                                                │   │  │
│  │  │  Global State:                               │   │  │
│  │  │  - user: User object                         │   │  │
│  │  │  - isAuthenticated: boolean                  │   │  │
│  │  │  - isLoading: boolean                        │   │  │
│  │  │  - error: string | null                      │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
         │                                      │
         │ (Axios with Interceptors)           │ (Static Files)
         │                                      │
         ▼                                      ▼
   ┌──────────────┐                    ┌─────────────┐
   │   Backend    │                    │   Tailwind  │
   │   ASP.NET    │                    │    CSS      │
   │   API        │                    └─────────────┘
   │ localhost    │
   │  :5000       │
   └──────────────┘
```

## 🔄 Data Flow Diagram

### Authentication Flow
```
┌─────────────┐
│ Login Form  │ (components/LoginForm.jsx)
└──────┬──────┘
       │ User credentials
       ▼
┌──────────────────┐
│  React Hook Form │ (Validation with Zod)
└──────┬───────────┘
       │ Valid data
       ▼
┌──────────────────┐
│  authService     │ (services/api.js)
│  .login()        │
└──────┬───────────┘
       │ POST /api/auth/login
       ▼
┌──────────────────┐
│  Backend API     │
└──────┬───────────┘
       │ { token, user }
       ▼
┌──────────────────┐
│ localStorage     │ (Store token & user)
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ AuthContext      │ (Update global state)
│ - user           │
│ - isAuthenticated│
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Redirect to      │ (Navigate to /dashboard)
│ Dashboard        │
└──────────────────┘
```

### Booking Management Flow
```
┌──────────────────────┐
│ OwnerDashboard       │
│ (Load on mount)      │
└──────┬───────────────┘
       │ useApi(getOwnerBookings)
       ▼
┌──────────────────────┐
│ BookingManagement    │
│ - Fetch bookings     │
│ - Display list       │
│ - Filter by status   │
└──────┬───────────────┘
       │
       ├──────────────┬──────────────┬─────────────┐
       │              │              │             │
       ▼              ▼              ▼             ▼
   [Pending]    [Approved]    [Rejected]    [Completed]
       │              │              │             │
       ├─Approve      │              │             │
       ├─Reject       ├─Complete     │             │
       │              │              │             │
       └──────────┬───┴──────────┬───┴─────────────┘
                  │              │
                  │ API Call     │ API Call
                  ▼              ▼
           PATCH /respond    POST /complete
                  │              │
                  └──────┬───────┘
                         │
                    Refresh Data
                         │
                    Update UI
```

### API Request Flow
```
┌────────────┐
│ Component  │ (useApi hook)
└─────┬──────┘
      │ execute(params)
      ▼
┌──────────────────────┐
│ useApi Hook          │
│ - setLoading(true)   │
│ - setError(null)     │
└─────┬────────────────┘
      │
      ▼
┌──────────────────────┐
│ Service Function     │ (services/api.js)
│ axiosInstance.get()  │
└─────┬────────────────┘
      │
      ▼
┌──────────────────────────┐
│ Axios Interceptor        │
│ (Request)                │
│ ├─ Attach JWT token      │
│ ├─ Set headers           │
│ ├─ Add Content-Type      │
└─────┬────────────────────┘
      │
      ▼ HTTP Request
┌──────────────────────┐
│ Backend API          │
│ (ASP.NET Core)       │
└─────┬────────────────┘
      │
      ▼ HTTP Response
┌──────────────────────────┐
│ Axios Interceptor        │
│ (Response)               │
│ ├─ Check status (200)    │
│ ├─ Handle 401/403        │
│ ├─ Transform data        │
└─────┬────────────────────┘
      │
      ▼
┌──────────────────────┐
│ useApi Hook          │
│ - setData(response)  │
│ - setLoading(false)  │
└─────┬────────────────┘
      │
      ▼
┌──────────────────────┐
│ Component Updates    │
│ - Render with data   │
│ - Show success       │
└──────────────────────┘
```

## 📁 File Structure Tree

```
cars-rental-frontend/
├── public/                          # Static files
│   └── (future: images, favicon)
│
├── src/
│   ├── components/                  # Reusable components
│   │   ├── Navbar.jsx              # Navigation bar
│   │   ├── ProtectedRoute.jsx       # Route protection
│   │   └── UI.jsx                  # Button, Card, Input, etc.
│   │
│   ├── context/                     # Global state management
│   │   └── AuthContext.jsx         # Authentication context
│   │
│   ├── hooks/                       # Custom React hooks
│   │   └── useApi.js               # API hook with loading state
│   │
│   ├── pages/                       # Page components
│   │   ├── Auth/
│   │   │   ├── Login.jsx           # Login page
│   │   │   └── Register.jsx        # Registration page
│   │   │
│   │   ├── Owner/
│   │   │   ├── OwnerDashboard.jsx  # Main owner dashboard
│   │   │   └── BookingManagement.jsx # Booking management
│   │   │
│   │   ├── Renter/                 # (Placeholder)
│   │   ├── Admin/                  # (Placeholder)
│   │   │
│   │   ├── Home.jsx                # Landing page
│   │   ├── NotFound.jsx            # 404 page
│   │   └── Unauthorized.jsx        # 403 page
│   │
│   ├── services/                    # API services
│   │   ├── axiosInstance.js        # Axios config + interceptors
│   │   └── api.js                  # API service functions
│   │
│   ├── App.jsx                      # Main app component
│   ├── main.jsx                     # React entry point
│   └── index.css                    # Global styles
│
├── .env.example                     # Environment template
├── .gitignore                       # Git ignore rules
├── index.html                       # HTML template
├── package.json                     # Dependencies
├── vite.config.js                   # Vite config
├── tailwind.config.js               # Tailwind config
├── postcss.config.js                # PostCSS config
│
└── Documentation/
    ├── README.md                    # Full project documentation
    ├── QUICKSTART.md                # Setup guide
    ├── IMPLEMENTATION_SUMMARY.md    # What's been built
    ├── COMPONENT_EXAMPLES.md        # Code examples
    ├── BOOKING_MANAGEMENT_GUIDE.md  # Booking details
    └── API_INTEGRATION_GUIDE.md     # API patterns
```

## 🔐 Authentication State Machine

```
┌─────────────────────┐
│  Not Authenticated  │
└──────────┬──────────┘
           │
    Register/Login
           │
           ▼
┌──────────────────────────┐
│  Authenticating          │
│  (isLoading = true)      │
└──────────┬───────────────┘
           │
      ┌────┴────┐
      │          │
   Success     Failure
      │          │
      ▼          ▼
   Token    Error Message
    Stored   Displayed
      │          │
      ▼          └──→ Back to Not Authenticated
┌─────────────────────┐
│  Authenticated      │
│  (token in storage) │
└──────────┬──────────┘
           │
      Logout
           │
           ▼
┌──────────────────────────┐
│  Token Cleared           │
│  User Redirected to /login
└──────────────────────────┘
```

## 🎯 Role-Based Access Control (RBAC)

```
                    ┌──────────────┐
                    │   User Login │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  User Role?  │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
    Renter            Owner               Admin
        │                  │                  │
        ▼                  ▼                  ▼
   /browse-cars    /owner-dashboard   /admin-dashboard
   /my-bookings    /my-fleet          /users
   /car/:id        /booking-mgmt      /pending-cars
                                      /analytics
```

## 🔄 Component Lifecycle in Booking Management

```
Mount
  ├─ useAuth() → Check authentication
  ├─ useApi(getOwnerBookings) → Fetch data
  ├─ State: filterStatus = 'all'
  ├─ State: isProcessing = false
  └─ Effect: Execute fetchBookings()

Render
  ├─ Loading → Show spinner
  ├─ Error → Show error message
  └─ Success → Map through bookings
      └─ BookingCard
          ├─ Display booking info
          └─ Render action buttons
              ├─ Approve (if pending)
              ├─ Reject (if pending)
              └─ Complete (if approved)

User Action
  ├─ Click "Approve"
  ├─ setIsProcessing(true)
  ├─ handleRespond(id, true)
  ├─ respondToBooking(id, true)
  ├─ Show success message
  ├─ Re-fetch bookings
  └─ setIsProcessing(false)

Unmount
  └─ Cleanup state
```

## 📊 State Management Strategy

```
┌──────────────────────────────────────────────────────┐
│              Global State (AuthContext)              │
├──────────────────────────────────────────────────────┤
│ - user: User object                                  │
│ - isAuthenticated: boolean                           │
│ - isLoading: boolean                                 │
│ - error: string | null                               │
│ - login(email, password)                             │
│ - register(formData)                                 │
│ - logout()                                           │
│ - hasRole(role)                                      │
└──────────────────────────────────────────────────────┘
         △
         │ useAuth()
         │
    ┌────┴────────────────────────┐
    │                             │
    ▼                             ▼
┌──────────────────┐    ┌──────────────────┐
│   Local State    │    │   API State      │
│ (Component)      │    │ (useApi hook)    │
├──────────────────┤    ├──────────────────┤
│ - filterStatus   │    │ - data           │
│ - isProcessing   │    │ - isLoading      │
│ - successMsg     │    │ - error          │
│ - formData       │    │ - execute()      │
└──────────────────┘    └──────────────────┘
```

## 🛣️ Navigation Flow

```
                    ┌─────────┐
                    │  Home   │
                    └────┬────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    Not Auth        Authenticated      Authenticated
        │                │                │
        ├──→ Login       ├──→ Owner       ├──→ Admin
        │                │   Dashboard    │   Dashboard
        └──→ Register    │                │
                         ├──→ Renter     └──→ User
                         │   Dashboard       Management
                         │
                         └──→ Owner
                             Dashboard
                                │
                                ├──→ My Fleet
                                ├──→ Add Car
                                └──→ Booking
                                    Management
```

## 📱 Responsive Breakpoints

```
Mobile (< 768px)
├─ Navbar: Hamburger menu
├─ Cards: Full width
├─ Tables: Stack layout
└─ Forms: Single column

Tablet (768px - 1024px)
├─ Navbar: Horizontal menu
├─ Cards: 2 columns
├─ Tables: Horizontal scroll
└─ Forms: 2 columns

Desktop (> 1024px)
├─ Navbar: Full menu
├─ Cards: 3+ columns
├─ Tables: Full width
└─ Forms: 2+ columns
```

---

**This architecture supports scalability, maintainability, and follows React best practices!**

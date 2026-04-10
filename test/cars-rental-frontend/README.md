# DriveShare - Car Rental Platform Frontend

A modern React.js frontend for the comprehensive Car Rental System built with Vite, React Router v6, and Tailwind CSS.

## 🎯 Features

### Authentication & Authorization
- Multi-role Login and Registration (Renter, Owner, Admin)
- JWT Token Management with Axios Interceptors
- Role-Based Access Control (RBAC) with Protected Routes
- Secure token storage in localStorage

### Renter Features
- Browse and filter available cars
- Advanced search filters
- Detailed car views
- Booking request submission
- Booking history and management

### Owner Dashboard
- Manage personal vehicle fleet
- Approve/Reject booking requests
- Mark rentals as complete
- View booking history
- Real-time booking notifications

### Admin Dashboard
- User management
- Approve pending car listings
- Monitor all bookings
- Platform analytics
- Security controls

## 🚀 Tech Stack

- **Framework**: React 18.2+
- **Build Tool**: Vite 5+
- **Styling**: Tailwind CSS 3.4+
- **Routing**: React Router DOM v6
- **State Management**: React Context API
- **Form Validation**: React Hook Form + Zod
- **HTTP Client**: Axios with Interceptors
- **Package Manager**: npm or yarn

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   └── UI.jsx           # Common UI components (Button, Card, Input, etc.)
├── context/
│   └── AuthContext.jsx  # Global auth state management
├── hooks/
│   └── useApi.js        # Custom hook for API calls
├── pages/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── Owner/
│   │   ├── OwnerDashboard.jsx
│   │   └── BookingManagement.jsx
│   ├── Renter/          # Placeholder for renter pages
│   ├── Admin/           # Placeholder for admin pages
│   ├── Home.jsx
│   ├── NotFound.jsx
│   └── Unauthorized.jsx
├── services/
│   ├── axiosInstance.js # Axios configuration with interceptors
│   └── api.js           # API service functions
├── App.jsx
├── main.jsx
└── index.css

public/                 # Static files
index.html             # HTML entry point
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 16+ and npm/yarn

### Installation

1. **Navigate to the frontend directory**
   ```bash
   cd cars-rental-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables**
   Create a `.env` file in the root of `cars-rental-frontend`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 🔐 Security Features

### JWT Token Management
- Tokens automatically attached to all API requests via Axios interceptors
- Automatic token refresh on 401 errors
- Secure logout with token cleanup
- localStorage-based token persistence

### Role-Based Access Control
- Protected routes ensure users can only access authorized pages
- Frontend RBAC prevents unauthorized navigation
- Server-side validation provides additional security layer
- Unauthorized access redirects to error page

### Form Validation
- Client-side validation using React Hook Form + Zod
- Type-safe schema validation
- Real-time error feedback
- Password confirmation validation

## 📡 API Integration

### Axios Configuration
The application includes a pre-configured Axios instance with:
- Base URL from environment variables
- JWT Bearer Token injection in request headers
- Global error handling for 401/403 responses
- Request/Response interceptors

### Service Functions
All API calls are centralized in `src/services/api.js`:
- `authService` - Login, Register, Logout
- `carsService` - Car CRUD operations
- `bookingService` - Booking operations
- `adminService` - Admin operations

## 🎨 Styling

The application uses **Tailwind CSS** for styling with:
- Custom color scheme in `tailwind.config.js`
- Responsive design patterns
- Reusable component classes
- Mobile-first approach

## 🪝 Custom Hooks

### useApi
A custom hook for handling API calls with loading, error, and data states:
```javascript
const { data, isLoading, error, execute, reset } = useApi(apiFunction);
```

## 📱 Pages Overview

### Public Pages
- **Home** (`/`) - Landing page with feature overview
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - New user registration

### Owner Pages
- **Owner Dashboard** (`/owner-dashboard`) - Main owner hub
  - Fleet management
  - Booking management
  - Real-time request handling

### Admin Pages (To be implemented)
- **Admin Dashboard** (`/admin-dashboard`) - Admin control panel

### Renter Pages (To be implemented)
- **Browse Cars** (`/browse-cars`) - Car listing and search
- **Car Details** (`/cars/:id`) - Detailed car information
- **My Bookings** (`/my-bookings`) - Booking history

## 🔄 Authentication Flow

1. User registers or logs in
2. Backend returns JWT token and user data
3. Frontend stores token in localStorage
4. Axios interceptor adds token to all requests
5. If token expires (401), user is logged out
6. If access denied (403), user is redirected to unauthorized page

## 🛠️ Development Tips

### Environment Variables
```env
VITE_API_URL=http://localhost:5000/api
```

### API Proxy Configuration
The `vite.config.js` includes a proxy for API requests during development:
```
/api → http://localhost:5000
```

### Component Props
All reusable components follow consistent prop patterns. Check `UI.jsx` for available components and their props.

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Axios Documentation](https://axios-http.com)
- [React Hook Form Documentation](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)

## 📝 Notes

- The frontend is designed to work with the ASP.NET Core backend API
- Ensure the backend is running on `http://localhost:5000` (or update `VITE_API_URL`)
- The application uses React 18's latest features (React Context, Hooks, Suspense)
- All component styling follows Tailwind CSS conventions

## 🚦 Next Steps

1. **Implement Renter Features**
   - Create `/pages/Renter` directory
   - Implement car browsing and filtering
   - Create booking request form

2. **Implement Admin Dashboard**
   - Create `/pages/Admin` directory
   - Implement pending owners approval
   - Create user management interface

3. **Add Additional Features**
   - Ratings and reviews system
   - Payment integration
   - Real-time notifications
   - Chat system between renters and owners

4. **Performance Optimization**
   - Code splitting with React.lazy
   - Image optimization
   - Caching strategies

5. **Testing**
   - Unit tests with Vitest
   - Integration tests with Testing Library
   - E2E tests with Cypress or Playwright

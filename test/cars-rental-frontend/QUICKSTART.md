# 🚀 Quick Start Guide - DriveShare Frontend

## 📋 Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- Backend API running on `http://localhost:5000`

## ⚡ Quick Setup (5 minutes)

### Step 1: Install Dependencies
```bash
cd cars-rental-frontend
npm install
```

### Step 2: Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

The default configuration should work if your backend is on `http://localhost:5000/api`

### Step 3: Start Development Server
```bash
npm run dev
```

Server runs on: **http://localhost:5173**

## 🔗 Available Routes

### Public Routes
- **`/`** - Home page
- **`/login`** - Login page
- **`/register`** - Registration page

### Protected Routes (Owner)
- **`/owner-dashboard`** - Owner dashboard & booking management

### Protected Routes (Renter) - To be implemented
- **`/browse-cars`** - Car listing
- **`/my-bookings`** - Booking history

### Protected Routes (Admin) - To be implemented
- **`/admin-dashboard`** - Admin control panel

### Error Routes
- **`/unauthorized`** - Access denied page
- **`/404`** - Not found page

## 🔐 Demo Credentials

For testing, use these test accounts (adjust based on your backend):

**Owner Account:**
```
Email: owner@example.com
Password: password123
Role: owner
```

**Renter Account:**
```
Email: renter@example.com
Password: password123
Role: renter
```

**Admin Account:**
```
Email: admin@example.com
Password: password123
Role: admin
```

## 📁 Project Structure

```
cars-rental-frontend/
├── src/
│   ├── components/         # Reusable UI components
│   ├── context/           # React Context (Auth)
│   ├── hooks/             # Custom hooks (useApi)
│   ├── pages/             # Page components
│   │   ├── Auth/          # Login & Register
│   │   └── Owner/         # Owner Dashboard
│   ├── services/          # API services
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS config
└── package.json           # Dependencies
```

## 🎨 Key Technologies

| Technology | Purpose | Version |
|-----------|---------|---------|
| React | UI Framework | 18.2+ |
| Vite | Build Tool | 5.0+ |
| React Router | Routing | 6.20+ |
| Tailwind CSS | Styling | 3.4+ |
| Axios | HTTP Client | 1.6+ |
| React Hook Form | Form Handling | 7.48+ |
| Zod | Schema Validation | 3.22+ |

## 🔑 Key Features

### ✅ Implemented
- ✓ Authentication (Login/Register)
- ✓ JWT Token Management
- ✓ Protected Routes with RBAC
- ✓ Owner Dashboard
- ✓ Booking Management (Approve/Reject/Complete)
- ✓ Responsive UI with Tailwind CSS
- ✓ Form Validation with Zod
- ✓ Error Handling
- ✓ Global Auth Context

### 🚧 To Implement
- Renter car browsing and booking
- Admin dashboard and user management
- Real-time notifications
- Payment integration
- Review and rating system
- Chat between users

## 📝 Common Tasks

### Access Backend API

The frontend makes API requests to your backend. Update `VITE_API_URL` in `.env` if needed:
```env
VITE_API_URL=http://localhost:5000/api
```

### Test Owner Dashboard

1. Go to http://localhost:5173/register
2. Create account with role "owner"
3. Login with credentials
4. Navigate to Owner Dashboard
5. View and manage bookings

### Handle API Errors

Axios interceptors automatically handle:
- **401 Errors**: User redirected to login
- **403 Errors**: User redirected to unauthorized page
- **Network Errors**: Displayed to user

## 🛠️ Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Adding New Dependencies

```bash
npm install <package-name>
```

**Common additions:**
- `@tanstack/react-query` - Server state management
- `zustand` - Client state management
- `date-fns` - Date utilities
- `react-hot-toast` - Toast notifications

## 🐛 Troubleshooting

### "Cannot find module" error
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### CORS errors
- Ensure backend allows frontend origin
- Check backend CORS configuration
- Verify `VITE_API_URL` is correct

### Token not persisting
- Check browser localStorage is enabled
- Verify token is being stored: `localStorage.getItem('access_token')`
- Check token expiration

### API calls failing
- Ensure backend is running
- Check network tab in browser DevTools
- Verify API endpoints match backend
- Check authentication header

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Axios Guide](https://axios-http.com)

## 🤝 Next Steps

1. **Implement Renter Features**
   - Create renter pages directory
   - Add car browsing and filtering
   - Create booking request form

2. **Create Admin Dashboard**
   - User management interface
   - Approve pending car listings
   - Platform analytics

3. **Add Testing**
   - Unit tests with Vitest
   - Integration tests with Testing Library
   - E2E tests with Cypress

4. **Optimize Performance**
   - Code splitting with React.lazy
   - Image optimization
   - State management optimization

5. **Deploy**
   - Build production bundle
   - Deploy to hosting (Vercel, Netlify, etc.)
   - Configure CI/CD pipeline

## ✨ Tips & Best Practices

1. **Use the `useApi` hook** for all API calls
2. **Always validate forms** with Zod schemas
3. **Keep components small** and focused
4. **Use Tailwind classes** for styling (no CSS files needed)
5. **Protect routes** with `ProtectedRoute` component
6. **Handle errors gracefully** with user-friendly messages
7. **Test RBAC** to prevent unauthorized access
8. **Use React DevTools** for debugging

## 📞 Support

If you encounter issues:
1. Check the [Troubleshooting Guide](#troubleshooting)
2. Review component documentation
3. Check browser console for errors
4. Verify backend is running
5. Review API response in Network tab

---

**Happy coding! 🎉**

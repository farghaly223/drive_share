# Frontend & Backend Integration Guide

This document explains how to set up and run both the frontend and backend for the Car Rental application.

## Prerequisites

- **Node.js** (v16+) for frontend
- **.NET SDK** (v8.0+) for backend
- **MySQL** database server running

## Backend Setup

### 1. Configure Backend

1. Navigate to the backend folder:
   ```bash
   cd cars_rental
   ```

2. Update `appsettings.json` with:
   - Database connection string (MySQL)
   - JWT secret key
   - CORS settings

   Example:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Database=car_rental_db;User=root;Password=your_password;"
     },
     "Jwt": {
       "Secret": "your-secret-key-min-32-characters-long"
     }
   }
   ```

3. Run database migrations:
   ```bash
   dotnet ef database update
   ```

4. Start the backend server:
   ```bash
   dotnet run
   ```
   
   Backend will run on: `http://localhost:5000`

### Backend CORS Configuration

Make sure your `Program.cs` includes CORS configuration:
```csharp
builder.Services.AddCors(options => 
{ 
  options.AddPolicy("AllowAll", policy => 
    policy.AllowAnyHeader()
          .AllowAnyMethod()
          .AllowAnyOrigin()
  ); 
});

// In app configuration
app.UseCors("AllowAll");
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure API Connection

Update `src/services/api.js` to match your backend URL:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

If your backend runs on a different port or machine:
```javascript
const API_BASE_URL = 'http://your-backend-url:port/api';
```

### 3. Start Development Server
```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

## Running Both Together

### Option 1: Terminal Tabs
1. Open two terminal windows
2. Terminal 1: Run backend
   ```bash
   cd cars_rental
   dotnet run
   ```
3. Terminal 2: Run frontend
   ```bash
   cd frontend
   npm run dev
   ```

### Option 2: VS Code
1. Open VS Code with the workspace
2. Open two terminals (Terminal > New Terminal)
3. Run both commands side by side

## Testing the Integration

### 1. Test Backend API
Use Postman or curl to test endpoints:
```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "fullName": "Test User",
    "role": "renter"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'

# Get all cars
curl http://localhost:5000/api/browsing/all
```

### 2. Test Frontend

1. Open browser: `http://localhost:5173`
2. Try these actions:
   - Register a new account
   - Login
   - Browse cars
   - View car details
   - Try to make a booking

### 3. Verify API Integration

Open browser DevTools (F12) → Network tab:
- Should see API requests to `http://localhost:5000/api/...`
- Response codes should be 200 (success) or appropriate error codes
- JWT tokens should appear in request headers after login

## Common Issues & Solutions

### Issue: CORS Error
**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Check backend CORS config in `Program.cs`
2. Verify `UseCors()` is called
3. Ensure frontend URL is allowed

### Issue: API Not Found
**Error**: `404 on POST /api/auth/login`

**Solution**:
1. Verify backend is running on port 5000
2. Check `API_BASE_URL` in `src/services/api.js`
3. Test API with Postman first

### Issue: JWT Token Errors
**Error**: `401 Unauthorized` on protected routes

**Solution**:
1. Ensure you're logged in
2. Check JWT secret matches between frontend and backend
3. Verify token is being sent in request headers

### Issue: Database Connection
**Error**: Backend fails to start with database error

**Solution**:
1. Verify MySQL is running
2. Check connection string in `appsettings.json`
3. Ensure database exists: `car_rental_db`
4. Run migrations: `dotnet ef database update`

## Frontend Structure & Components

### Pages
- **Login.jsx**: User authentication
- **Register.jsx**: New user registration
- **Browse.jsx**: Browse and filter cars
- **CarDetails.jsx**: View specific car details and book
- **MyBookings.jsx**: View user's booking requests
- **MyCars.jsx**: Car owner's vehicle management

### Services
- **services/api.js**: Axios instance with interceptors for API calls

### Context
- **context/AuthContext.jsx**: Manages authentication state and JWT tokens

### Hooks
- **hooks/useAuth.js**: Custom hook to access auth context

## API Endpoints Summary

```
Authentication:
POST   /api/auth/register
POST   /api/auth/login

Cars/Browsing:
GET    /api/browsing/all
GET    /api/browsing/filter
GET    /api/browsing/{id}
POST   /api/cars
DELETE /api/cars/{id}

Bookings:
POST   /api/booking/request
PATCH  /api/booking/{id}/respond
PATCH  /api/booking/{id}/complete
```

## Building for Production

### Frontend Build
```bash
npm run build
# Creates dist/ folder with optimized files
```

### Backend Publish
```bash
dotnet publish -c Release
# Creates publish/ folder ready for deployment
```

## Next Steps

1. ✅ Backend API working
2. ✅ Frontend developed and connected
3. Next: Add more features
   - Real-time notifications
   - Payment processing
   - Admin dashboard
   - Advanced search
   - Reviews and ratings

## Useful Commands

**Frontend:**
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

**Backend:**
```bash
dotnet run                    # Run with hot reload
dotnet build                  # Build project
dotnet ef migrations add Init # Create migration
dotnet ef database update     # Apply migrations
```

## Contact & Support

For issues:
1. Check this guide first
2. Review backend `appsettings.json`
3. Check frontend `src/services/api.js` configuration
4. Test API endpoints with Postman
5. Check browser console for errors (F12 → Console)

# Frontend API Integration Guide

This document describes how the frontend integrates with the backend API and how to add new API endpoints.

## 🌐 Base Configuration

All API requests are configured in `src/services/axiosInstance.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

## 🔐 Authentication & Interceptors

### Request Interceptor
Automatically adds JWT Bearer token to all requests:
```javascript
Authorization: Bearer <token>
```

### Response Interceptor
Handles global errors:
- **401**: Clears token and redirects to login
- **403**: Redirects to unauthorized page
- **Other errors**: Passed to component error handling

## 📡 API Services

All API functions are organized in `src/services/api.js`:

### Authentication Service
```javascript
// Login
authService.login(email, password)
Returns: { token, user }

// Register
authService.register(data)
Returns: { message, success }

// Logout
authService.logout()

// Get current user
authService.getCurrentUser()
Returns: user object or null
```

### Cars Service
```javascript
// Get all cars
carsService.getAllCars(filters)
Returns: [{ id, brand, model, year, pricePerDay, isApproved, ... }]

// Get car by ID
carsService.getCarById(id)
Returns: { id, brand, model, ... }

// Add new car
carsService.addCar(carData)
Returns: { id, message }

// Update car
carsService.updateCar(id, carData)
Returns: { message, success }

// Delete car
carsService.deleteCar(id)
Returns: { message, success }

// Get owner's cars
carsService.getOwnerCars()
Returns: [{ id, brand, model, ... }]

// Approve/Reject car (admin only)
carsService.approveCar(id, approve)
Returns: { message, success }
```

### Booking Service
```javascript
// Request booking
bookingService.requestBooking(carId, bookingData)
Returns: { id, message }

// Get bookings
bookingService.getBookings(filters)
Returns: [{ id, carId, startDate, endDate, status, ... }]

// Get booking by ID
bookingService.getBookingById(id)
Returns: { id, carId, ... }

// Respond to booking
bookingService.respondToBooking(id, approved)
Returns: { message, success }

// Complete booking
bookingService.completeBooking(id)
Returns: { message, success }

// Get owner's bookings
bookingService.getOwnerBookings()
Returns: [{ id, renterName, carModel, status, ... }]
```

### Admin Service
```javascript
// Get pending owners
adminService.getPendingOwners()
Returns: [{ userId, name, email, status, ... }]

// Approve owner
adminService.approveOwner(userId)
Returns: { message, success }

// Reject owner
adminService.rejectOwner(userId)
Returns: { message, success }

// Get all users
adminService.getAllUsers()
Returns: [{ id, name, email, role, ... }]
```

## 🎣 Using the useApi Hook

The `useApi` hook handles loading, error, and data states:

```javascript
import { useApi } from '../hooks/useApi';
import { carsService } from '../services/api';

const MyComponent = () => {
  const { data, isLoading, error, execute, reset } = useApi(
    carsService.getAllCars
  );

  useEffect(() => {
    execute(); // Fetch cars on mount
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {data?.map(car => (
        <div key={car.id}>{car.brand} {car.model}</div>
      ))}
    </div>
  );
};
```

## 🆕 Adding New API Endpoints

### Step 1: Add to `src/services/api.js`

```javascript
// Add to appropriate service
export const myService = {
  getMyData: async (params) => {
    const response = await axiosInstance.get('/my-endpoint', { params });
    return response.data;
  },

  createMyData: async (data) => {
    const response = await axiosInstance.post('/my-endpoint', data);
    return response.data;
  },

  updateMyData: async (id, data) => {
    const response = await axiosInstance.put(`/my-endpoint/${id}`, data);
    return response.data;
  },

  deleteMyData: async (id) => {
    const response = await axiosInstance.delete(`/my-endpoint/${id}`);
    return response.data;
  },
};
```

### Step 2: Use in Component

```javascript
import { useApi } from '../hooks/useApi';
import { myService } from '../services/api';

const MyComponent = () => {
  const { data, isLoading, error, execute } = useApi(myService.getMyData);

  useEffect(() => {
    execute({ filter: 'value' });
  }, []);

  return (
    // Your component JSX
  );
};
```

## 🔄 API Response Patterns

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

## 📍 Expected Backend Endpoints

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/refresh` (optional)

### Cars
- `GET /api/cars`
- `GET /api/cars/{id}`
- `POST /api/cars`
- `PUT /api/cars/{id}`
- `DELETE /api/cars/{id}`
- `GET /api/cars/owner/my-cars`
- `PATCH /api/cars/manage-post/{id}`

### Bookings
- `GET /api/booking`
- `GET /api/booking/{id}`
- `POST /api/booking/request`
- `PATCH /api/booking/{id}/respond`
- `POST /api/booking/{id}/complete`
- `GET /api/booking/owner/requests`

### Admin
- `GET /api/admin/pending-owners`
- `POST /api/admin/approve-owner/{id}`
- `POST /api/admin/reject-owner/{id}`
- `GET /api/admin/users`

## 🧪 Testing API Integration

### Manual Testing with Postman/Insomnia
1. Export endpoints from `src/services/api.js`
2. Test each endpoint with proper authentication token
3. Verify response structure

### Frontend Testing
```javascript
// Example test
describe('carsService', () => {
  it('should fetch all cars', async () => {
    const cars = await carsService.getAllCars();
    expect(cars).toBeInstanceOf(Array);
    expect(cars[0]).toHaveProperty('id');
  });
});
```

## ⚙️ Configuration

### Environment Variables
```env
VITE_API_URL=http://localhost:5000/api
```

### API Timeout
Modify in `src/services/axiosInstance.js`:
```javascript
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
});
```

## 🔄 Handling Different Response Formats

If your API returns different response formats per endpoint:

```javascript
// Custom wrapper for specific endpoints
const customApiCall = async (endpoint, config) => {
  try {
    const response = await axiosInstance.get(endpoint, config);
    // Transform response if needed
    return {
      data: response.data.result, // If nested differently
      success: response.data.success,
    };
  } catch (error) {
    // Custom error handling
    throw new Error(error.response?.data?.errorMessage || 'API Error');
  }
};
```

## 📊 Monitoring API Calls

Enable logging for debugging:

```javascript
// In axiosInstance.js
axiosInstance.interceptors.request.use((config) => {
  console.log('API Request:', config);
  return config;
});

axiosInstance.interceptors.response.use((response) => {
  console.log('API Response:', response);
  return response;
});
```

## 🚨 Error Handling Strategy

1. **Global errors** (401, 403) → Handled by interceptors
2. **API validation errors** → Display in component
3. **Network errors** → Show user-friendly message
4. **Unknown errors** → Log for debugging

```javascript
try {
  await execute(params);
} catch (err) {
  if (err.response?.status === 400) {
    setValidationError(err.response.data.message);
  } else if (err.response?.status === 409) {
    setConflictError('Resource already exists');
  } else {
    setGenericError('Something went wrong');
  }
}
```

## 📋 API Requirements Checklist

- [ ] JWT authentication implemented
- [ ] CORS properly configured
- [ ] Error responses have consistent format
- [ ] All endpoints return proper status codes
- [ ] Request body validation on backend
- [ ] Response pagination for list endpoints
- [ ] Rate limiting implemented
- [ ] API documentation available

---

**For backend implementation details, refer to your ASP.NET Core API documentation.**

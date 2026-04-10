# 🎨 Component & Hook Examples

This document provides practical examples of how to use the components and hooks in the DriveShare frontend.

---

## 🪝 Using the useApi Hook

### Basic Example: Fetching Data on Mount

```jsx
import { useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { carsService } from '../services/api';
import { Card } from '../components/UI';

export const CarList = () => {
  const { data: cars, isLoading, error, execute } = useApi(carsService.getAllCars);

  useEffect(() => {
    execute(); // Fetch on mount
  }, []);

  if (isLoading) return <p>Loading cars...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="space-y-4">
      {cars?.map((car) => (
        <Card key={car.id}>
          <h3>{car.brand} {car.model}</h3>
          <p>${car.pricePerDay}/day</p>
        </Card>
      ))}
    </div>
  );
};
```

### With Parameters

```jsx
const { data, execute } = useApi(carsService.getAllCars);

// Call with filters
const handleFilter = (filters) => {
  execute(filters); // Passes filters to the API function
};
```

### Manual Execution

```jsx
const { execute } = useApi(bookingService.respondToBooking);

const handleApprove = async (bookingId) => {
  try {
    await execute(bookingId, true);
    console.log('Booking approved!');
  } catch (error) {
    console.error('Error approving:', error);
  }
};
```

---

## 🔐 Using the useAuth Hook

### Check Authentication

```jsx
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <div>Welcome, {user?.name}!</div>;
};
```

### Check User Role

```jsx
const { hasRole } = useAuth();

if (hasRole('owner')) {
  return <OwnerFeatures />;
}

if (hasRole(['admin', 'owner'])) {
  return <ManagementPanel />;
}
```

### Handle Login/Logout

```jsx
const { login, logout, isLoading, error } = useAuth();

const handleLogin = async (email, password) => {
  try {
    await login(email, password);
    navigate('/dashboard');
  } catch (err) {
    setError(err.message);
  }
};
```

---

## 🧩 Using UI Components

### Button Component

```jsx
import { Button } from '../components/UI';

// Basic button
<Button>Click me</Button>

// With variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Delete</Button>
<Button variant="success">Approve</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Disabled state
<Button disabled>Disabled</Button>

// As submit button
<Button type="submit" className="w-full">
  Submit Form
</Button>
```

### Input Component

```jsx
import { Input } from '../components/UI';

// Basic input
<Input 
  type="text"
  placeholder="Enter text"
  {...register('fieldName')}
  error={errors.fieldName?.message}
/>

// With label
<Input
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  {...register('email')}
  error={errors.email?.message}
/>

// Password input
<Input
  label="Password"
  type="password"
  placeholder="••••••••"
  {...register('password')}
  error={errors.password?.message}
/>
```

### Card Component

```jsx
import { Card } from '../components/UI';

// Basic card
<Card>
  <h2>Card Title</h2>
  <p>Card content goes here</p>
</Card>

// With custom className
<Card className="border-l-4 border-primary-600">
  <h3>Special Card</h3>
</Card>

// As container
<Card className="max-w-md mx-auto">
  <form>{/* form content */}</form>
</Card>
```

### Layout Component

```jsx
import { Layout } from '../components/UI';

export const MyPage = () => (
  <Layout>
    <div className="container py-8">
      {/* Page content */}
    </div>
  </Layout>
);
```

---

## 🛡️ Using ProtectedRoute

### Basic Protected Route

```jsx
import { ProtectedRoute } from '../components/ProtectedRoute';
import OwnerDashboard from '../pages/Owner/OwnerDashboard';

<Route
  path="/owner-dashboard"
  element={
    <ProtectedRoute>
      <OwnerDashboard />
    </ProtectedRoute>
  }
/>
```

### Role-Based Protected Route

```jsx
// Single role
<Route
  path="/owner-dashboard"
  element={
    <ProtectedRoute allowedRoles={['owner']}>
      <OwnerDashboard />
    </ProtectedRoute>
  }
/>

// Multiple roles
<Route
  path="/manage"
  element={
    <ProtectedRoute allowedRoles={['admin', 'owner']}>
      <ManagementPanel />
    </ProtectedRoute>
  }
/>
```

---

## 📝 Using React Hook Form + Zod

### Simple Form

```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Button } from '../components/UI';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
});

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data); // { email, password }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="Password"
        type="password"
        {...register('password')}
        error={errors.password?.message}
      />
      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  );
};
```

### Complex Form with Validation

```jsx
const schema = z.object({
  name: z.string().min(2, 'At least 2 characters'),
  email: z.string().email('Invalid email'),
  role: z.enum(['renter', 'owner']),
  password: z.string().min(6),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input label="Name" {...register('name')} error={errors.name?.message} />
      <Input label="Email" {...register('email')} error={errors.email?.message} />
      
      <select {...register('role')}>
        <option value="renter">Renter</option>
        <option value="owner">Owner</option>
      </select>
      
      <Input 
        label="Password" 
        type="password" 
        {...register('password')} 
        error={errors.password?.message} 
      />
      <Input 
        label="Confirm Password" 
        type="password" 
        {...register('confirmPassword')} 
        error={errors.confirmPassword?.message} 
      />
      
      <Button type="submit" className="w-full">Register</Button>
    </form>
  );
};
```

---

## 🔌 Combining Multiple Hooks

### Complete Example: Booking Management

```jsx
import { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/api';
import { Button, Card } from '../components/UI';

export const BookingManager = () => {
  const { user } = useAuth();
  const { 
    data: bookings, 
    isLoading, 
    error: fetchError, 
    execute: fetchBookings 
  } = useApi(bookingService.getOwnerBookings);
  
  const { execute: respondToBooking } = useApi(bookingService.respondToBooking);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleApprove = async (bookingId) => {
    setIsProcessing(true);
    try {
      await respondToBooking(bookingId, true);
      setSuccessMessage('Booking approved!');
      fetchBookings(); // Refresh list
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <p>Loading bookings...</p>;
  if (fetchError) return <p>Error: {fetchError}</p>;

  return (
    <div>
      {successMessage && (
        <div className="bg-green-100 text-green-800 p-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {bookings?.map((booking) => (
        <Card key={booking.id} className="mb-4">
          <h3>{booking.renterName}</h3>
          <p>{booking.carModel} - {booking.carYear}</p>
          <p>{booking.startDate} to {booking.endDate}</p>
          
          {booking.status === 'pending' && (
            <Button 
              variant="success" 
              onClick={() => handleApprove(booking.id)}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Approve'}
            </Button>
          )}
        </Card>
      ))}
    </div>
  );
};
```

---

## 🚀 Advanced Patterns

### Custom Hook for Common Pattern

```jsx
// hooks/useBookings.js
import { useCallback } from 'react';
import { useApi } from './useApi';
import { bookingService } from '../services/api';

export const useBookings = () => {
  const bookings = useApi(bookingService.getOwnerBookings);
  const respond = useApi(bookingService.respondToBooking);
  const complete = useApi(bookingService.completeBooking);

  const handleRespond = useCallback(async (id, approved) => {
    await respond.execute(id, approved);
    await bookings.execute(); // Refresh
  }, []);

  const handleComplete = useCallback(async (id) => {
    await complete.execute(id);
    await bookings.execute(); // Refresh
  }, []);

  return {
    bookings: bookings.data,
    isLoading: bookings.isLoading,
    error: bookings.error,
    handleRespond,
    handleComplete,
  };
};

// Usage
const { bookings, handleRespond } = useBookings();
```

### Reusable Form Component

```jsx
// components/RoleSelectForm.jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Button } from './UI';

const schema = z.object({
  role: z.enum(['renter', 'owner']),
});

export const RoleSelectForm = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <select {...register('role')} className="mb-4">
        <option value="">Select Role</option>
        <option value="renter">Renter</option>
        <option value="owner">Owner</option>
      </select>
      {errors.role && <p className="text-red-500">{errors.role.message}</p>}
      <Button type="submit">Continue</Button>
    </form>
  );
};
```

---

## 📚 Best Practices

### ✓ Do's
- Use `useApi` for all API calls
- Validate forms with Zod
- Use `ProtectedRoute` for auth pages
- Handle errors gracefully
- Show loading states
- Reset form after submission

### ✗ Don'ts
- Don't fetch in render (use useEffect)
- Don't make API calls directly in components
- Don't hardcode API URLs
- Don't skip error handling
- Don't leave forms unvalidated
- Don't forget loading states

---

## 🧪 Testing Examples

### Testing useApi Hook

```jsx
import { renderHook, act } from '@testing-library/react';
import { useApi } from '../hooks/useApi';

test('useApi fetches data', async () => {
  const mockFetch = jest.fn().mockResolvedValue({ id: 1, name: 'Test' });
  const { result } = renderHook(() => useApi(mockFetch));

  expect(result.current.isLoading).toBe(false);

  await act(async () => {
    await result.current.execute();
  });

  expect(result.current.data).toEqual({ id: 1, name: 'Test' });
});
```

### Testing Protected Route

```jsx
import { render } from '@testing-library/react';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AuthProvider } from '../context/AuthContext';

test('ProtectedRoute redirects unauthenticated users', () => {
  const { getByText } = render(
    <AuthProvider>
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    </AuthProvider>
  );

  expect(getByText(/login/i)).toBeInTheDocument();
});
```

---

## 💡 Tips & Tricks

1. **Extract API calls to hooks**
   ```jsx
   const useGetCars = () => {
     const api = useApi(carsService.getAllCars);
     useEffect(() => api.execute(), []);
     return api;
   };
   ```

2. **Chain API calls**
   ```jsx
   const { execute: fetch1 } = useApi(service1);
   const { execute: fetch2 } = useApi(service2);
   
   const handleChain = async () => {
     const data1 = await fetch1();
     const data2 = await fetch2(data1.id);
   };
   ```

3. **Conditional rendering patterns**
   ```jsx
   {isLoading && <LoadingSpinner />}
   {error && <ErrorMessage error={error} />}
   {data && <DataDisplay data={data} />}
   ```

---

**Happy coding with these patterns! They'll help you build consistent, maintainable code.** 🎉

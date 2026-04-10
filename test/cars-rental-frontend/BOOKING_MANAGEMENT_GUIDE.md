# Owner Dashboard - Booking Management Documentation

## Overview

The Owner Dashboard Booking Management system is a comprehensive interface that allows car owners to:
- View all booking requests from renters
- Approve or reject pending booking requests
- Mark completed rentals
- Filter bookings by status
- Manage their fleet and track bookings

## Architecture

### Components

#### 1. **OwnerDashboard.jsx**
Main dashboard component that serves as the hub for owners. Features:
- **Quick Stats**: Shows total cars, pending requests, and total bookings
- **My Fleet Section**: Table displaying all owner's cars with status
- **BookingManagement**: Full booking management interface
- Real-time data fetching using custom `useApi` hook

#### 2. **BookingManagement.jsx**
Dedicated component for managing booking requests. Features:
- **Status Filtering**: Filter bookings by status (Pending, Approved, Rejected, Completed)
- **BookingCard Component**: Displays individual booking details with actions
- **Action Handlers**: 
  - Approve booking
  - Reject booking
  - Mark as complete
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Confirmation messages for actions

### Data Flow

```
OwnerDashboard
├── Fetches owner's cars from API
├── Fetches owner's bookings from API
└── BookingManagement
    ├── Displays bookings with filtering
    ├── Handles approve/reject actions
    └── Handles complete actions
```

## API Integration

### Endpoints Used

1. **Get Owner's Bookings**
   ```
   GET /api/booking/owner/requests
   ```
   Returns array of booking objects with properties:
   - `id`: Booking ID
   - `carId`: Associated car ID
   - `carModel`: Car model name
   - `carYear`: Car year
   - `renterName`: Name of the renter
   - `startDate`: Rental start date
   - `endDate`: Rental end date
   - `numberOfDays`: Duration of rental
   - `totalPrice`: Total rental price
   - `status`: Current booking status (pending, approved, rejected, completed)
   - `notes`: Optional booking notes

2. **Respond to Booking Request**
   ```
   PATCH /api/booking/{id}/respond
   Body: { "approved": boolean }
   ```
   Updates booking status to approved or rejected

3. **Complete Booking**
   ```
   POST /api/booking/{id}/complete
   ```
   Marks a booking as completed

4. **Get Owner's Cars**
   ```
   GET /api/cars/owner/my-cars
   ```
   Returns array of car objects owned by the user

## Component Props

### BookingCard Props
```typescript
interface BookingCardProps {
  booking: {
    id: number;
    renterName: string;
    carModel: string;
    carYear: number;
    startDate: string;
    endDate: string;
    numberOfDays: number;
    totalPrice: number;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    notes?: string;
  };
  onRespond: (bookingId: number, approved: boolean) => Promise<void>;
  onComplete: (bookingId: number) => Promise<void>;
  isProcessing: boolean;
}
```

## State Management

The component uses React hooks and Context API:
- **Local State**: `filterStatus`, `isProcessing`, `successMessage`
- **API State**: `data`, `isLoading`, `error` from `useApi` hook
- **Auth Context**: User information and role validation

## Error Handling

1. **API Errors**: Displayed as error banners to user
2. **Network Errors**: Graceful error messages with retry capability
3. **Authorization Errors**: Automatically handled by Axios interceptor
4. **Validation Errors**: Client-side form validation before submission

## Status Management

### Booking Status Flow
```
Pending
├── Approved → Ready for rental → Complete
└── Rejected → Booking cancelled
```

### Visual Indicators
- **Pending**: Yellow badge
- **Approved**: Green badge
- **Rejected**: Red badge
- **Completed**: Blue badge

## Features in Detail

### 1. Status Filtering
Users can filter bookings by status using button tabs:
- All (shows all bookings)
- Pending (only awaiting approval)
- Approved (accepted bookings)
- Rejected (declined bookings)
- Completed (finished rentals)

### 2. Booking Information Display
Each booking card shows:
- Renter's name
- Car model and year
- Pick-up and return dates
- Total rental price
- Duration in days
- Rental notes (if any)
- Current status
- Available actions based on status

### 3. Quick Actions
**For Pending Bookings:**
- ✅ **Approve**: Accept the booking request
- ❌ **Reject**: Decline the booking request

**For Approved Bookings:**
- ✓ **Mark as Complete**: Finalize the rental

### 4. Real-time Updates
After an action is performed:
- Success message displays for 3 seconds
- Booking list automatically refreshes
- Component re-fetches data from API
- UI updates to reflect new status

## Usage Example

```jsx
import OwnerDashboard from './pages/Owner/OwnerDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

// In App.jsx
<Route
  path="/owner-dashboard"
  element={
    <ProtectedRoute allowedRoles={['owner']}>
      <OwnerDashboard />
    </ProtectedRoute>
  }
/>
```

## Performance Considerations

1. **Lazy Loading**: Bookings load on mount and after user actions
2. **Memoization**: Consider using React.memo for BookingCard if list grows large
3. **Pagination**: Can be added if booking list exceeds reasonable size
4. **Caching**: API responses can be cached to reduce network requests

## Accessibility Features

- Semantic HTML elements (buttons, table headers)
- Clear visual status indicators
- Proper button labels and descriptions
- Error messages clearly associated with actions
- Keyboard navigation support for buttons and tabs

## Testing Scenarios

### Unit Tests
- Filter functionality
- Status badge rendering
- Button enabled/disabled states
- Error message display

### Integration Tests
- API call triggering
- Data loading and display
- Action button functionality
- Status update propagation

### E2E Tests
- Complete booking approval flow
- Complete booking rejection flow
- Complete booking completion flow
- Filter switching and display

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## Known Limitations & Future Enhancements

### Limitations
- No pagination for large booking lists
- No sorting options
- Single-action processing (no batch operations)
- No notifications for new bookings

### Planned Enhancements
- Real-time WebSocket notifications
- Pagination and infinite scroll
- Advanced filtering and sorting
- Booking analytics dashboard
- Message system between owner and renter
- Automatic email notifications
- Booking calendar view

## Troubleshooting

### Bookings not loading
1. Check API endpoint is accessible
2. Verify user is authenticated (token in localStorage)
3. Ensure user role is 'owner'
4. Check browser console for error messages

### Actions not working
1. Verify network connection
2. Check API server is running
3. Verify booking status before action
4. Check user permissions

### UI not updating
1. Try refreshing the page
2. Clear browser cache
3. Check for JavaScript errors in console
4. Verify React DevTools shows state changes

## Related Files

- `src/services/api.js` - API calls
- `src/context/AuthContext.jsx` - Authentication state
- `src/hooks/useApi.js` - API hook
- `src/components/UI.jsx` - UI components
- `src/services/axiosInstance.js` - Axios configuration

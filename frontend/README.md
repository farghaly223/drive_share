# Car Rental Frontend

A modern React-based frontend for the Car Rental application, providing a seamless experience for both renters and car owners.

## Features

### For Renters
- **User Authentication**: Register and login with email
- **Browse Cars**: View all available cars with detailed information
- **Filter & Search**: Filter cars by price, location, type, and search terms
- **Car Details**: View complete information about each car including images and specifications
- **Booking Management**: Request rental bookings with date selection
- **My Bookings**: Track your rental requests and their status

### For Car Owners
- **Add Cars**: List your vehicles for rental
- **Manage Listings**: Edit and delete your car listings
- **Booking Requests**: Respond to rental requests from renters
- **Car Management**: View and manage all your listed cars

## Technology Stack

- **React 19**: UI framework
- **React Router v6**: Client-side routing
- **Axios**: HTTP client for API calls
- **Vite**: Build tool and development server
- **CSS3**: Styling with modern features

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API Base URL**
   Update the `API_BASE_URL` in `src/services/api.js`:
   ```javascript
   const API_BASE_URL = 'http://localhost:5000/api';
   ```
   Make sure this matches your backend server address.

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable components
│   └── Navigation.jsx   # Top navigation bar
├── pages/              # Page components
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   ├── Browse.jsx      # Car browsing/listing page
│   ├── CarDetails.jsx  # Individual car details page
│   ├── MyBookings.jsx  # User's bookings page
│   └── MyCars.jsx      # Car owner's car management page
├── context/            # React Context
│   └── AuthContext.jsx # Authentication context and provider
├── services/           # API services
│   └── api.js         # Axios instance with interceptors
├── hooks/             # Custom React hooks
│   └── useAuth.js     # Auth context hook
├── App.jsx            # Main app with routing
├── App.css            # Global styles
├── main.jsx           # Entry point
└── index.css          # Base styles
```

## API Integration

The frontend communicates with the backend via the API service layer in `src/services/api.js`.

### Available API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

#### Cars/Browsing
- `GET /api/browsing/all` - Get all cars
- `GET /api/browsing/filter` - Filter cars (params: search, maxPrice, location, carType)
- `GET /api/browsing/{id}` - Get car details
- `POST /api/cars` - Add new car (owner only)
- `DELETE /api/cars/{id}` - Delete car (owner only)

#### Bookings
- `POST /api/booking/request` - Request rental booking
- `PATCH /api/booking/{id}/respond` - Accept/reject booking (owner only)
- `PATCH /api/booking/{id}/complete` - Mark booking as complete

## Authentication

The app uses JWT token-based authentication:
- Tokens are stored in localStorage
- Tokens are automatically included in request headers via Axios interceptor
- User data is persisted in localStorage
- Login/Register redirects to browsing page on success

## Usage Examples

### Register as a New User
1. Click "Register" in navigation
2. Fill in personal details
3. Select account type (Renter or Owner)
4. Create account

### Browse & Book a Car
1. Go to "Browse Cars"
2. Use filters to find cars
3. Click "View Details" on a car
4. Select dates and submit booking request

### Add Car (For Owners)
1. After registering as owner, go to "My Cars"
2. Click "+ Add New Car"
3. Fill in car details
4. Submit form

## Styling

The application uses a gradient color scheme:
- Primary: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Secondary colors for various UI elements
- Responsive design that works on mobile and desktop

## Development

### Build for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

### Preview Production Build
```bash
npm run preview
```

## Error Handling

The app includes comprehensive error handling:
- API errors are caught and user-friendly messages are displayed
- Form validation with field-level error messages
- Authentication redirects for protected routes
- Network error handling with retry logic via API interceptors

## State Management

- **Authentication**: React Context API (AuthContext)
- **Component State**: React Hooks (useState, useEffect)
- **API Calls**: Axios with interceptors

No Redux or similar state management library is used for simplicity.

## Future Enhancements

- [ ] Add profile management page
- [ ] Implement ratings and reviews
- [ ] Add payment integration
- [ ] Real-time notifications for bookings
- [ ] Advanced search filters
- [ ] Saved favorites/wishlist
- [ ] Message system between renters and owners
- [ ] Admin dashboard

## Troubleshooting

### CORS Errors
Make sure your backend is configured to allow requests from `http://localhost:5173`. Check the CORS configuration in your backend's `Program.cs`.

### API Connection Failed
Verify that:
1. Backend server is running
2. API_BASE_URL in `src/services/api.js` is correct
3. Backend is listening on the specified port

### Login/Register Not Working
1. Check browser console for error messages
2. Verify backend endpoints are working with Postman
3. Ensure JWT secret is configured in backend

## Support

For issues or questions, please check:
- Backend API documentation
- React Router documentation
- Axios documentation

## License

This project is part of the Car Rental System.

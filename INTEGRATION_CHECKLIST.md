# 🔧 Frontend-Backend Integration Checklist

Use this checklist to verify your setup is complete and working correctly.

## ✅ Pre-Setup

- [ ] Node.js installed (v16+)
- [ ] .NET SDK installed (v8.0+)
- [ ] MySQL running and accessible
- [ ] Both frontend and backend folders present

## ✅ Backend Setup

### Database
- [ ] Database `car_rental_db` created
- [ ] `appsettings.json` has correct connection string
- [ ] Database migrations applied (`dotnet ef database update`)

### Configuration
- [ ] JWT secret configured in `appsettings.json`
- [ ] CORS enabled in `Program.cs`
- [ ] API controllers registered in dependency injection

### Running
- [ ] `dotnet run` executes without errors
- [ ] Backend listens on `http://localhost:5000`
- [ ] Swagger/API documentation available at `http://localhost:5000/swagger`

## ✅ Frontend Setup

### Installation
- [ ] Node dependencies installed (`npm install`)
- [ ] No installation errors in terminal

### Configuration
- [ ] `src/services/api.js` has correct `API_BASE_URL`
- [ ] URL matches backend address (e.g., `http://localhost:5000/api`)
- [ ] No hardcoded credentials in files

### Running
- [ ] `npm run dev` executes without errors
- [ ] Frontend available at `http://localhost:5173`
- [ ] Browser auto-opens or can manually navigate to it

## ✅ API Connectivity Tests

### Test 1: Health Check
- [ ] Backend API responds to GET `/api/browsing/all`
- [ ] Returns car list (even if empty)

### Test 2: Authentication
- [ ] Can register new user via `/api/auth/register`
- [ ] Received JWT token in response
- [ ] Can login via `/api/auth/login`
- [ ] Login returns valid JWT token

### Test 3: Token Usage
- [ ] JWT token saved to localStorage
- [ ] Token appears in Authorization header of subsequent requests
- [ ] Protected endpoints work with valid token
- [ ] Protected endpoints fail with invalid/missing token

### Test 4: Full User Flow
- [ ] Register on frontend website
- [ ] Login after registration
- [ ] Browse cars on `/browse` page
- [ ] View car details
- [ ] Can submit booking request

## ✅ Backend API Endpoints

### Authentication Endpoints
- [ ] `POST /api/auth/register` works
- [ ] `POST /api/auth/login` works
- [ ] Returns proper success/error messages

### Cars Endpoints
- [ ] `GET /api/browsing/all` returns cars
- [ ] `GET /api/browsing/filter` filters work
- [ ] `GET /api/browsing/{id}` returns single car
- [ ] `POST /api/cars` creates new car (with auth)
- [ ] `DELETE /api/cars/{id}` deletes car

### Booking Endpoints
- [ ] `POST /api/booking/request` creates booking (requires auth)
- [ ] `PATCH /api/booking/{id}/respond` accepts booking (owner only)
- [ ] `PATCH /api/booking/{id}/complete` completes booking

## ✅ Frontend Pages

### Authentication Pages
- [ ] Login page loads
- [ ] Register page loads
- [ ] Form validation works
- [ ] Can successfully register
- [ ] Can successfully login
- [ ] Token stored in localStorage after login
- [ ] Redirects to browse after login

### Browse Page
- [ ] Displays all cars from database
- [ ] Search filter works
- [ ] Price filter works
- [ ] Location filter works
- [ ] Car type filter works
- [ ] Can click "View Details"

### Car Details Page
- [ ] Shows full car information
- [ ] Displays car images (if available)
- [ ] Shows all specifications
- [ ] Date picker works
- [ ] Can submit booking (if logged in as renter)
- [ ] Redirects to login if not authenticated

### My Bookings Page
- [ ] Only accessible when logged in
- [ ] Shows list of user's bookings (or empty state)
- [ ] Displays booking status

### My Cars Page
- [ ] Only visible in nav if logged in as owner
- [ ] Shows empty state or car list
- [ ] "Add New Car" form works
- [ ] Can submit new car form

### Navigation
- [ ] Shows correct links based on auth status
- [ ] Displays user name when logged in
- [ ] Logout button works
- [ ] Clears localStorage and redirects

## ✅ Error Handling

### Network Errors
- [ ] Shows error message if backend is down
- [ ] Form validates before submission
- [ ] Field errors display correctly

### Authentication Errors
- [ ] Wrong password shows error
- [ ] Duplicate email shows error
- [ ] Expired token triggers re-login
- [ ] Missing token blocks protected routes

### Data Errors
- [ ] Invalid car ID shows "not found"
- [ ] API errors are user-friendly
- [ ] No sensitive errors exposed

## ✅ Browser DevTools Check

### Console (F12 → Console)
- [ ] No JavaScript errors
- [ ] No unhandled promise rejections
- [ ] No missing resource errors

### Network Tab (F12 → Network)
- [ ] API requests show correct URL
- [ ] Response codes are correct (200, 400, 401, etc.)
- [ ] Authorization header contains Bearer token
- [ ] CORS headers are present

### Storage (F12 → Storage)
- [ ] localStorage contains `token`
- [ ] localStorage contains `user` (JSON)
- [ ] No sensitive data in cookies

### Performance (F12 → Performance)
- [ ] Page loads in < 3 seconds
- [ ] No memory leaks on navigation
- [ ] Smooth transitions and animations

## ✅ Production Ready

### Code Quality
- [ ] No console.log() statements left
- [ ] No TODO comments in critical code
- [ ] All error handling in place

### Documentation
- [ ] README.md is updated
- [ ] SETUP_GUIDE.md is accurate
- [ ] API endpoints documented

### Security
- [ ] No hardcoded credentials
- [ ] JWT token properly managed
- [ ] CORS configured correctly
- [ ] No sensitive data in localStorage except JWT

## ✅ Performance Optimization

- [ ] Frontend build size checked (`npm run build`)
- [ ] Images optimized
- [ ] Unnecessary dependencies removed
- [ ] Lazy loading ready

## Troubleshooting

If any checkbox is failed:

1. **API Connection Issues**
   - Verify backend is running
   - Check API_BASE_URL in api.js
   - Test with Postman or curl

2. **CORS Issues**
   - Check CORS config in Program.cs
   - Verify UseCors() is called
   - Allow frontend origin

3. **Database Issues**
   - Check MySQL is running
   - Verify connection string
   - Run migrations: `dotnet ef database update`

4. **Token Issues**
   - Check JWT secret matches
   - Verify token format in headers
   - Check token expiration

5. **Build Issues**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Clear Vite cache: `rm -rf .vite`
   - Rebuild: `npm run build`

## Sign-Off

When all checkboxes are complete:

✅ **Frontend-Backend integration is complete and tested**

Ready for:
- [ ] User testing
- [ ] Load testing
- [ ] Security audit
- [ ] Production deployment

---

**Date Completed:** _____________

**Tested By:** _____________

**Notes:** _____________

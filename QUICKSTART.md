# 🚀 Quick Start Guide

Get the Car Rental application running in 5 minutes!

## Step 1: Start the Backend (Terminal 1)

```bash
cd cars_rental
dotnet run
```

✅ **Backend will be running on:** `http://localhost:5000`

Look for message: `Now listening on: http://localhost:5000`

## Step 2: Start the Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

✅ **Frontend will be running on:** `http://localhost:5173`

Look for message: `Local: http://localhost:5173`

## Step 3: Open Your Browser

Go to: **http://localhost:5173**

🎉 **You're done!**

## What to Try

### As a Renter:
1. Click **Register** 
2. Fill in details, select "Renter" as type
3. Create account
4. Browse cars 🚗
5. Click on a car to see details
6. Try booking a car 📅

### As a Car Owner:
1. Click **Register**
2. Fill in details, select "Owner" as type
3. Create account
4. Go to **My Cars**
5. Click **+ Add New Car**
6. Fill in car details
7. See your car in browse page

## If Something Goes Wrong

### Frontend not loading?
- ✅ Check both terminals show "listening" messages
- ✅ Refresh browser (`Ctrl+R` or `Cmd+R`)
- ✅ Check http://localhost:5173 is correct URL

### Can't login or register?
- ✅ Make sure backend is running
- ✅ Check console (F12) for error messages
- ✅ Verify database is connected (backend should show no errors)

### No cars showing?
- ✅ Add some cars as an owner first
- ✅ Check backend database has data

### Still having issues?
See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed troubleshooting

## Making Requests Work

The frontend talks to backend at: `http://localhost:5000/api`

If your backend is on different port/address:
1. Open `frontend/src/services/api.js`
2. Change this line:
   ```javascript
   const API_BASE_URL = 'http://localhost:5000/api';
   ```
3. Save and refresh browser

## Key Files to Know

**Frontend Configuration:**
- `frontend/src/services/api.js` - API connection settings
- `frontend/package.json` - Dependencies

**Backend Configuration:**
- `cars_rental/appsettings.json` - Database & JWT settings
- `cars_rental/Program.cs` - CORS configuration

## Common Commands

### Frontend
```bash
npm run dev      # Start development
npm run build    # Build for production
npm run lint     # Check code style
```

### Backend
```bash
dotnet run       # Start server
dotnet build     # Compile
dotnet watch run # Auto-reload on changes
```

## Testing with Tools

### Test API with curl
```bash
# Get all cars
curl http://localhost:5000/api/browsing/all

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

### Test with Postman
1. Import API collection
2. Test each endpoint
3. Copy auth token to other requests

## Need More Help?

📖 Full Docs:
- [Frontend README](frontend/README.md)
- [Setup Guide](SETUP_GUIDE.md)
- [Frontend Summary](FRONTEND_SUMMARY.md)

Happy coding! 🎉

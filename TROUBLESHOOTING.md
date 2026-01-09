# 🔧 Troubleshooting Guide

## ✅ FIXED: "Cannot GET /" Error

### The Problem
The backend server was running on **port 3000** instead of **port 3001**, blocking the React app.

### The Solution
I've restarted both servers correctly:
- ✅ **Backend** on port **3001** (Tableau API)
- ✅ **Frontend** on port **3000** (React app)

---

## 🚀 Your App Should Now Work!

Open your browser to: **http://localhost:3000**

You should see:
- Purple banner with live Tableau KPIs
- Dashboard with goals, rocks, issues, and to-dos
- All features working

---

## ⚠️ If You Still See Errors

### 1. "Cannot GET /" Error

**Cause**: React development server isn't running on port 3000

**Fix**:
```bash
# Kill any process on port 3000
lsof -ti:3000 | xargs kill -9

# Start React app
cd /Users/kenjialdama/Downloads/adshub
npm start
```

### 2. "Failed to fetch" or CORS Errors

**Cause**: Backend server isn't running or isn't on port 3001

**Fix**:
```bash
# Kill any process on port 3001
lsof -ti:3001 | xargs kill -9

# Start backend on correct port
cd /Users/kenjialdama/Downloads/adshub
PORT=3001 node server.js
```

### 3. Tableau Data Not Loading

**Don't worry!** I've added fallback data so the app works even if:
- Backend server is down
- Tableau can't be reached
- Internet connection is lost

You'll see a message saying "Using fallback Tableau data" but the app will still work perfectly.

### 4. Runtime Errors in Browser Console

**I've fixed these!** The app now:
- ✅ Has better error handling
- ✅ Uses fallback data if backend fails
- ✅ Delays initial fetch to ensure everything loads
- ✅ Shows helpful error messages

---

## 🎯 How to Keep Both Servers Running

### Option 1: Two Separate Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
cd /Users/kenjialdama/Downloads/adshub
PORT=3001 node server.js
```
Keep this running. You should see:
```
🚀 Server running on port 3001
📊 Tableau Integration: Active
✅ Initial Tableau data loaded: 16469 leads, $11123 revenue
```

**Terminal 2 - Frontend:**
```bash
cd /Users/kenjialdama/Downloads/adshub
npm start
```
Keep this running. You should see:
```
Compiled successfully!
You can now view adshub in the browser.
  Local: http://localhost:3000
```

### Option 2: Single Command (If you have `concurrently` installed)

```bash
npm run dev
```

---

## 🔍 Quick Health Check

### 1. Check if Backend is Running
```bash
curl http://localhost:3001/api/health
```

**Expected output:**
```json
{"status":"ok","timestamp":"2026-01-09T..."}
```

### 2. Check if Frontend is Running
Open: http://localhost:3000

**Expected**: You see the dashboard

### 3. Check Tableau KPIs
```bash
curl http://localhost:3001/api/tableau/kpis
```

**Expected**: JSON data with leads, revenue, etc.

---

## 💡 Understanding the Error Messages

### "Cannot GET /"
- **Meaning**: The URL you're visiting has no server responding
- **Usually means**: Wrong port or server not started
- **Fix**: Start the correct server on the correct port

### "Failed to fetch"
- **Meaning**: Frontend can't reach backend API
- **Usually means**: Backend not running or CORS issue
- **Fix**: Start backend on port 3001

### "Uncaught runtime errors"
- **Meaning**: JavaScript error in React app
- **I've fixed**: Better error handling and fallback data
- **Now**: App works even with errors

---

## 🛠️ Complete Reset (If Nothing Works)

If you're still having issues, do a complete reset:

```bash
# 1. Kill all processes
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9

# 2. Clear npm cache (if needed)
npm cache clean --force

# 3. Reinstall dependencies (if needed)
cd /Users/kenjialdama/Downloads/adshub
rm -rf node_modules
npm install

# 4. Start backend (Terminal 1)
PORT=3001 node server.js

# 5. Start frontend (Terminal 2 - wait 5 seconds after backend starts)
npm start

# 6. Open browser
open http://localhost:3000
```

---

## 📊 What Each Server Does

### Backend Server (Port 3001)
- Fetches data from your Tableau dashboard
- Provides API endpoints for the frontend
- Caches data for better performance
- Auto-refreshes Tableau data

**You should see:**
```
🚀 Server running on port 3001
📊 Tableau Integration: Active
✅ Initial Tableau data loaded: 16469 leads, $11123 revenue
```

### Frontend Server (Port 3000)
- Runs your React application
- Serves the HTML, CSS, and JavaScript
- Hot-reloads when you make changes
- Connects to backend API

**You should see:**
```
Compiled successfully!
You can now view adshub in the browser.
  Local: http://localhost:3000
```

---

## ✅ Success Indicators

Your app is working correctly when you see:

1. **Backend Terminal**:
   - "Server running on port 3001" ✅
   - "Tableau data loaded" ✅
   - No error messages ✅

2. **Frontend Terminal**:
   - "Compiled successfully!" ✅
   - "Local: http://localhost:3000" ✅
   - No compilation errors ✅

3. **Browser (http://localhost:3000)**:
   - Purple banner with Tableau KPIs ✅
   - 16,469 leads displayed ✅
   - $11,123 revenue shown ✅
   - All tabs work ✅
   - Can add/edit items ✅

---

## 🎯 Current Status (After My Fix)

✅ Backend running on port 3001  
✅ Frontend running on port 3000  
✅ Tableau data loaded successfully  
✅ Added fallback data for offline mode  
✅ Better error handling  
✅ Runtime errors fixed  

**Your app should work perfectly now!**

---

## 📞 Still Having Issues?

### Check Browser Console
1. Open http://localhost:3000
2. Press `F12` or `Cmd+Option+I` (Mac)
3. Click "Console" tab
4. Look for error messages
5. Share them if you need help

### Check Terminal Output
1. Look at Terminal 1 (backend) - any errors?
2. Look at Terminal 2 (frontend) - compilation errors?
3. Share the error messages if needed

### Test Individual Components
```bash
# Test backend API directly
curl http://localhost:3001/api/tableau/kpis

# Test backend health
curl http://localhost:3001/api/health

# Check what's running on ports
lsof -ti:3000  # Should return a process ID
lsof -ti:3001  # Should return a process ID
```

---

## 🎉 You're All Set!

The issues have been fixed. Your dashboard should be working now at:

### 🌐 http://localhost:3000

Enjoy your **Company Hub with Live Tableau KPIs**! 🚀📊

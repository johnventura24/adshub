# 🔧 Fix: 502 Bad Gateway on Render

## What's Happening

**502 Bad Gateway** means:
- ✅ Your app started successfully
- ❌ But then it crashed or became unresponsive
- ❌ Render's health check is failing

---

## 🔍 Debugging Steps

### **Step 1: Check Render Logs**

1. Go to: https://dashboard.render.com/
2. Click your service
3. Click **"Logs"** tab
4. Look for error messages after "Server running on..."

**Common errors to look for:**
```
Error: Cannot find module 'axios'
Error: Cannot find module 'cheerio'
Error: Cannot find module 'dotenv'
TypeError: ...
ReferenceError: ...
```

---

## 🐛 Most Likely Issues & Fixes

### **Issue 1: Missing Dependencies**

**Problem**: Backend dependencies not in `dependencies` (they're in `devDependencies`)

**Check your package.json**:
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.6.1",
    "cors": "^2.8.5",
    "axios": "^1.4.0",      // ← Need these!
    "cheerio": "^1.0.0-rc.12",
    "dotenv": "^16.0.3"
  }
}
```

**If they're missing**, add them and redeploy.

---

### **Issue 2: Tableau Integration Crashing**

**Problem**: Tableau auto-extraction fails in production and crashes the server

**Fix**: Wrap Tableau initialization in try-catch

---

### **Issue 3: Build Folder Not Found**

**Problem**: `build` folder doesn't exist when server tries to serve it

**Check**: Did the build command run successfully?

---

### **Issue 4: Environment Variables Missing**

**Problem**: Required environment variables not set in Render

**Check Render Dashboard** → Environment:
```
NODE_ENV = production
TABLEAU_DASHBOARD_URL = (your URL)
```

---

## ✅ Quick Fix (Apply All 3)

### **Fix 1: Make Tableau Initialization Non-Blocking**

The server should start even if Tableau fetch fails.

### **Fix 2: Add Health Check Endpoint**

Render needs a `/health` endpoint that responds quickly.

### **Fix 3: Better Error Handling**

Don't let errors crash the entire server.

---

## 🚀 Immediate Solution

I'll update your code to handle these issues gracefully.

---

## 📊 What to Check in Logs

Look for these patterns:

### **Good (Server is running):**
```
🚀 Server running on 0.0.0.0:10000
📊 Tableau Integration: Active
```

### **Bad (Server crashed):**
```
Error: Cannot find module 'axios'
Error: ENOENT: no such file or directory, open '.../build/index.html'
TypeError: Cannot read property...
Process exited with code 1
```

---

## 🔄 After Applying Fixes

1. Push changes to GitHub
2. Redeploy on Render
3. Watch logs carefully
4. Look for "Server running" message
5. Wait 30 seconds for health check
6. Visit your URL

---

## 🆘 If Still Failing

Share the **exact error message** from Render logs (the part after "Server running on" or the crash error).

I'll provide a specific fix based on the actual error.

---

**Let me update your code with better error handling...**

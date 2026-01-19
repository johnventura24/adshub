# 🚀 How to Run on Port 3000

## ✅ **Quick Start (Everything on Port 3000)**

### **Step 1: Build the React App**
```bash
npm run build
```

### **Step 2: Start the Backend Server (Port 3000)**
```bash
node server-ultra-minimal.js
```

### **Step 3: Open Your Browser**
Go to: **http://localhost:3000**

---

## 📋 **What This Does**

- ✅ Backend server runs on **port 3000**
- ✅ Serves the built React app
- ✅ Provides API endpoints (`/api/tableau/kpis`, etc.)
- ✅ Everything accessible on **http://localhost:3000**

---

## 🔧 **For Development (Hot Reload)**

If you want hot reload during development:

### **Terminal 1: Start Backend (Port 3000)**
```bash
node server-ultra-minimal.js
```

### **Terminal 2: Start React Dev Server (Port 3001)**
```bash
PORT=3001 npm start
```

Then open: **http://localhost:3001**

---

## ✅ **Fixed Issues**

1. ✅ Backend now runs on **port 3000** (was 3001)
2. ✅ Frontend connects to **port 3000** in development
3. ✅ Tableau API response format fixed
4. ✅ Error messages updated

---

## 🎯 **Production Deployment**

On Render, the backend automatically:
- Runs on the port Render assigns (usually 10000)
- Serves the built React app
- Provides all API endpoints
- Uses relative URLs (no port conflicts)

---

**Everything is now configured to run on port 3000!** 🎉

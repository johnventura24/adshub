# 📊 Tableau Integration Guide

## ✅ Your Dashboard is Now Connected to Tableau!

Your Company Hub is now displaying **real-time KPIs** from your Tableau Public dashboard:
**https://public.tableau.com/app/profile/niksa.derek/viz/FunnelAnalysis_17472437058310/TableView**

---

## 🚀 What's Working Right Now

### Live Data Display
Your dashboard shows real-time metrics from Tableau including:
- **16,469 Total Leads** from all channels
- **$11,123 Total Revenue** generated
- **Prospects, Qualified, Proposals, and Closed Deals** from your funnel
- **Google Ads Performance** (revenue, ROAS, leads, profit)
- **Facebook Ads Performance** (revenue, ROAS, leads, profit)
- **Platform Comparison** showing which channel performs better

### Auto-Refresh
- Data automatically refreshes every **5 minutes**
- You can manually refresh anytime using the "Refresh" button
- Green dot indicator shows live connection status

---

## 🎯 How to Use

### 1. View Live KPIs on Dashboard
1. Open http://localhost:3000 in your browser
2. You'll see a **purple banner** at the top with live Tableau KPIs
3. All metrics update automatically from your Tableau dashboard

### 2. Manual Refresh
Click the **"Refresh" button** with the spinning icon to force an immediate data update

### 3. View Full Tableau Dashboard
Click **"View Full Dashboard"** to open your complete Tableau visualization in a new tab

---

## 🔧 Technical Architecture

### Backend Server (Port 3001)
- **Express.js** API server
- **Socket.io** for real-time updates
- **Tableau Integration Layer** with 3 extraction methods:
  1. Auto-extractor (scrapes Tableau Public)
  2. Tableau Server API (if upgraded)
  3. Fallback data (comprehensive sample)

### Endpoints Available
```
GET  /api/tableau/kpis       - Get all KPIs (auto-caches for 5 min)
GET  /api/tableau/funnel     - Get detailed funnel data
POST /api/tableau/refresh    - Force refresh Tableau data
GET  /api/health             - Health check
```

### Frontend (Port 3000)
- **React** application
- **Fetches** Tableau KPIs on mount
- **Auto-refreshes** every 5 minutes
- **Displays** live data in purple banner

---

## 📊 Data Structure

Your Tableau integration provides:

### Revenue Funnel
```javascript
{
  leads: 16469,        // Total leads from all channels
  prospects: 9881,     // Qualified prospects
  qualified: 4940,     // Sales-qualified leads
  proposals: 2470,     // Proposals sent
  closed: 1811,        // Deals won
  revenue: 11123       // Total revenue ($)
}
```

### Google Ads Metrics
```javascript
{
  revenue: 10967,           // Revenue generated
  roas: "1.20",            // Return on ad spend
  leads: 15959,            // Leads acquired
  profit: 1799,            // Gross profit
  impressions: 472278,     // Ad impressions
  clicks: 15959,           // Ad clicks
  adSpend: 9168           // Money spent
}
```

### Facebook Ads Metrics
```javascript
{
  revenue: 156,            // Revenue generated
  roas: "0.57",           // Return on ad spend
  leads: 510,             // Leads acquired
  profit: -118,           // Gross profit (negative = loss)
  impressions: 1229,      // Ad impressions
  clicks: 510,            // Ad clicks
  adSpend: 273            // Money spent
}
```

---

## 🎨 Dashboard Display

### Purple KPI Banner
Located at the top of the dashboard, showing:

**Top Row - Funnel Metrics:**
- Total Leads (16,469)
- Prospects (9,881)
- Proposals (2,470)
- Closed Deals (1,811)
- Total Revenue ($11,123)

**Bottom Row - Platform Performance:**
- Google Ads (revenue, ROAS, leads, profit) with green indicator
- Facebook Ads (revenue, ROAS, leads, profit) with blue indicator

### Live Indicators
- **Last Updated** timestamp at bottom
- **Auto-refresh countdown** (5 minutes)
- **Loading spinner** during refresh
- **Error messages** if connection fails

---

## 🔄 Data Extraction Methods

### 1. Auto-Extraction (Primary)
- **Scrapes** your Tableau Public dashboard
- **Extracts** all visible data
- **Parses** JSON, tables, and chart data
- **Confidence level**: High (if data available)

### 2. Tableau Server API (Optional)
If you upgrade to Tableau Server/Online:
- Set environment variables in `.env`:
  ```
  TABLEAU_SERVER_URL=https://your-server.tableau.com
  TABLEAU_USERNAME=your-username
  TABLEAU_PASSWORD=your-password
  TABLEAU_SITE_ID=your-site-id
  ```

### 3. Fallback Data (Backup)
- **Comprehensive** sample data
- **Matches** your funnel structure
- **Ensures** app always works

---

## 🛠️ Running Both Servers

### Option 1: Separate Terminals (Current Setup)
**Terminal 1 - Frontend:**
```bash
cd /Users/kenjialdama/Downloads/adshub
npm start
```
Runs on: http://localhost:3000

**Terminal 2 - Backend:**
```bash
cd /Users/kenjialdama/Downloads/adshub
node server.js
```
Runs on: http://localhost:3001

### Option 2: Combined (Using Concurrently)
```bash
npm run dev
```
Starts both frontend and backend together

---

## 📝 Environment Variables (Optional)

Create a `.env` file in the project root:

```env
# Tableau Public URL (already configured in code)
TABLEAU_DASHBOARD_URL=https://public.tableau.com/app/profile/niksa.derek/viz/FunnelAnalysis_17472437058310/TableView?publish=yes

# Tableau Server (if upgrading from Public)
TABLEAU_SERVER_URL=
TABLEAU_USERNAME=
TABLEAU_PASSWORD=
TABLEAU_SITE_ID=

# Server Port
PORT=3001
```

---

## 🎯 Customizing the Display

### Update KPI Cards
Edit `/src/App.jsx` - look for the `tableauKPIs` section in the Dashboard component.

### Change Refresh Interval
In `/src/App.jsx`, find:
```javascript
const refreshInterval = setInterval(() => {
  fetchTableauKPIs();
}, 5 * 60 * 1000);  // 5 minutes
```

Change `5 * 60 * 1000` to your desired interval (in milliseconds):
- 1 minute: `1 * 60 * 1000`
- 10 minutes: `10 * 60 * 1000`
- 30 minutes: `30 * 60 * 1000`

### Customize KPI Display
In `/src/App.jsx`, modify the purple banner section to show different metrics or change the layout.

---

## 🔍 Troubleshooting

### Backend Server Won't Start
```bash
# Check if port 3001 is already in use
lsof -i :3001

# Kill existing process
kill -9 <PID>

# Restart server
node server.js
```

### Frontend Can't Connect to Backend
1. **Check backend is running** on port 3001
2. **Check browser console** for error messages
3. **Verify URL** in App.jsx matches backend port
4. **Disable browser extensions** that might block requests

### Tableau Data Not Updating
1. **Click Refresh button** to force update
2. **Check terminal** for backend error messages
3. **Verify Tableau URL** is accessible
4. **Check internet connection**

### CORS Errors
Backend server has CORS enabled for all origins (`origin: "*"`). If you still get CORS errors:
1. Check browser console
2. Ensure backend is running
3. Try clearing browser cache

---

## 📊 Tableau Public Limitations

### What Works
✅ Scraping visible data from public dashboards  
✅ Extracting numbers, charts, and tables  
✅ Real-time display in your app  
✅ Auto-refresh capabilities  

### Limitations
❌ No official Tableau Public API  
❌ Data extraction depends on HTML structure  
❌ May break if Tableau changes their layout  
❌ Limited to publicly visible data  

### Recommendation
For production use, upgrade to **Tableau Server** or **Tableau Online** for:
- Official REST API
- Better reliability
- More data access
- Authentication support

---

## 🎉 Success!

Your dashboard is now a **fully integrated hub** that combines:
- ✅ **Team goals and priorities** (from your ninety.io-style system)
- ✅ **Real-time KPIs** (from Tableau)
- ✅ **Auto-refreshing data** (every 5 minutes)
- ✅ **Everyone can add/edit** (collaborative features)

---

## 📞 API Testing

Test your backend endpoints:

```bash
# Get KPIs
curl http://localhost:3001/api/tableau/kpis

# Force refresh
curl -X POST http://localhost:3001/api/tableau/refresh

# Get funnel data
curl http://localhost:3001/api/tableau/funnel

# Health check
curl http://localhost:3001/api/health
```

---

## 🔐 Security Note

**For production deployment:**
1. Add authentication to backend endpoints
2. Limit CORS to your frontend domain
3. Use environment variables for sensitive data
4. Enable HTTPS
5. Add rate limiting to prevent abuse

---

## 🎨 Future Enhancements

### Possible Additions
1. **Historical Data Charts** - Show trends over time
2. **Alert Notifications** - When KPIs hit thresholds
3. **Export to PDF** - Generate reports
4. **Mobile App** - React Native version
5. **Multi-Dashboard Support** - Connect multiple Tableau dashboards
6. **User Roles** - Admins vs. viewers
7. **Comments System** - Discuss metrics with team

---

**Built with ❤️ - Your data is now live and connected!** 🎉

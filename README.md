# 🎯 AdsHub - Company Dashboard

A modern, functional hub for managing company goals, rocks, issues, and todos with real-time Tableau KPI integration - inspired by ninety.io.

---

## ✨ Features

### **📊 Dashboard**
- Real-time KPI metrics from Tableau Public
- Live leads and revenue tracking
- Auto-refresh every 5 minutes

### **🎯 Goals Management**
- Add, edit, and delete company goals
- Track progress and status
- Persistent storage in browser

### **🪨 Rocks (Quarterly Priorities)**
- Manage 90-day priorities
- Assign owners and track completion
- Visual progress indicators

### **⚠️ Issues Tracker**
- Log and resolve company issues
- Priority levels and status tracking
- Team collaboration

### **✅ To-Dos**
- Task management for team members
- Completion tracking
- Due date management

### **📈 Scorecard**
- Weekly metrics tracking
- Goal vs actual comparisons
- Performance visualization

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18.x or higher
- npm or yarn

### **Installation**

```bash
# Clone the repository
git clone https://github.com/johnventura24/adshub.git
cd adshub

# Install dependencies
npm install

# Start development servers
npm run dev
```

This will start:
- React frontend on `http://localhost:3000`
- Node.js backend on `http://localhost:3001`

---

## 📦 Project Structure

```
adshub/
├── src/
│   ├── App.jsx              # Main React application
│   ├── App.css              # Application styles
│   ├── index.js             # React entry point
│   └── index.css            # Global styles (Tailwind)
├── public/
│   └── index.html           # HTML template
├── server.js                # Express backend server
├── tableau-integration.js   # Tableau data fetching
├── tableau-auto-extractor.js # Tableau data parsing
├── package.json             # Dependencies
├── tailwind.config.js       # Tailwind CSS config
└── render.yaml              # Render deployment config
```

---

## 🔧 Configuration

### **Environment Variables**

Create a `.env` file (optional):

```env
PORT=3001
NODE_ENV=development
TABLEAU_DASHBOARD_URL=https://public.tableau.com/app/profile/niksa.derek/viz/FunnelAnalysis_17472437058310/TableView?publish=yes
ENABLE_TABLEAU_AUTO_EXTRACT=true
```

### **Tableau Integration**

The dashboard automatically fetches data from your Tableau Public dashboard. To change the data source, update the URL in `render.yaml` or your `.env` file.

---

## 🌐 Deployment

### **Deploy to Render**

1. Push your code to GitHub
2. Connect your repository to Render
3. Render will automatically:
   - Install dependencies
   - Build the React app
   - Start the Node.js server
   - Deploy your site

**Deployment is configured in `render.yaml`**

---

## 🛠️ Development

### **Available Scripts**

```bash
# Start React development server
npm start

# Build for production
npm run build

# Start backend server
npm run server

# Run both frontend and backend
npm run dev
```

### **Tech Stack**

- **Frontend:** React 18, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express, Socket.io
- **Data:** Tableau Public API, Browser LocalStorage
- **Deployment:** Render

---

## 📖 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get started in 5 minutes
- **[START_HERE.md](START_HERE.md)** - Visual quick-start guide
- **[USAGE_GUIDE.md](USAGE_GUIDE.md)** - How to use all features
- **[FEATURES.md](FEATURES.md)** - Complete feature list
- **[TABLEAU_INTEGRATION.md](TABLEAU_INTEGRATION.md)** - Tableau setup details

---

## 🎨 Features in Detail

### **Dashboard View**
- Purple gradient header with company branding
- Real-time KPI banner showing leads and revenue
- Quick navigation to all sections
- Responsive design for all devices

### **Data Persistence**
- All data stored in browser's LocalStorage
- Automatic save on every change
- Data persists across sessions
- No database required for basic usage

### **Tableau Integration**
- Fetches live data from Tableau Public
- Caches data for 5 minutes to reduce API calls
- Lazy loading for fast server startup
- Graceful fallback if Tableau is unavailable

---

## 🔒 Security Notes

- This is a client-side application with browser storage
- For production use, consider adding:
  - User authentication
  - Database for persistent storage
  - API rate limiting
  - HTTPS/SSL certificates

---

## 🤝 Contributing

This is a private project, but improvements are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📝 License

Private project - All rights reserved

---

## 🆘 Support

For issues or questions:
1. Check the documentation in the `/docs` folder
2. Review `TROUBLESHOOTING.md`
3. Contact the development team

---

## 🎉 Acknowledgments

- Inspired by [ninety.io](https://www.ninety.io/)
- Built with modern web technologies
- Designed for team productivity

---

**Made with ❤️ for better team management**

# Company Hub - 90-Day Operating System with Live Tableau KPIs

A functional business management hub inspired by ninety.io, built with React and connected to **real-time Tableau data**. This application helps teams track goals, rocks (90-day priorities), issues, to-dos, and scorecard metrics all in one place, with **live KPI tracking from your Tableau dashboard**.

## 🚀 Features

### Dashboard with Live Tableau Integration
- **Real-Time Tableau KPIs**: Live data from your Tableau Public dashboard
- **Sales Funnel Metrics**: Leads, prospects, proposals, closed deals, and revenue
- **Platform Performance**: Google Ads and Facebook Ads metrics side-by-side
- **Auto-Refresh**: Data updates every 5 minutes automatically
- **Manual Refresh**: Click to get instant updates from Tableau
- **Visual Overview**: See all your key metrics at a glance
- **4 Key Stats Cards**: Goals on track, Rocks progress, Open issues, and Pending to-dos
- **Quick Access**: View summaries of all sections with quick add buttons

### Goals
- Track quarterly or annual goals
- Visual progress bars showing completion percentage
- Set target values and track current progress
- Edit or delete goals with a single click

### Rocks (90-Day Priorities)
- Manage your most important 90-day priorities
- Track owner, due date, and status (on-track, at-risk, off-track)
- Visual progress indicators with color-coded status
- Progress percentage tracking

### Issues
- Track and manage team issues
- Priority levels: Low, Medium, High, Critical
- Assign owners to issues
- Quick resolve/reopen functionality
- Color-coded priority badges

### To-Dos
- Create and manage team tasks
- Assign to team members
- Set due dates
- Check off completed items
- Visual strikethrough for completed tasks

### Scorecard
- Track key business metrics
- Set targets and actual values
- Trend indicators (up, down, neutral)
- Table view for easy comparison
- Color-coded performance (green for meeting targets, red for missing)

## 🎨 User Interface

- **Clean, Modern Design**: Inspired by ninety.io with a professional look
- **Intuitive Navigation**: Tab-based navigation between sections
- **Easy Add/Edit**: Every section has prominent "Add" buttons
- **Modal Forms**: Clean popup forms for adding and editing items
- **Responsive Layout**: Works on desktop and mobile devices
- **Visual Feedback**: Hover effects, color coding, and smooth transitions

## 💾 Data Persistence

All data is automatically saved to your browser's localStorage, so your information persists between sessions. No backend server required!

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Beautiful icon library
- **localStorage**: Browser-based data persistence

### Backend
- **Express.js**: Web server framework
- **Socket.io**: Real-time bidirectional communication
- **Axios**: HTTP client for API requests
- **Cheerio**: Web scraping for Tableau Public
- **Tableau Integration**: Connected to https://public.tableau.com/app/profile/niksa.derek/viz/FunnelAnalysis_17472437058310/TableView

## 📦 Installation

1. **Install Dependencies**:
```bash
npm install
```

2. **Start Backend Server** (in Terminal 1):
```bash
node server.js
```
Backend runs on `http://localhost:3001`

3. **Start Frontend** (in Terminal 2):
```bash
npm start
```
Frontend runs on `http://localhost:3000`

4. **Or Start Both Together**:
```bash
npm run dev
```

5. **Open in Browser**:
Navigate to `http://localhost:3000`

**Your Tableau dashboard will automatically load live KPIs!**

## 🎯 How to Use

### Adding Items
1. Navigate to any section (Goals, Rocks, Issues, To-Dos, or Scorecard)
2. Click the blue "Add [Item]" button
3. Fill in the form fields
4. Click "Add" to save

### Editing Items
1. Click the blue edit icon (pencil) next to any item
2. Update the form fields
3. Click "Save Changes"

### Deleting Items
1. Click the red delete icon (trash) next to any item
2. Confirm the deletion

### Dashboard Quick Actions
- Click the "+ Add" buttons in each dashboard section for quick access
- Click edit icons to quickly update items from the dashboard view
- Check/uncheck to-dos directly from the dashboard

## 🎨 Customization

The app uses Tailwind CSS, making it easy to customize colors and styles:

- Edit `tailwind.config.js` to change the color scheme
- Modify `src/App.jsx` to adjust layouts and components
- Update `src/index.css` for global styles

## 📱 Features Breakdown

### Everyone Can Add/Edit
✅ All sections have prominent "Add" buttons  
✅ Edit icons on every item  
✅ No permissions required - everyone has full access  
✅ Intuitive modal forms for data entry  
✅ Delete functionality with confirmation  

### Dashboard Highlights
✅ Summary statistics cards  
✅ Quick view of top items from each section  
✅ Direct editing from dashboard  
✅ Color-coded status indicators  

### Data Management
✅ Automatic saving to localStorage  
✅ No data loss between sessions  
✅ Instant updates across all views  
✅ No backend required  

## 🔧 Development

### Project Structure
```
adshub/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── App.jsx             # Main application component
│   ├── App.css             # Component styles
│   ├── index.js            # React entry point
│   └── index.css           # Global styles with Tailwind
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind configuration
└── postcss.config.js       # PostCSS configuration
```

### Building for Production
```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## 🌟 Key Differences from ninety.io

While inspired by ninety.io, this is a simplified, open-source version:
- Uses browser localStorage instead of a database
- No user authentication (single-team use)
- No real-time collaboration features
- Simplified feature set focused on core functionality
- Free and self-hosted

## 📊 Tableau Integration

Your dashboard is connected to:
**https://public.tableau.com/app/profile/niksa.derek/viz/FunnelAnalysis_17472437058310/TableView**

See `TABLEAU_INTEGRATION.md` for complete documentation on:
- How the integration works
- Available API endpoints
- Customization options
- Troubleshooting guide

### Live KPIs Displayed
- 📈 Total Leads & Revenue
- 🎯 Sales Funnel Metrics
- 💰 Google Ads Performance
- 📱 Facebook Ads Performance
- 🔄 Auto-refreshing every 5 minutes

## 📝 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Feel free to fork this project and customize it for your team's needs!

## 📞 Support

For questions or issues, refer to:
- `README.md` - This file (main documentation)
- `TABLEAU_INTEGRATION.md` - Tableau connection guide
- `USAGE_GUIDE.md` - Detailed usage instructions
- `FEATURES.md` - Complete feature list
- `QUICK_START.md` - Quick start guide

---

**Built with ❤️ for teams who want to stay organized and achieve their goals - now with real-time data!** 📊🚀

# Quick Start Guide - Company Hub

## 🎯 What is This?

Company Hub is a simple, powerful tool for managing your team's goals, priorities, and tasks. Think of it as your team's command center - everything you need to stay organized and on track, all in one place.

## 🚪 Getting Started

### First Time Setup

1. **Start the App**:
   - Open your terminal
   - Navigate to the project folder
   - Run `npm start`
   - Your browser will open to `http://localhost:3000`

2. **You'll See the Dashboard**:
   - This is your home base
   - It shows a summary of everything important
   - You can navigate to different sections using the tabs at the top

## 📊 Understanding the Sections

### 1. Dashboard (Home)
**What it shows**: A bird's-eye view of everything

- **4 Colored Cards** at the top show:
  - 🎯 Goals on Track (blue)
  - 📈 Rocks Progress (green)
  - ⚠️ Open Issues (orange)
  - ✅ To-Dos Pending (purple)

- **4 Sections Below** show:
  - Recent goals with progress bars
  - Current rocks with status
  - Open issues
  - Pending to-dos

**Quick Actions**: Click the "+ Add" button in any section to quickly create new items

### 2. Goals
**What it's for**: Track your big objectives (quarterly or yearly targets)

**Example Goals**:
- "Reach $1M in revenue by Q4"
- "Acquire 50 new customers this quarter"
- "Launch 3 new product features"

**How to Add a Goal**:
1. Click "Add Goal" button
2. Enter the goal title (e.g., "Q1 Revenue Target")
3. Set the target number (e.g., 1000000)
4. Set current progress (e.g., 750000)
5. Enter the time period (e.g., "Q1 2026")
6. Click "Add Goal"

**How to Edit**: Click the blue pencil icon next to any goal

### 3. Rocks (90-Day Priorities)
**What it's for**: Your team's most important projects for the next 90 days

**What is a "Rock"?**: 
- A major project or initiative
- Should be completable in 90 days
- Usually 3-7 rocks per quarter
- Named after the "big rocks" time management concept

**Example Rocks**:
- "Launch new website"
- "Hire 3 new sales reps"
- "Implement new CRM system"

**How to Add a Rock**:
1. Click "Add Rock" button
2. Enter the rock title
3. Assign an owner (person responsible)
4. Set the due date
5. Choose status (on-track, at-risk, or off-track)
6. Set progress percentage (0-100%)
7. Click "Add Rock"

**Status Guide**:
- 🟢 **On Track**: Everything going as planned
- 🟡 **At Risk**: Some concerns, might need help
- 🔴 **Off Track**: Serious issues, needs immediate attention

### 4. Issues
**What it's for**: Problems that need to be solved

**Example Issues**:
- "Website loading slowly"
- "Customer complaints about checkout process"
- "Team communication gaps"

**How to Add an Issue**:
1. Click "Add Issue" button
2. Describe the issue
3. Set priority (Low, Medium, High, Critical)
4. Assign an owner (person or team responsible)
5. Click "Add Issue"

**Priority Guide**:
- 🔵 **Low**: Can wait, not urgent
- 🟡 **Medium**: Should address soon
- 🟠 **High**: Important, address this week
- 🔴 **Critical**: Drop everything, fix now

**Resolving Issues**: Click the "Resolve" button when an issue is fixed

### 5. To-Dos
**What it's for**: Day-to-day tasks and action items

**Example To-Dos**:
- "Send proposal to client"
- "Review marketing materials"
- "Schedule team meeting"

**How to Add a To-Do**:
1. Click "Add To-Do" button
2. Enter the task description
3. Assign to a team member
4. Set the due date
5. Click "Add To-Do"

**Completing To-Dos**: Just click the checkbox next to any to-do to mark it complete

### 6. Scorecard
**What it's for**: Track your key business metrics week over week

**Example Metrics**:
- Customer Satisfaction Score
- Monthly Revenue
- Website Traffic
- Team Productivity
- Customer Retention Rate

**How to Add a Metric**:
1. Click "Add Metric" button
2. Enter the metric name
3. Set the target value
4. Enter the actual value
5. Choose the trend (up, down, or neutral)
6. Click "Add Metric"

**Reading the Scorecard**:
- 🟢 Green numbers = Meeting or exceeding target
- 🔴 Red numbers = Below target
- ↑ Up arrow = Improving
- ↓ Down arrow = Declining
- → Neutral = Staying the same

## 💡 Best Practices

### Daily Use
1. **Start your day** on the Dashboard to see what's important
2. **Check your to-dos** and mark completed items
3. **Update progress** on goals and rocks as you make progress

### Weekly Use
1. **Review all open issues** and resolve what you can
2. **Update the scorecard** with latest metrics
3. **Adjust rock progress** percentages
4. **Add new to-dos** for the upcoming week

### Quarterly Use
1. **Review goal progress** - are you on track?
2. **Complete old rocks** and add new ones for next quarter
3. **Archive or delete** completed items
4. **Set new goals** for the next quarter

## 🎨 Tips for Success

### For Team Leaders
- **Keep it updated**: Review and update daily
- **Make it visible**: Share your screen during meetings
- **Assign clearly**: Every item should have an owner
- **Celebrate wins**: Check off completed items together

### For Team Members
- **Check daily**: Look at your assigned items
- **Update progress**: Keep your rocks and to-dos current
- **Raise issues**: Don't let problems hide
- **Be honest**: Update status accurately (at-risk vs on-track)

### For Everyone
- **Keep titles clear**: Write descriptive names
- **Set realistic targets**: Better to exceed than fall short
- **Review regularly**: What gets measured gets done
- **Stay focused**: Don't add too many items

## 🔄 Common Workflows

### Starting a New Quarter
1. Go to **Goals** → Add your quarterly goals
2. Go to **Rocks** → Add 3-7 major priorities
3. Go to **Scorecard** → Set your target metrics
4. Go to **To-Dos** → Add first week's tasks

### Weekly Team Meeting
1. Open **Dashboard** → Review the 4 stat cards
2. Go to **Rocks** → Discuss status of each rock
3. Go to **Issues** → Review and assign open issues
4. Go to **To-Dos** → Review completed items and add new ones

### Monthly Review
1. **Goals** → Update current progress
2. **Rocks** → Update progress percentages
3. **Scorecard** → Update all metrics
4. **Issues** → Close resolved issues

## ❓ Frequently Asked Questions

**Q: Where is my data stored?**  
A: In your browser's localStorage. It stays on your computer and persists between sessions.

**Q: Can multiple people use this at once?**  
A: Currently, each person has their own data. For team collaboration, everyone should update the same computer/browser, or you'd need to add a backend database.

**Q: What happens if I close the browser?**  
A: Your data is saved automatically. When you reopen the app, everything will be there.

**Q: Can I delete items?**  
A: Yes! Click the red trash icon next to any item. You'll be asked to confirm.

**Q: How do I backup my data?**  
A: Your browser stores the data. For a backup, you could export localStorage data using browser developer tools.

**Q: Can I customize the colors?**  
A: Yes! Edit the `tailwind.config.js` file to change colors.

## 🆘 Troubleshooting

**Problem**: App won't start  
**Solution**: Make sure you ran `npm install` first, then `npm start`

**Problem**: Changes aren't saving  
**Solution**: Check your browser's localStorage isn't disabled or full

**Problem**: App looks broken  
**Solution**: Clear your browser cache and reload

**Problem**: Can't see my data  
**Solution**: Make sure you're using the same browser and haven't cleared localStorage

## 🎓 Learning More

- The app is built with **React** - a popular JavaScript framework
- Styling uses **Tailwind CSS** - a utility-first CSS framework
- Icons come from **Lucide React** - a beautiful icon library

To learn more about customizing the app, check out the code in `src/App.jsx` - it's well-commented!

---

**Ready to get started? Open the app and click "Add Goal" to create your first goal!** 🚀

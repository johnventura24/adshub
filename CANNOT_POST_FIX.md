# Fix "Cannot POST /api/todos" (same error)

The error means **the URL you open (e.g. adshub.onrender.com) is NOT running the Node server** that has `/api/todos`. Fix it using **one** of these:

---

## Option A: One Web Service (recommended)

Use **one** Render **Web Service** that runs Node and serves both the app and the API.

1. **Create a Web Service** (if you don’t have one):
   - Render Dashboard → **New** → **Web Service**
   - Connect repo: `johnventura24/adshub`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `node server.js`
   - **Environment:** Add `NODE_ENV=production`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`
   - Create Web Service

2. **If you already have a service**, change its settings:
   - **Settings** → **Build & Deploy**
   - **Start Command** must be exactly: `node server.js`  
     (not `react-scripts start`, not `npm run build`, not `node server-ultra-minimal.js`)
   - **Build Command:** `npm install && npm run build`
   - Save and **Manual Deploy** → **Deploy latest commit**

3. **Use this service’s URL** for the app (e.g. `https://adshub-xxxx.onrender.com`).  
   If you use a custom domain like adshub.onrender.com, **point that domain to this Web Service**, not to a Static Site.

4. **Check:** Open `https://YOUR-SERVICE-URL.onrender.com/api`  
   You should see: `{"ok":true,"server":"server.js",...}`  
   Then try **Add To-Do** again.

---

## Option B: Two services (Static Site + API)

If you must keep a **Static Site** at adshub.onrender.com and run the API on a **separate** Web Service:

1. **Web Service (API):**
   - New Web Service, same repo
   - **Start Command:** `node server.js`
   - **Build Command:** `npm install && npm run build`
   - Note this service’s URL, e.g. `https://adshub-api-xxxx.onrender.com`

2. **Static Site (or second service):**
   - When you **build** the React app, set:
     - **Environment variable:** `REACT_APP_API_URL` = `https://adshub-api-xxxx.onrender.com`  
       (use your real API service URL, no trailing slash)
   - Rebuild and deploy the static site.

3. The React app will then call that API URL for `/api/todos`, `/api/dashboard`, etc., and the error should stop.

---

## Quick check

- Open: **https://your-app-url.onrender.com/api**
- If you see JSON like `{"ok":true,"server":"server.js",...}` → the right server is running; add/delete todo should work.
- If you see an HTML error or "Cannot GET /api" → the wrong app is running; fix **Start Command** (Option A) or **REACT_APP_API_URL** (Option B).

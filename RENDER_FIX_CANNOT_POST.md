# Fix "Cannot POST /api/todos" on Render

You see **"Cannot POST /api/todos"** because the app at adshub.onrender.com is **not** running the Node server that has the API. Follow these steps on Render.

---

## Step 1: Check service type

1. Go to **https://dashboard.render.com**
2. Open your **adshub** (or company-dashboard) service.
3. Look at the **service type** at the top or in the sidebar.

**If it says "Static Site":**
- Static sites **only serve files**. They do **not** run Node or any API.
- You must use a **Web Service** instead. Either:
  - **Option A:** Create a **new** Web Service (see Step 2 below), connect the same GitHub repo, then use that service’s URL (or point your domain to it).  
  - **Option B:** If you can change the existing service to a Web Service, do that and continue below.

**If it says "Web Service":**
- Go to Step 2 and fix the Start Command.

---

## Step 2: Set Start Command (Web Service only)

1. In your **Web Service** → open **Settings** (or **Environment** tab, depending on layout).
2. Find **Build & Deploy** (or **Build** section).
3. Find **Start Command**.
4. Set it to **exactly**:
   ```bash
   node server.js
   ```
5. Remove any other start command (e.g. `react-scripts start` or `npm run build && ...`).
6. Click **Save Changes**.

---

## Step 3: Build command

In the same **Build & Deploy** section, set **Build Command** to:

```bash
npm install && npm run build
```

This creates the `build` folder that `server.js` serves in production.

---

## Step 4: Redeploy

1. Open the **Manual Deploy** menu (or **Deploy** tab).
2. Click **Deploy latest commit** (or **Clear build cache & deploy** if you want a clean build).
3. Wait until the deploy finishes (status: **Live**).

---

## Step 5: Verify the API is running

1. Open in your browser:
   ```
   https://adshub.onrender.com/api
   ```
   (Use your real service URL if it’s different.)

2. You should see JSON like:
   ```json
   {"ok":true,"server":"server.js","routes":["/api/dashboard","/api/todos",...]}
   ```

3. If you see that → the correct server is running. Try **Add To-Do** again.

4. If you see an HTML error page or "Cannot GET /api" → the wrong app is still running. Then:
   - Confirm again that the service is a **Web Service**, not a Static Site.
   - Confirm **Start Command** is exactly `node server.js` and you redeployed after saving.

---

## Step 6: Environment variables

In the same Web Service → **Environment**:

- `NODE_ENV` = `production`
- `SUPABASE_URL` = your Supabase project URL
- `SUPABASE_ANON_KEY` = your Supabase anon key

Save and redeploy if you change them.

---

## Summary

| Item            | Required value                          |
|-----------------|------------------------------------------|
| Service type    | **Web Service** (not Static Site)       |
| Build Command   | `npm install && npm run build`           |
| Start Command   | `node server.js`                         |
| After changes   | Redeploy and check https://.../api       |

Once the **Web Service** is running with **Start Command: `node server.js`** and deploy is **Live**, POST to `/api/todos` and delete will work.

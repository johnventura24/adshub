# Render setup for AdsHub (API + Supabase)

So **add/delete todos and issues** work on https://adshub.onrender.com, the service must run the **Node server** that has the API, not the React dev server.

## 1. Build & Start (Dashboard)

In your Render service → **Settings** (or **Build & Deploy**):

- **Build Command:** `npm install && npm run build`
- **Start Command:** use **one** of these (both run the same server):
  - `npm start`  ← preferred (runs `node server.js` via package.json)
  - `node server.js`

Do **not** use:

- `react-scripts start` (React dev server, no API)
- `node server-ultra-minimal.js` (no `/api/todos` or Supabase)

## 2. Environment variables

In the same service → **Environment**:

| Key               | Value                          |
|-------------------|---------------------------------|
| `NODE_ENV`        | `production`                    |
| `SUPABASE_URL`    | Your Supabase project URL       |
| `SUPABASE_ANON_KEY` | Your Supabase anon public key  |

Save and redeploy.

## 3. Check that the right server is running

After deploy, open:

- **https://adshub.onrender.com/api**

You should see JSON like:

```json
{ "ok": true, "server": "server.js", "routes": ["/api/dashboard", "/api/todos", ...] }
```

If you see that, the API is live. Then try adding a todo again.

If you see an HTML error page or “Cannot GET /api”, the wrong process is still running — fix the **Start Command** as in step 1 and redeploy.

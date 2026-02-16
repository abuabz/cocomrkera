# 🚨 URGENT: Fix Live Deployment Connection

## Current Issue
Your live frontend on Vercel is getting **404 errors** because the environment variable `NEXT_PUBLIC_API_URL` is **NOT SET** in Vercel.

### Evidence from Console:
```
❌ https://cocomrkerabackend.onrender.com/stats/dashboard - 404
❌ https://cocomrkerabackend.onrender.com/employees - 404
❌ https://cocomrkerabackend.onrender.com/customers - 404
```

Notice: URLs are missing `/api` - this means Vercel doesn't have the environment variable!

---

## ✅ SOLUTION: Set Environment Variable in Vercel

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Select your project: `cocomrkera` (or whatever you named it)

### Step 2: Add Environment Variable
1. Click on **"Settings"** tab
2. Click on **"Environment Variables"** in the left sidebar
3. Click **"Add New"** button
4. Fill in:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://cocomrkerabackend.onrender.com`
   - **Environment**: Select **ALL** (Production, Preview, Development)
5. Click **"Save"**

### Step 3: Redeploy
1. Go to **"Deployments"** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. ✅ **IMPORTANT**: Check the box "Use existing Build Cache" = **OFF** (force fresh build)
5. Click **"Redeploy"**

### Step 4: Verify
After deployment completes (2-3 minutes):
1. Visit your live site
2. Open DevTools (F12) → Console tab
3. Look for:
   ```
   [API Config] Base URL: https://cocomrkerabackend.onrender.com/api
   [API Config] Raw Environment: https://cocomrkerabackend.onrender.com
   ```
4. Dashboard should load! 🎉

---

## 🔧 Alternative: Use Vercel CLI (Faster)

If you have Vercel CLI installed:

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variable
vercel env add NEXT_PUBLIC_API_URL

# When prompted, enter: https://cocomrkerabackend.onrender.com
# Select: Production, Preview, Development (all)

# Redeploy
vercel --prod --force
```

---

## 📋 Files Updated (Already Done)

✅ **lib/api.ts** - More robust environment variable handling
✅ **vercel.json** - Configuration file (backup method)
✅ **.env.production** - Local production testing
✅ **.env.local** - Local development with live backend

---

## 🧪 Test Locally First

Before redeploying, test the changes locally:

```bash
# Build production version locally
npm run build

# Start production server
npm start

# Visit: http://localhost:3000
# Check console - should show correct API URL
```

---

## ⚠️ Common Mistakes to Avoid

1. **Don't forget the variable name prefix**: Must be `NEXT_PUBLIC_API_URL` (not just `API_URL`)
2. **Don't include `/api` in the value**: Use `https://cocomrkerabackend.onrender.com` (NOT `...com/api`)
3. **Don't skip the redeploy**: Changes to env vars require a fresh deployment
4. **Don't use build cache**: When redeploying, disable build cache to ensure env vars are picked up

---

## 🔍 Debugging

If it still doesn't work after redeploying:

1. **Check Vercel Build Logs**:
   - Go to Deployments → Click on latest deployment
   - Look for "Environment Variables" section
   - Verify `NEXT_PUBLIC_API_URL` is listed

2. **Check Browser Console**:
   - Should show: `[API Config] Raw Environment: https://cocomrkerabackend.onrender.com`
   - If it shows `undefined`, env var is not set correctly

3. **Check Network Tab**:
   - Open DevTools → Network tab
   - Look at failed requests
   - URLs should be: `https://cocomrkerabackend.onrender.com/api/...`
   - If missing `/api`, environment variable is not being read

---

## 📞 Need Help?

If you're still stuck after following these steps, check:
1. Is the backend actually running? Visit: https://cocomrkerabackend.onrender.com/api/health
2. Did you redeploy with cache disabled?
3. Did you wait for the deployment to complete (2-3 minutes)?

---

## ✨ Expected Result

After fixing:
- ✅ Dashboard loads with real data
- ✅ All API calls succeed
- ✅ No 404 errors in console
- ✅ Console shows: `[API] Success from https://cocomrkerabackend.onrender.com/api/stats/dashboard`

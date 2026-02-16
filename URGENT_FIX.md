# 🎯 IMMEDIATE ACTION REQUIRED

## The Problem (Confirmed ✅)
- ✅ Backend is **WORKING PERFECTLY** on Render
- ❌ Frontend on Vercel **CANNOT CONNECT** because environment variable is missing
- ❌ Vercel doesn't know where your backend is!

## The Solution (3 Minutes)

### 🔴 STEP 1: Open Vercel Dashboard
1. Go to: https://vercel.com/dashboard
2. Click on your project (probably named `cocomrkera` or similar)

### 🔴 STEP 2: Add Environment Variable
1. Click **"Settings"** (top menu)
2. Click **"Environment Variables"** (left sidebar)
3. Click **"Add New"** button
4. Enter these EXACT values:
   ```
   Key:   NEXT_PUBLIC_API_URL
   Value: https://cocomrkerabackend.onrender.com
   ```
5. Select **ALL environments** (Production, Preview, Development)
6. Click **"Save"**

### 🔴 STEP 3: Force Redeploy
1. Click **"Deployments"** (top menu)
2. Find the latest deployment
3. Click the **"..."** (three dots) menu
4. Click **"Redeploy"**
5. **UNCHECK** "Use existing Build Cache" ⚠️ IMPORTANT!
6. Click **"Redeploy"**

### 🔴 STEP 4: Wait & Verify (2-3 minutes)
1. Wait for deployment to complete
2. Visit your live site
3. Open browser console (F12)
4. You should see:
   ```
   [API Config] Base URL: https://cocomrkerabackend.onrender.com/api
   [API] Success from https://cocomrkerabackend.onrender.com/api/stats/dashboard
   ```

---

## 📸 Visual Guide

### Where to find Environment Variables in Vercel:
```
Vercel Dashboard
  └─ Your Project
      └─ Settings (tab)
          └─ Environment Variables (sidebar)
              └─ Add New (button)
```

### What to enter:
```
┌─────────────────────────────────────────────────┐
│ Add Environment Variable                        │
├─────────────────────────────────────────────────┤
│ Key                                             │
│ ┌─────────────────────────────────────────────┐ │
│ │ NEXT_PUBLIC_API_URL                         │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ Value                                           │
│ ┌─────────────────────────────────────────────┐ │
│ │ https://cocomrkerabackend.onrender.com      │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ Environments                                    │
│ ☑ Production                                    │
│ ☑ Preview                                       │
│ ☑ Development                                   │
│                                                 │
│          [Cancel]  [Save]                       │
└─────────────────────────────────────────────────┘
```

---

## ⚠️ CRITICAL NOTES

1. **Exact spelling matters**: `NEXT_PUBLIC_API_URL` (not `API_URL` or `NEXT_API_URL`)
2. **No `/api` at the end**: Use `https://cocomrkerabackend.onrender.com` (NOT `.../api`)
3. **Must redeploy**: Saving the variable is not enough - you MUST redeploy
4. **Disable cache**: When redeploying, MUST uncheck "Use existing Build Cache"

---

## ✅ Verification Checklist

After redeploying, check these in browser console:

- [ ] `[API Config] Raw Environment:` shows the backend URL (not `undefined`)
- [ ] `[API Config] Base URL:` ends with `/api`
- [ ] `[API] Calling:` shows full URL with `/api/...`
- [ ] `[API] Success from` appears (not errors)
- [ ] Dashboard displays data (not "Error: Resource not found")

---

## 🆘 Still Not Working?

If you followed ALL steps and it still doesn't work:

1. **Check Vercel Build Logs**:
   - Deployments → Click deployment → View Build Logs
   - Search for "NEXT_PUBLIC_API_URL"
   - Should appear in "Environment Variables" section

2. **Check if backend is accessible**:
   - Visit: https://cocomrkerabackend.onrender.com/api/health
   - Should show: `{"status":"healthy","database":"connected",...}`

3. **Clear browser cache**:
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

## 📞 Alternative: Vercel CLI Method

If you prefer command line:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project (if not already linked)
vercel link

# Add environment variable
vercel env add NEXT_PUBLIC_API_URL production
# When prompted, paste: https://cocomrkerabackend.onrender.com

# Also add for preview and development
vercel env add NEXT_PUBLIC_API_URL preview
vercel env add NEXT_PUBLIC_API_URL development

# Redeploy
vercel --prod --force
```

---

## 🎉 Expected Result

After successful fix:
- ✅ Dashboard loads instantly
- ✅ All pages work (Customers, Employees, Sales, Orders, Reports)
- ✅ No red error toasts
- ✅ Console shows successful API calls
- ✅ Data displays correctly

**The fix takes 3 minutes. Do it now! 🚀**

# Coconut Management System - Deployment Guide

## 🚀 Quick Fix for Live Deployment

### Problem
The frontend is working locally but not connecting to the live backend on Render.

### Solution

#### 1. **Frontend Environment Configuration**

Create `.env.local` (for local development testing with live backend):
```env
NEXT_PUBLIC_API_URL=https://cocomrkerabackend.onrender.com
```

Create `.env.production` (for production deployment):
```env
NEXT_PUBLIC_API_URL=https://cocomrkerabackend.onrender.com
```

#### 2. **Verify Backend is Running**

Visit these URLs in your browser:
- Root: https://cocomrkerabackend.onrender.com/
- Health: https://cocomrkerabackend.onrender.com/api/health
- Dashboard Stats: https://cocomrkerabackend.onrender.com/api/stats/dashboard

Or use the test page:
- Local: http://localhost:3000/api-test.html
- Live: https://your-frontend-url.vercel.app/api-test.html

#### 3. **Deploy Frontend with Environment Variables**

**For Vercel:**
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add: `NEXT_PUBLIC_API_URL` = `https://cocomrkerabackend.onrender.com`
4. Redeploy your application

**For Netlify:**
1. Go to Site settings > Build & deploy > Environment
2. Add: `NEXT_PUBLIC_API_URL` = `https://cocomrkerabackend.onrender.com`
3. Trigger a new deployment

#### 4. **Restart Your Development Server**

After creating `.env.local`, restart your Next.js dev server:
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

---

## 📋 Complete Deployment Checklist

### Backend (Render)
- [x] MongoDB Atlas connection configured
- [x] Environment variables set (MONGODB_URI, PORT, NODE_ENV)
- [x] CORS enabled for all origins
- [x] Server listening on 0.0.0.0
- [ ] Verify all endpoints are accessible

### Frontend (Vercel/Netlify)
- [ ] Environment variable `NEXT_PUBLIC_API_URL` set
- [ ] Build completes successfully
- [ ] Test API connectivity after deployment

---

## 🔍 Debugging

### Check Console Logs
Open browser DevTools (F12) and check the Console tab. You should see:
```
[API Config] Base URL: https://cocomrkerabackend.onrender.com/api
[API Config] Environment: https://cocomrkerabackend.onrender.com
[API] Calling: https://cocomrkerabackend.onrender.com/api/stats/dashboard
```

### Common Issues

**Issue 1: "Resource not found" (404)**
- **Cause**: Environment variable not set or incorrect
- **Fix**: Verify `NEXT_PUBLIC_API_URL` is set correctly

**Issue 2: "Failed to fetch" / CORS error**
- **Cause**: Backend not running or CORS misconfigured
- **Fix**: Check backend logs on Render, verify CORS settings

**Issue 3: Environment variable not updating**
- **Cause**: Next.js caches environment variables
- **Fix**: Restart dev server or rebuild production

---

## 🌐 API Endpoints

### Base URL
- **Local**: http://localhost:5000/api
- **Live**: https://cocomrkerabackend.onrender.com/api

### Available Endpoints
- `GET /` - Welcome message
- `GET /api/health` - Health check
- `GET /api/stats/dashboard` - Dashboard statistics
- `GET /api/stats/reports` - Reports data
- `GET /api/customers` - List customers
- `GET /api/employees` - List employees
- `GET /api/sales` - List sales
- `GET /api/orders` - List orders
- `GET /api/followups` - List followups

---

## 📝 Notes

1. **Environment Variables**: Next.js requires `NEXT_PUBLIC_` prefix for client-side variables
2. **Rebuild Required**: Changes to `.env` files require a rebuild/restart
3. **CORS**: Backend is configured to accept requests from any origin (`*`)
4. **SSL**: Render provides HTTPS by default, use `https://` in production URLs

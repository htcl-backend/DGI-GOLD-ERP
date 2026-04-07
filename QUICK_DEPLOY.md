# Quick Deploy Guide - Vercel & Netlify

## ✅ What's Already Fixed

1. ✅ Login page now works (SuperAdmin & Vendor credentials)
2. ✅ Build completes without errors
3. ✅ Environment variable system configured
4. ✅ All dependencies installed

---

## 🚀 Deploy to Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Fix: Auth and deployment issues"
git push origin main
```

### Step 2: Import on Vercel
1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repo
4. Click "Import"

### Step 3: Add Environment Variables
In Vercel dashboard:
- Go to **Settings** → **Environment Variables**
- Click **Add New**
- Key: `VITE_API_URL`
- Value: `https://your-backend-api.com/api/v1`
- Click **Save**

✅ Done! Vercel will auto-deploy on each push.

---

## 🚀 Deploy to Netlify

### Option A: Connect GitHub (Recommended)
1. Go to https://netlify.com
2. Click "Add New Site" → "Import an Existing Project"
3. Select GitHub → Choose your repo
4. Build settings will auto-fill:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click **Deploy Site**

### Option B: Manual Deploy
```bash
# Build for production
npm run build

# Install Netlify CLI (one time)
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Step 2: Add Environment Variables (GitHub Import)
In Netlify dashboard:
- Go to **Site Settings** → **Build & Deploy** → **Environment**
- Click **Edit variables**
- Add:
  - Key: `VITE_API_URL`
  - Value: `https://your-backend-api.com/api/v1`
- Click **Save**

### Redeploy
After adding env vars, go to **Deploys** and click **Trigger deploy** to rebuild.

---

## 🧪 Test After Deployment

1. Visit your domain
2. Try login with these credentials:
   - Email: `superadmin@dgi.com`
   - Password: `admin123`
   
3. Should see SuperAdmin Dashboard
4. If not, check:
   - ✓ Environment variable is set correctly
   - ✓ Backend API is accessible
   - ✓ Check browser console for errors (F12)

---

## 📝 Environment Variables Needed

| Environment | VITE_API_URL |
|-------------|--------------|
| Development | `http://161.248.62.37:7527/api/v1` |
| Staging | `https://staging-api.yourdomain.com/api/v1` |
| Production | `https://api.yourdomain.com/api/v1` |

---

## 🆘 Troubleshooting Deployment

### "Cannot GET /" on deployed site
**Solution:** Netlify needs a redirect rule for SPA routing. Create `netlify.toml`:
```toml
[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

### Login fails with API error
1. Check VITE_API_URL environment variable is set
2. Verify backend API is running
3. Test API directly in browser console:
```javascript
fetch('https://your-api.com/api/v1/health')
  .then(r => r.json())
  .then(d => console.log(d))
```

### Blank white screen
1. Check browser console (F12 → Console)
2. Open Network tab to see failed requests
3. Verify environment variables are loaded

### Deployment keeps failing
Check build logs:
- **Vercel:** Settings → Deployments → click failed deploy
- **Netlify:** Deploys → click failed deploy

Usually it's a missing npm dependency or syntax error.

---

## 📚 Files to Reference

- **DEPLOYMENT_FIXES.md** - Complete detailed guide
- **.env.example** - Template for environment variables
- **.env.production** - Production template
- **vite.config.js** - Build configuration

---

## ✨ Summary

Your app is ready to deploy! Just:
1. Push to GitHub
2. Connect to Vercel/Netlify
3. Set `VITE_API_URL` env variable
4. Done! ✅

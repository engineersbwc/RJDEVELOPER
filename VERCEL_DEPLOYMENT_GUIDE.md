# 🚀 COMPLETE DEPLOYMENT GUIDE FOR VERCEL
## Step-by-Step Production Deployment with All Fixes

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### ✅ Step 1: Verify Local Setup
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

### ✅ Step 2: Environment Variables Setup

**For Backend (.env file):**
```bash
# Copy from .env.example
cp .env.example .env

# Edit .env and fill in:
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-frontend.vercel.app
BACKEND_URL=https://your-backend.vercel.app
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
GOOGLE_CLIENT_ID=your-id
GOOGLE_CLIENT_SECRET=your-secret
```

**For Frontend (.env.local file):**
```bash
# Copy from .env.example
cp .env.example .env.local

# Edit .env.local and fill in:
VITE_API_URL=https://your-backend.vercel.app
```

---

## 🔐 VERCEL DEPLOYMENT - BACKEND

### Step 1: Create Backend Project on Vercel
```bash
cd backend
vercel --prod
```

### Step 2: Set Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **Backend** project
3. Click **Settings** > **Environment Variables**
4. Add these variables (get values from your `.env` file):

| Variable | Value | Example |
|----------|-------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Strong random string (min 32 chars) | `your-secret-key-32-chars-min` |
| `FRONTEND_URL` | Your frontend Vercel URL | `https://your-frontend.vercel.app` |
| `BACKEND_URL` | Your backend Vercel URL | `https://your-backend.vercel.app` |
| `MAIL_HOST` | `smtp.gmail.com` | `smtp.gmail.com` |
| `MAIL_PORT` | `587` | `587` |
| `MAIL_SECURE` | `false` | `false` |
| `MAIL_USER` | Your Gmail address | `your-email@gmail.com` |
| `MAIL_PASS` | Gmail App Password | `xxxx xxxx xxxx xxxx` |
| `GOOGLE_CLIENT_ID` | From Google Console | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | From Google Console | `GOCSPX-xxx` |
| `GOOGLE_CALLBACK_URL` | Google OAuth callback | `https://your-backend.vercel.app/api/auth/google/callback` |
| `FACEBOOK_APP_ID` | From Facebook Developer | `123456789` |
| `FACEBOOK_APP_SECRET` | From Facebook Developer | `abc123def456` |
| `FACEBOOK_CALLBACK_URL` | Facebook OAuth callback | `https://your-backend.vercel.app/api/auth/facebook/callback` |
| `NODE_ENV` | `production` | `production` |

### Step 3: Verify Backend Deployment
```bash
# Test health endpoint
curl https://your-backend.vercel.app/health

# Expected response:
# {"status":"ok","timestamp":"2024-01-01T00:00:00.000Z","uptime":123.456}
```

---

## 🎨 VERCEL DEPLOYMENT - FRONTEND

### Step 1: Create Frontend Project on Vercel
```bash
cd frontend
vercel --prod
```

### Step 2: Set Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **Frontend** project
3. Click **Settings** > **Environment Variables**
4. Add these variables:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://your-backend.vercel.app` |
| `VITE_GEMINI_API_KEY` | (Optional) Your Gemini API key |

### Step 3: Trigger Redeploy
After setting environment variables, trigger a new deployment:

```bash
vercel --prod --force
```

Or go to Vercel Dashboard > Deployments > "Redeploy"

### Step 4: Verify Frontend Deployment
1. Visit your frontend URL: `https://your-frontend.vercel.app`
2. Open browser DevTools > Console
3. Look for: `✅ API Base URL configured: https://your-backend.vercel.app`

---

## 🧪 TESTING AFTER DEPLOYMENT

### Test 1: API Connectivity
```bash
# In browser console or Terminal:
curl https://your-backend.vercel.app/api/health
```

### Test 2: CORS Settings
```javascript
// In browser console on your frontend:
fetch('https://your-backend.vercel.app/api/auth/me', {
  credentials: 'include'
}).then(r => r.json()).then(console.log)
```

### Test 3: Complete User Journey
1. **Register**: Create new account, verify OTP
2. **Login**: Login with email/password
3. **OAuth**: Test Google/Facebook login
4. **Contact Form**: Submit contact form
5. **Logout**: Logout and verify session clears

### Test 4: Cold Start Behavior
1. Wait 15 minutes (Lambda goes cold)
2. Visit frontend and try an API call
3. Should work without "connection reset" errors

### Test 5: Multi-Device Testing
1. Open website on **Desktop** (Chrome, Firefox, Safari)
2. Open on **Mobile** (iOS Safari, Android Chrome)
3. Try after 5+ minutes of inactivity
4. All should work without connection errors

---

## 🔧 MONGODB SETUP (IF NOT DONE)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create account and cluster
3. **Network Access**: Add your IP (or 0.0.0.0/0 for development)
4. **Database User**: Create a user with password
5. **Connection String**: Get from "Connect" button
   - Format: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database-name`
6. Copy into Vercel environment variable `MONGO_URI`

---

## 📧 GMAIL SETUP FOR EMAIL SENDING

1. Go to [Google Account](https://myaccount.google.com)
2. **Security** > **App passwords**
3. Select **Mail** and **Windows Computer**
4. Google generates a **16-character password**
5. Copy this password (not your regular Gmail password!)
6. Set in Vercel:
   - `MAIL_USER` = your Gmail address
   - `MAIL_PASS` = the 16-char app password (remove spaces)

---

## 🔑 GOOGLE OAUTH SETUP

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project: "RJ Developer"
3. **APIs & Services** > **Enable APIs and Services**
4. Search and enable **Google+ API**
5. **Credentials** > **Create Credentials** > **OAuth 2.0 Client IDs**
6. Choose **Web application**
7. **Authorized redirect URIs**: Add
   - `https://your-backend.vercel.app/api/auth/google/callback`
8. Copy **Client ID** and **Client Secret**
9. Set in Vercel environment variables

---

## 👥 FACEBOOK OAUTH SETUP

1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create new app
3. Add **Facebook Login** product
4. **Settings** > **Basic**: Get App ID and Secret
5. **Settings** > **Basic** > **Add Platform** > **Website**
6. **App Domains**: `your-backend.vercel.app`
7. **Facebook Login** > **Settings** > **Valid OAuth Redirect URIs**: Add
   - `https://your-backend.vercel.app/api/auth/facebook/callback`
8. Set in Vercel environment variables

---

## 🐛 TROUBLESHOOTING

### Issue: "Server Connection Failed"

**Solution:**
1. Check Vercel logs:
   ```bash
   vercel logs --prod
   ```
2. Verify `VITE_API_URL` is set in frontend settings
3. Check backend health:
   ```bash
   curl https://your-backend.vercel.app/health
   ```

### Issue: CORS Error
```
Access to XMLHttpRequest at 'https://backend.vercel.app' from origin 
'https://frontend.vercel.app' has been blocked by CORS policy
```

**Solution:**
1. Check `FRONTEND_URL` matches your frontend domain
2. Verify backend CORS configuration in [api/index.js](backend/api/index.js)
3. Restart deployment:
   ```bash
   vercel --prod --force
   ```

### Issue: OAuth Redirect URI Mismatch

**Solution:**
1. Check Vercel environment variables:
   - `GOOGLE_CALLBACK_URL` or `FACEBOOK_CALLBACK_URL`
   - Or `BACKEND_URL`
2. Verify these match the URLs registered in Google/Facebook consoles
3. Format must be exactly: `https://your-backend.vercel.app/api/auth/{provider}/callback`

### Issue: MongoDB Connection Timeout

**Solution:**
1. Check MongoDB IP Whitelist:
   - MongoDB Atlas > Network Access
   - Add your Vercel IP (or 0.0.0.0/0)
2. Verify `MONGO_URI` is correct
3. Check network connectivity from Vercel region

### Issue: Email Not Sending

**Solution:**
1. Check Gmail App Password is correct
2. Verify SMTP settings:
   - `MAIL_HOST` = smtp.gmail.com
   - `MAIL_PORT` = 587
   - `MAIL_SECURE` = false
3. Check Gmail "Less secure apps" is allowed

---

## 📊 MONITORING

### Enable Error Tracking (Recommended)

#### Option 1: Vercel Built-in
- Go to Vercel Dashboard > your project > **Monitoring**
- No additional setup needed

#### Option 2: Sentry (Advanced)
```javascript
// In frontend main.tsx, add:
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
  tracesSampleRate: 1.0,
});
```

#### Option 3: LogRocket (User Session Replay)
```javascript
// In frontend main.tsx:
import LogRocket from 'logrocket';

LogRocket.init('app-id');
```

---

## 🚀 AUTOMATED DEPLOYMENTS

### Setup GitHub Integration
1. Push code to GitHub
2. Go to Vercel Dashboard
3. **Import Project** > **Select Repository**
4. Select **main** branch for auto-deploy
5. Add environment variables
6. Click "Deploy"

Future pushes to `main` will auto-deploy!

---

## ✅ FINAL VERIFICATION CHECKLIST

- [ ] Backend environment variables all set
- [ ] Frontend `VITE_API_URL` set correctly
- [ ] MongoDB connection working
- [ ] Gmail SMTP working
- [ ] Google OAuth URLs registered
- [ ] Facebook OAuth URLs registered
- [ ] Backend health check passing
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] OAuth login works
- [ ] Contact form sends emails
- [ ] Website works on multiple devices
- [ ] No "Server Connection Failed" after 5+ minutes
- [ ] Cold start performance acceptable
- [ ] Vercel logs show no critical errors

---

## 📞 SUPPORT

If you encounter issues:

1. **Check Vercel Logs**:
   ```bash
   vercel logs --prod
   ```

2. **Check Environment Variables**:
   - Vercel Dashboard > Settings > Environment Variables
   - Verify all required variables are set

3. **Check Network Tab**:
   - Browser DevTools > Network
   - Look for failed API requests
   - Check response status and body

4. **Common Issues**:
   - VITE_API_URL not set → Set in Vercel Settings
   - CORS error → Check FRONTEND_URL matches
   - Connection timeout → Check MongoDB Network Access
   - OAuth redirect → Verify callback URL registered

---

## 📚 ADDITIONAL RESOURCES

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com)
- [Passport.js Documentation](http://www.passportjs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Vite Configuration](https://vitejs.dev/config/)


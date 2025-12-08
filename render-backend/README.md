# Steel Online API - Backend for Render.com

This is the Python API backend for Steel Online 20. Deploy this to Render.com (free tier) and connect it to your Cloudflare frontend.

---

## Step 1: Deploy to Render.com

### 1.1 Create Render Account
Go to https://render.com and sign up for free.

### 1.2 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub account
3. Select this repository (or upload these files to a new repo)

### 1.3 Configure Settings

| Setting | Value |
|---------|-------|
| **Name** | `steelonline-api` (or any name) |
| **Region** | Choose closest to your users |
| **Branch** | `main` |
| **Root Directory** | `render-backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn --bind=0.0.0.0:10000 app:app` |
| **Instance Type** | `Free` |

### 1.4 Environment Variables
Add these in Render dashboard:

| Name | Value |
|------|-------|
| `PORT` | `10000` |
| `PYTHON_VERSION` | `3.11.0` |

### 1.5 Deploy
Click **"Create Web Service"** and wait for deployment (2-3 minutes).

### 1.6 Get Your API URL
After deployment, copy your URL. It will look like:
```
https://steelonline-api.onrender.com
```

---

## Step 2: Connect to Cloudflare Frontend

### 2.1 Go to Cloudflare Pages
1. Open your Cloudflare Pages project
2. Go to **Settings** → **Environment variables**

### 2.2 Add Environment Variable
Click **"Add variable"** and add:

| Variable name | Value |
|---------------|-------|
| `VITE_API_BASE_URL` | `https://steelonline-api.onrender.com` |

(Replace with your actual Render URL)

### 2.3 Redeploy
1. Go to **Deployments** tab
2. Click **"Retry deployment"** on the latest deployment

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/products` | GET | List all steel products |
| `/api/prices` | GET | Get current prices |
| `/api/warehouses` | GET | List warehouse locations |
| `/api/hubs` | GET | List steel market hubs |
| `/api/sellers/search` | POST | Search for sellers |

### Example: Search Sellers
```bash
curl -X POST https://your-api.onrender.com/api/sellers/search \
  -H "Content-Type: application/json" \
  -d '{"product": "میلگرد", "location": "Tehran", "quantity": "10"}'
```

---

## Important Notes

1. **Free Tier Sleep**: Render free tier sleeps after 15 minutes of inactivity. First request after sleep takes ~30 seconds.

2. **CORS Enabled**: API allows requests from any origin (*) for Cloudflare frontend.

3. **No Database Required**: This API uses in-memory data. For persistent data, add a database.

---

## Files in This Folder

- `app.py` - Main Flask application
- `requirements.txt` - Python dependencies
- `README.md` - This file

---

## Troubleshooting

### API not responding?
- Check Render dashboard for errors
- Verify the service is running (not sleeping)
- Test with: `curl https://your-api.onrender.com/api/health`

### Cloudflare not connecting?
- Verify `VITE_API_BASE_URL` is set correctly
- Make sure URL has no trailing slash
- Redeploy after adding the variable

### CORS errors?
- The API already allows all origins
- Check browser console for specific error messages

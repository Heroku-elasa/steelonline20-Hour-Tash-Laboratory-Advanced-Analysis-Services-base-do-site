# Cloudflare Pages Deployment Guide

## Quick Setup

### Step 1: Push to GitHub
Make sure your GitHub repository has these files but **NOT** these Python files:
- Remove or don't include: `pyproject.toml`, `uv.lock`, `backend/`, `main.py`
- Include: All frontend files (components, services, public, etc.)

### Step 2: Cloudflare Pages Settings

In your Cloudflare Pages dashboard, use these settings:

| Setting | Value |
|---------|-------|
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` |

### Step 3: Environment Variables

Add these environment variables in Cloudflare Pages settings:

| Variable | Value |
|----------|-------|
| `API_KEY` | Your Gemini API key |
| `VITE_API_KEY` | Your Gemini API key |
| `NODE_VERSION` | `20` |

**Optional (for backend connection):**
| Variable | Value |
|----------|-------|
| `VITE_API_BASE_URL` | Your Replit backend URL (e.g., `https://your-app.replit.app`) |

### Step 4: Deploy

Click "Save and Deploy" in Cloudflare.

---

## Important Notes

1. **Cloudflare Pages is for static hosting only** - The Python backend will NOT run on Cloudflare.

2. **Backend Features**: Features like `/api/sellers/search` won't work unless you:
   - Deploy the backend separately (see Replit deployment)
   - Set `VITE_API_BASE_URL` to point to your backend

3. **The app will use mock data** if no backend is available, so basic functionality still works.

---

## Files to Exclude from GitHub (for Cloudflare)

If you want a clean Cloudflare deployment, exclude:
```
pyproject.toml
uv.lock
backend/
main.py
.replit
replit.nix
replit.md
extracted_zip/
```

The `.cfignore` file in this project should handle this automatically.

# BuildVVO Technologies — Website & Lead Dashboard

Marketing website and lead management dashboard for **BuildVVO Technologies Private Limited**. It covers custom software, websites, ERP, CRM, web and mobile apps, and business automation.

- **Public website:** Home, Services (7 service pages with their own search titles and descriptions), Industries, Our Work (GymBoss_VVO), About, Contact / Get a Quote, Thank-you
- **Lead capture:** 4-step lead form, floating WhatsApp button, lead-source tracking (UTM / gclid / fbclid / referrer)
- **Admin dashboard** (`/admin/login`): analytics, drag-and-drop lead board plus list view, notes, follow-ups, CSV export, team (sales) logins, site settings
- **Marketing tags:** Google Analytics 4, Google Ads conversion and Meta Pixel load automatically once their IDs are entered in **Admin → Settings**

---

## 1. Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19 (Create React App + CRACO), React Router 7 |
| Styling | Tailwind CSS 3, shadcn/ui (Radix UI), custom design tokens (Navy `#101D35`, Cream `#F7F4ED`, Blue `#4965E9`), light/dark mode |
| Fonts | Cabinet Grotesk (Fontshare), DM Sans, JetBrains Mono (Google Fonts) |
| Animation | Framer Motion |
| Charts | Recharts |
| Drag & drop | @dnd-kit/core (mouse, touch and keyboard) |
| Icons / toasts | lucide-react, sonner |
| HTTP client | axios |
| Backend | Python 3.11, FastAPI, Uvicorn |
| Database | MongoDB (Motor async driver) |
| Auth | JWT bearer tokens (PyJWT, HS256, 12 h expiry), bcrypt password hashing, brute-force lockout (5 failed tries → 15 min) |
| Roles | `admin` (everything) and `sales` (leads only, cannot delete leads) |
| Analytics | GA4 / Google Ads / Meta Pixel (optional, configured from the admin panel) |

### Project structure
```
backend/
  server.py                 # entire API (auth, leads, users, stats, settings, events)
  requirements.txt          # full dev environment
  requirements-deploy.txt   # minimal packages for production hosting
  .env                      # backend environment variables
frontend/
  public/index.html         # SEO meta tags, JSON-LD organisation schema
  src/pages/                # public pages + admin/ (login, dashboard)
  src/components/site/      # navbar, footer, lead form, mockups, CTA blocks
  src/components/admin/     # overview, leads board/list, lead sheet, team, settings
  src/data/content.js       # all services, industries, FAQs and copy (edit text here)
  vercel.json               # SPA rewrites for Vercel
```

---

## 2. Credentials

| Account | Username | Password | Access |
|---|---|---|---|
| Admin (owner) | `buildvvo` | `buildvvo@2026` | Everything: Overview, Leads, Team, Settings |
| Sales users | created in **Admin → Team** | set by the admin | Leads page only |

- Admin email on record: `arctrackdev@gmail.com`
- Login URL: `https://<your-domain>/admin/login`. There is also a **"Team login"** link in the website footer.
- The admin account is created and updated automatically from the `ADMIN_USERNAME` / `ADMIN_PASSWORD` environment variables every time the backend starts. To change the admin password, change `ADMIN_PASSWORD` and restart the backend.
- **Before going live:** change `ADMIN_PASSWORD` and `JWT_SECRET` to new strong values.

### Placeholder contact details
These can be edited in Admin → Settings:
WhatsApp `919999999999`, phone `+91 99999 99999`, email `hello@buildvvo.com`, address `India`.

---

## 3. Environment variables

### Backend (`backend/.env`)
```
MONGO_URL="mongodb://localhost:27017"          # or your MongoDB Atlas connection string
DB_NAME="buildvvo"
CORS_ORIGINS="https://your-frontend.vercel.app,https://www.yourdomain.com"
JWT_SECRET="<long random string — generate with: python -c \"import secrets;print(secrets.token_hex(32))\">"
ADMIN_USERNAME="buildvvo"
ADMIN_PASSWORD="buildvvo@2026"
ADMIN_EMAIL="arctrackdev@gmail.com"
```

### Frontend (`frontend/.env`)
```
REACT_APP_BACKEND_URL=https://your-backend.onrender.com     # no trailing slash, no /api
```

---

## 4. Run locally

```bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements-deploy.txt
uvicorn server:app --reload --host 0.0.0.0 --port 8001

# Frontend (in a second terminal; requires Node 18+ and yarn)
cd frontend
echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env
yarn install
yarn start        # http://localhost:3000
```

---

## 5. Deploy to production

The recommended setup is:

- **Database:** MongoDB Atlas (free tier is fine to start)
- **Backend:** Render (Railway works the same way)
- **Frontend:** Vercel

### Step 1 — MongoDB Atlas
1. Create an account at https://www.mongodb.com/atlas and create a free **M0** cluster (choose the Mumbai region `ap-south-1` for India).
2. **Database Access** → add a database user with a username and password.
3. **Network Access** → add IP `0.0.0.0/0`. Render and Railway use changing IP addresses.
4. **Connect → Drivers**, then copy the connection string. It looks like
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   This is your `MONGO_URL`.

### Step 2 — Backend on Render
1. Push this project to GitHub.
2. On https://render.com → **New → Web Service** → connect the repository.
3. Settings:
   - **Root Directory:** `backend`
   - **Runtime:** Python 3 (add the env var `PYTHON_VERSION=3.11.9`)
   - **Build Command:** `pip install -r requirements-deploy.txt`
   - **Start Command:** `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Health check path:** `/api/`
4. **Environment** → add every backend variable from section 3. Use the Atlas `MONGO_URL` and a new `JWT_SECRET`. Set `CORS_ORIGINS` to your Vercel URL / custom domain; you can update it after Step 3.
5. Deploy. Check that `https://<service>.onrender.com/api/` returns `{"message":"BuildVVO API"}`.

> Render's free plan sleeps after inactivity, which makes the first request slow. Use the **Starter** plan for a business site.
>
> **Railway alternative:** New Project → Deploy from GitHub → set Root Directory `backend`, add the same variables, and set the start command `uvicorn server:app --host 0.0.0.0 --port $PORT`. Railway sets `$PORT` automatically.

### Step 3 — Frontend on Vercel
1. On https://vercel.com → **Add New → Project** → import the same GitHub repository.
2. Settings:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Install Command:** `yarn install`
   - **Build Command:** `yarn build`
   - **Output Directory:** `build`
3. **Environment Variables** → `REACT_APP_BACKEND_URL = https://<service>.onrender.com`
4. Deploy. `frontend/vercel.json` already rewrites every route to `index.html`, so links like `/services/erp-development` and `/admin` work when the page is refreshed.
5. Go back to Render and make sure `CORS_ORIGINS` contains the exact Vercel URL (for example `https://buildvvo.vercel.app`). Then redeploy the backend.

> `REACT_APP_*` variables are built into the frontend when it is built. If you change `REACT_APP_BACKEND_URL`, **redeploy** on Vercel.
>
> The `devDependencies` `@emergentbase/overlay` and `@emergentbase/visual-edits` are development-only preview tools; they are never shipped in the production build. If a Vercel install ever fails on them, remove both lines from `frontend/package.json` and redeploy.

### Step 4 — Custom domain
- **Vercel** → Project → Settings → Domains → add `buildvvo.com` and `www.buildvvo.com`, then create the DNS records Vercel shows (an A record `76.76.21.21` and a CNAME `cname.vercel-dns.com`).
- Optional: give the API its own domain, e.g. `api.buildvvo.com`. In Render → Settings → Custom Domains, add the CNAME it shows. Then set `REACT_APP_BACKEND_URL=https://api.buildvvo.com` on Vercel and redeploy.
- Add the final domains to `CORS_ORIGINS` on the backend.

### Step 5 — After going live
1. Log in at `/admin/login` → **Settings**: enter the real WhatsApp number, phone, email and address.
2. Add your **GA4 Measurement ID** (`G-…`), **Google Ads Conversion ID + Label** (`AW-…` / label) and **Meta Pixel ID** if you use them. Form submissions (`generate_lead` / `Lead`), WhatsApp clicks and consultation requests are then tracked automatically.
3. **Team** tab: create logins for the sales team.
4. Submit the site to Google Search Console and add a `sitemap.xml` for your final domain.

---

## 6. API reference (all routes are prefixed with `/api`)

| Method | Route | Access |
|---|---|---|
| GET | `/` | public — health check |
| GET | `/settings` | public — contact details and tracking IDs |
| POST | `/leads` | public — submit an enquiry |
| POST | `/events` | public — track WhatsApp / call clicks |
| POST | `/auth/login` | public — `{username, password}` → `{token, user}` |
| GET | `/auth/me` | signed in |
| GET / PATCH | `/leads`, `/leads/{id}` | admin, sales |
| POST | `/leads/{id}/notes` | admin, sales |
| DELETE | `/leads/{id}` | admin |
| GET | `/stats` | admin |
| PUT | `/settings` | admin |
| GET / POST / PATCH / DELETE | `/users`, `/users/{id}` | admin — manage sales logins |

Send the token as the `Authorization: Bearer <token>` header.

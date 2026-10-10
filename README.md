# Personal portfolio (MERN)

A production-oriented personal site: public pages with a calm editorial design, and a private admin studio for content. Personal details live in MongoDB so you do not edit React components every time something changes.

## Architecture

```
portcursor/
  client/    React + Vite + Tailwind CSS
  server/    Express + MongoDB (ES modules)
```

**Public site** reads REST endpoints (`/api/profile`, `/api/projects`, …).  
**Admin** (`/login`, `/admin`) uses httpOnly JWT cookies, CSRF double-submit, rate limits, and bcrypt. There is **no public registration**. The first admin is created once via `/api/auth/setup`.

**Images** upload through the API to Cloudinary. **Contact** is stored in MongoDB and optionally emailed over SMTP.

Design system: warm paper (`#F7F4EF`), beige surfaces, charcoal type, sage accents, Fraunces + Plus Jakarta Sans.

## Phase status

1. Architecture, env, packages — done  
2. Design system and layout — done  
3. Public pages — done  
4. Express API and models — done  
5. Frontend wired to APIs (no mock content layer) — done  
6. Admin auth and CMS — done  
7. Motion, uploads, email, SEO, a11y — done  
8. Tests and deployment notes — done  

## Local setup

### Prerequisites

- Node.js 20+
- MongoDB locally or MongoDB Atlas

### 1. Backend

```bash
cd server
copy .env.example .env
```

On macOS/Linux use `cp .env.example .env`. Set at least:

```
MONGODB_URI=mongodb://127.0.0.1:27017/portfolio
JWT_SECRET=a-long-random-string
CLIENT_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173
```

```bash
npm install
npm run seed
npm run dev
```

API: `http://localhost:5000` · health: `GET /health`

### 2. Frontend

```bash
cd client
copy .env.example .env
npm install
npm run dev
```

Site: `http://localhost:5173`

`VITE_API_URL` should be `http://localhost:5000/api` so cookies attach to the API origin.

### 3. First admin

Open `/login`. If no admin exists, the form creates one (password min 10 characters). After that, registration is closed.

### 4. Optional services

| Concern | Env vars |
|---|---|
| Cloudinary uploads | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |
| Email on contact | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `CONTACT_NOTIFY_EMAIL` |

Without Cloudinary, you can still paste image/resume URLs in admin. Without SMTP, messages are stored but not emailed.

## Scripts

**Server:** `npm run dev` · `npm start` · `npm run seed` · `npm test`  
**Client:** `npm run dev` · `npm run build` · `npm run preview` · `npm test`

## Deployment

- **Frontend:** Vercel (or any static host). Build `client` with `npm run build`. Set `VITE_API_URL` to your public API, e.g. `https://api.example.com/api`. Set `VITE_SITE_URL` to the live origin.
- **Backend:** Render / Railway / Fly. Start command `npm start`. Set `NODE_ENV=production`, Atlas URI, JWT secret, `CLIENT_URL` and `CORS_ORIGINS` to the Vercel origin.
- **Database:** MongoDB Atlas. Allow the backend IP (or `0.0.0.0/0` only if you understand the tradeoff).
- **Cookies:** production cookies are `Secure`. Serve the API over HTTPS.
- **Sitemap:** replace hostnames in `client/public/sitemap.xml` and `robots.txt` before going live.

### Common issues

- **CORS / not logged in after login:** `CORS_ORIGINS` must include the exact frontend origin, including `https://`.
- **CSRF 403:** the browser must send cookies; do not drop `withCredentials`.
- **Uploads fail:** Cloudinary vars missing or file larger than 5MB / wrong type.
- **Seed does nothing visible for social links:** seeded GitHub/LinkedIn rows are `visible: false` until you replace placeholder URLs.

## Content model

Profile is a **single document**. Skills, projects, experience, education, achievements, social links, blog posts, and contact messages are separate collections. Project and journal URLs use slugs.

Do not invent internships, certificates, or metrics. Empty public sections stay honest.

## Security notes

- Admin passwords hashed with bcrypt  
- JWT in httpOnly cookies (`SameSite=lax`)  
- CSRF token cookie + `X-CSRF-Token` on mutating admin routes  
- Origin allow-list  
- Helmet, rate limits on API / login / contact / setup  
- No stack traces to clients in production  
- Uploads: type + size checks, credentials stay on the server  

# Syed Moiz Kazmi — Portfolio

A cinematic personal portfolio combining a React/Vite frontend with an independent Express/MongoDB contact API. The visual direction uses deep-space atmospherics, a real Three.js orbital scene, restrained violet accents and an editorial project showcase.

## Included

- Responsive home page with hero, about, skills, services, selected work, journey, creative gallery, eBook services, process and contact.
- React Router project detail pages, data-driven category filters, skill tabs and native-dialog lightbox.
- React Three Fiber stars and orbital object; GSAP scroll reveals, timeline drawing and parallax; Framer Motion transitions; custom cursor and loader.
- Reduced-motion support, touch adaptations, keyboard focus states, labeled form controls and a skip link.
- Server-side contact validation, MongoDB persistence, configurable CORS, Helmet, rate limits and JSON error responses.
- Route-level code splitting, bundled fonts, Vercel frontend configuration and a Render backend blueprint.

## Requirements

- Node.js 22 or later and npm.
- MongoDB Atlas or a running local MongoDB instance.
- Two terminal windows for independent frontend/backend applications.

## Run locally

From `portfolio/backend`:

```powershell
npm ci
Copy-Item .env.example .env
# Edit .env with your MongoDB connection string.
npm run dev
```

From `portfolio/frontend`:

```powershell
npm ci
Copy-Item .env.example .env
npm run dev
```

Open the exact local URL Vite prints. Its default port is 5173. The frontend example points to `http://localhost:5000`; the backend CORS example accepts both localhost and 127.0.0.1 on port 5173. Update the origins if you use another port.

The API intentionally refuses to start without a successful MongoDB connection. A contact submission is acknowledged only after its database write resolves. Without `VITE_API_URL`, the form gives an explicit configuration error rather than pretending to send a message.

## Environment variables

| Application | Variable | Purpose |
| --- | --- | --- |
| Frontend | `VITE_API_URL` | Public API origin, with no `/api` suffix. Required at build time. |
| Backend | `MONGO_URI` | Private MongoDB connection string. Never place this in frontend variables. |
| Backend | `PORT` | HTTP port, default 5000. Hosting providers may set this. |
| Backend | `CORS_ORIGINS` | Comma-separated exact frontend origins. No trailing slash or wildcard. |
| Backend | `NODE_ENV` | Set to `production` on hosting. |
| Backend | `TRUST_PROXY_HOPS` | Default 0 locally; configure to match the actual trusted proxy topology. |
| Test | `TEST_MONGO_URI` | Optional isolated database for the real persistence integration test. |

No credentials are included. Environment files are ignored by Git. `VITE_*` values are public and compiled into the browser bundle; changing them requires rebuilding.

## MongoDB

For local use, start MongoDB and use the example URI. For Atlas, create a database user restricted to this application's database, configure network access for the backend host, and put the Atlas connection string in the backend environment. Percent-encode special characters in the password. Use the database name in the URI.

`backend/config/db.js` disables disconnected command buffering, limits the connection pool and fails startup safely when the database is unavailable. `Contact` stores name, email, subject, service, message, creation time and status (`new`, `contacted`, `closed`). The default status is `new`. Client-supplied status and timestamps are ignored.

Contact content is stored as text. Any future admin interface must render it as text, not raw HTML. Decide and document a retention policy before collecting real inquiries. There is no public contact-list endpoint or unfinished admin login.

## API

### `GET /api/health`

Returns HTTP 200 and `{"status":"ok"}`. This is a process health endpoint; startup first requires a database connection.

### `POST /api/contact`

Content type: `application/json`.

```json
{
  "name": "Your name",
  "email": "you@example.com",
  "subject": "A new project",
  "service": "Web Development",
  "message": "I would like to discuss a new website."
}
```

Services: Web Development, App Development, Logo Design, Branding, eBook Services, Other.

Responses: 201 persisted; 422 validation errors with field/message pairs; 429 rate limit; 400 malformed JSON; 413 oversized payload; 415 unsupported content type; 503 database unavailability; 500 unexpected failure. Error responses never include database credentials or stack traces. Five contact attempts are allowed per IP per 15 minutes; the general limit is 200 requests per 15 minutes. Health checks are excluded from the general limit.

The in-memory limiter suits a single backend instance. For multiple instances, use a shared limiter store. CORS controls browsers and is not authentication or a complete spam-prevention mechanism.

## Editing your content

Edit `frontend/src/data/content.js`:

- `profile`: email, social links and statistics.
- `projects`: title, category, copy, technology tags, slug, screenshots and destinations.
- `services`, `skills`, `journey`, `roles`: reusable content collections.

SocialGen AI is the featured project. Its preview is an illustrative interface concept, not a claim about an existing production screenshot. The other project and gallery entries are clearly labeled independent concepts. No invented client work, project totals, employers or years of experience are presented. Replace them with verified work before using this portfolio professionally.

For an actual project preview, place an optimized WebP/AVIF image in `frontend/public/projects/` and set `image: '/projects/your-image.webp'` in its project object. Set `screenshots` to an array of public image paths. Populate `live` and `repo` with verified HTTPS links. Empty destinations are displayed as unavailable text, never dummy links. Edit the design concept entries in `sections/DesignGallery.jsx` to add your actual visual portfolio.

Profile social links and email are deliberately blank because no verified destinations were supplied. They become active when configured. Statistical values report listed disciplines and tools; update them to your own verified metrics if desired. The loader's percentage represents its short introduction animation, not network download progress.

## Checks

```powershell
# frontend
npm run build

# backend
npm test
```

The API suite exercises success through an injected persistence function and checks validation, allowlisted inputs, CORS, malformed/oversized requests, throttling and error sanitization. A separate integration test uses actual Mongoose persistence when `TEST_MONGO_URI` is set. It creates one uniquely identified test contact and removes only that contact afterward. Use an isolated test database, never a production database.

Without `TEST_MONGO_URI`, the persistence test is explicitly skipped. Passing the other tests does not establish connectivity to your MongoDB deployment.

## Production deployment

### Frontend — Vercel

1. Import this repository and choose `frontend` as the root directory.
2. Select Vite; build command `npm run build`, output directory `dist`.
3. Set `VITE_API_URL` to your deployed HTTPS backend origin.
4. Deploy. `vercel.json` provides SPA route fallbacks, so project URLs work after refresh.
5. Add the final frontend origin to backend `CORS_ORIGINS`.

### Backend — Render

Use the root `render.yaml` blueprint or create a Node web service with root `backend`, build command `npm ci --omit=dev`, start command `npm start`, and health path `/api/health`. Configure `MONGO_URI`, `CORS_ORIGINS` and the proxy setting for your service topology. The blueprint sets one trusted proxy hop; verify that against the actual deployment.

### Backend — Railway

Choose `backend` as the root. Use `npm ci --omit=dev` and `npm start`, configure the same environment variables and attach a public HTTPS domain. The application reads the provider's `PORT`.

### Vercel serverless

The Express app factory is independent of `listen()`. A future adapter can import `createApp`, cache a database connection between invocations and export the app through the platform's supported handler. The current backend is a persistent Node service, not an already-adapted serverless deployment. Replace the in-memory limiter with a shared store for serverless or scaled deployments.

### SEO and launch

The home page includes title, description, Open Graph, Twitter metadata and semantic content. Project pages set their own browser titles. Configure your final domain and generate a sitemap with `npm run sitemap -- https://your-domain.example` from `frontend`, then rebuild. Add a real social sharing image and final canonical metadata once available. For per-project crawler metadata beyond a client-rendered title, use prerendering or SSR as a follow-up.

Before launch: supply real screenshots and links, set the API origin and database, run the real persistence test, verify the live form, and review mobile/keyboard behavior on target devices. This delivery does not claim a Lighthouse score or measured 60fps.

## Structure

```text
portfolio/
  frontend/
    public/             # Static assets and generated sitemap
    scripts/            # SEO generation
    src/
      animations/       # Reusable GSAP/Motion utilities
      components/       # Navigation, space, project previews and UI
      data/             # Editable profile and project content
      pages/            # Home and lazy-loaded project detail route
      sections/         # Contact, projects and design gallery
      utils/            # API client and error translation
      App.jsx
      main.jsx
      styles.css        # Tokens and responsive visual system
  backend/
    config/             # MongoDB lifecycle
    controllers/        # HTTP request orchestration
    middleware/         # Validation and error handling
    models/             # Mongoose schemas
    routes/             # REST routes and contact throttle
    services/           # Persistence operations
    test/               # API and optional database integration tests
    app.js              # Independently testable Express app factory
    server.js           # Startup and graceful shutdown
  render.yaml
  README.md
```

Future projects/services/skills CRUD can follow the same model/service/controller/router boundaries. Add authentication and authorization before exposing management operations. The current public API exposes only health and contact submission.

## Gmail notifications

After a contact is saved in MongoDB, the backend attempts an email notification to `CONTACT_NOTIFICATION_EMAIL`, configured as `syedabdulmoizkazmi0618@gmail.com`. Notifications include the submitted fields and set Reply-To to the client's address. The sender is the server's configured SMTP account, never a client-controlled value.

In `backend/.env`:

```dotenv
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=syedabdulmoizkazmi0618@gmail.com
SMTP_PASS=
CONTACT_NOTIFICATION_EMAIL=syedabdulmoizkazmi0618@gmail.com
```

Enable Google 2-Step Verification and create an App Password: https://support.google.com/accounts/answer/185833 . Paste that App Password into `SMTP_PASS` locally, without spaces, and restart the backend. Do not use your regular Google password or commit this file. If App Passwords are unavailable for your account, configure an authenticated SMTP provider instead.

Deploy these variables as secrets/settings on the backend host as well. The privately hosted static frontend does not send mail itself. No real email delivery has been verified without SMTP credentials.

Notifications are best-effort, with a bounded wait before the HTTP response. An email failure is logged server-side but does not discard the saved contact or report a failed submission to the client. There is no automatic retry queue; inspect MongoDB if notifications fail. SMTP acceptance does not guarantee inbox placement. Tests stub delivery and never send real emails.

### Troubleshooting Gmail authentication

From `backend`, run `npm run email:verify`. This checks SMTP connection and authentication without sending an email or writing a contact. Gmail App Password display spaces are removed automatically; passwords for other SMTP providers are preserved. Diagnostics show fixed guidance rather than raw SMTP errors or credentials.

If Gmail rejects authentication, create a new App Password while signed into the account specified by `SMTP_USER`, replace `SMTP_PASS` in `backend/.env`, and rerun verification. Restart the backend manually after editing `.env` because Node watch mode may not restart for environment-file changes. If a password was exposed in a screenshot, revoke it and replace it locally.

## Portfolio pages

The home page contains the personal introduction, expertise links and technology skills. Work is grouped into dedicated routes:

- `/logo-design`: logo gallery only.
- `/social-media-design`: social media design gallery.
- `/branding`: brand identity work.
- `/ebooks`: eBook services and book design work; navbar dropdown links jump to individual services.
- `/development`: web, app and AI projects together.
- `/#contact`: the contact form at the bottom of Home. The old `/contact` URL redirects here.

Edit `frontend/src/data/expertise.js` for the home-page skill links and page introductions. Gallery categories in `frontend/src/data/designs.js` control the work shown on each design page. The sitemap generator includes these routes. The existing Vercel SPA rewrite supports opening or refreshing each page directly.

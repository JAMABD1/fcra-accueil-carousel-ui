# FCRA Accueil — Carousel UI

Public website and admin area for presenting FCRA content: hero carousel, news, centres, activities, media (photos and videos), library, schools, and thematic sections. Built as a single-page application with a protected `/admin` dashboard for content management.

## Tech stack

| Area | Technology |
|------|------------|
| App | [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| Build | [Vite5](https://vitejs.dev/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) (Radix primitives) |
| Routing | [React Router6](https://reactrouter.com/) |
| Data fetching | [TanStack Query](https://tanstack.com/query) |
| Database | [Neon](https://neon.tech/) (serverless Postgres) via [@neondatabase/serverless](https://github.com/neondatabase/serverless), [Drizzle ORM](https://orm.drizzle.team/) |
| File storage | S3-compatible API ([AWS SDK](https://docs.aws.amazon.com/sdk-for-javascript/); e.g. Cloudflare R2) |
| Auth | JWT ([jose](https://github.com/panva/jose)), bcrypt for passwords |

## Requirements

- **Node.js** 18+ and **npm** (see [nvm](https://github.com/nvm-sh/nvm) if you need a version manager)

## Quick start

```sh
git clone https://github.com/JAMABD1/fcra-accueil-carousel-ui.git
cd fcra-accueil-carousel-ui
npm install
```

Create a `.env` file in the project root (see [Environment variables](#environment-variables)). Then:

```sh
npm run dev
```

The dev server starts via Vite (default URL is printed in the terminal, usually `http://localhost:5173`).

### Other scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run build:dev` | Build in development mode |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Environment variables

Vite exposes only variables prefixed with `VITE_` to the browser. The codebase also accepts several **non-`VITE_`** names as fallbacks where noted (useful for scripts or tooling).

| Variable | Purpose |
|----------|---------|
| `VITE_DATABASE_URL` | Neon / Postgres connection string (`DATABASE_URL` also accepted in code) |
| `VITE_JWT_SECRET` | Secret for signing JWTs (`JWT_SECRET` also accepted) |
| `VITE_AWS_S3_API_URL` | S3-compatible endpoint URL |
| `VITE_AWS_ACCESS_KEY_ID` | Access key |
| `VITE_AWS_SECRET_ACCESS_KEY` | Secret key |
| `VITE_AWS_S3_BUCKET_NAME` | Bucket name |
| `VITE_R2_PUBLIC_URL` | Public base URL for served assets (`R2_PUBLIC_URL` also accepted) |

Never commit real secrets. Keep `.env` out of version control.

## Routes (overview)

| Path | Description |
|------|-------------|
| `/` | Home (hero carousel, highlights, contact) |
| `/actualites`, `/actualites/:id` | News listing and article detail |
| `/administrations` | Administrations page |
| `/centres`, `/centres/:id` | Centres listing and detail |
| `/activites`, `/activites/:id` | Activities |
| `/videos`, `/videos/:id` | Videos |
| `/photos`, `/photos/:id` | Photo galleries |
| `/bibliotheque` | Library |
| `/ecoles`, `/ecoles/:id` | Schools |
| `/sections`, `/sections/:id` | Thematic sections |
| `/login`, `/signup` | Authentication |
| `/admin` | **Protected** admin dashboard |

## Project layout (high level)

- `src/pages/` — Route-level screens
- `src/components/` — Shared UI and feature blocks
- `src/components/admin/` — Admin CRUD and upload flows
- `src/lib/db/` — Drizzle schema, client, queries
- `src/lib/auth/` — JWT and password helpers
- `src/lib/storage/` — S3/R2 upload helpers
- `scripts/` — Optional upload and maintenance scripts

## Deployment

You can deploy the Vite `dist/` output to any static host. Ensure production env vars are set on the host or in your CI/CD pipeline. If you use [Lovable](https://lovable.dev), publishing is available from the project under **Share → Publish**; custom domains are documented in [Lovable’s custom domain guide](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide).

## Lovable project

This repo is connected to a Lovable workspace. Edits in Lovable sync with Git; local changes pushed here are reflected in Lovable as well.

**Lovable project:** https://lovable.dev/projects/912ded3c-b4b2-443a-b64f-ffa0aecbdaf7

## License

This project is **private** (`"private": true` in `package.json`). Use and distribution are governed by your organization’s policies.

# OmniTrack

A full-stack web app for tracking anime and manga. Search any series, add it to your personal tracker, log your progress episode by episode (or chapter by chapter), and **Prestige** your favorites when you finish and start a rewatch.

---

## Problem Statement

Anime and manga fans follow many series at once, across long-running shows (Naruto has 220 episodes; One Piece is past 1,000) and across two formats — the anime and the manga of the same story. It's easy to lose track of where you left off. OmniTrack solves this by giving fans one place to track progress across both anime and manga, mark series as planned / in progress / completed, and show off completions with a prestige system.

## Target User

Anime and manga fans who follow multiple series at once and want a simple personal progress tracker with bragging rights for the series they've finished (and re-finished).

## Features

- Search anime and manga from the Kitsu API, with a "Popular" grid shown before you search
- Add any series to a personal tracker (anime and manga tracked separately)
- Track progress with a visual progress bar and completion percentage
- Ongoing series (no known episode count) are handled gracefully — shown as "Ongoing" instead of a fake percentage
- Update progress, change status, or edit an entry through a pre-filled form
- **Prestige** a finished series: progress resets, a counter increments, and the card's border levels up (bronze → silver → gold)
- Delete entries and whole profiles, each with a confirmation prompt
- Filter by type and status, search your tracker, and sort by newest / oldest / title — all handled by the backend with SQL
- Multiple user profiles (simple profile picker, no password)
- Loading, error, and empty states throughout
- Dark, responsive, mobile-friendly interface

## Technology

- **Frontend:** React, Vite, JavaScript, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (run in Docker)
- **ORM:** Prisma (with raw SQL via `$queryRaw` for the join/search endpoint)
- **External data:** Kitsu API (anime & manga metadata)
- **Tooling:** Git & GitHub, Thunder Client (API testing)

---

## Database Design

Two related tables in a one-to-many relationship.

### `users`
| Column | Type | Notes |
|---|---|---|
| `id` | SERIAL | Primary key |
| `username` | VARCHAR(30) | NOT NULL, UNIQUE |
| `created_at` | TIMESTAMP | Defaults to now |

### `entries`
| Column | Type | Notes |
|---|---|---|
| `id` | SERIAL | Primary key |
| `user_id` | INTEGER | **Foreign key** → `users(id)`, NOT NULL, `ON DELETE CASCADE` |
| `mal_id` | INTEGER | NOT NULL — the series id from the external API |
| `media_type` | VARCHAR(10) | NOT NULL — `'anime'` or `'manga'` |
| `title` | VARCHAR(255) | NOT NULL |
| `image_url` | TEXT | Poster image (nullable) |
| `total_units` | INTEGER | Total episodes/chapters — **nullable** (null = ongoing series) |
| `progress` | INTEGER | NOT NULL, default 0 |
| `status` | VARCHAR(20) | NOT NULL, default `'in_progress'` |
| `prestige_count` | INTEGER | NOT NULL, default 0 |
| `created_at` | TIMESTAMP | Defaults to now |
| `updated_at` | TIMESTAMP | Auto-updates on change |

**Relationship:** one user has many entries; every entry belongs to exactly one user. Deleting a user cascades to delete their entries. A unique constraint on `(user_id, mal_id, media_type)` prevents tracking the same series twice — but still allows the anime and manga versions of the same title as separate entries.

---

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/users` | List all profiles |
| POST | `/api/users` | Create a profile |
| DELETE | `/api/users/:id` | Delete a profile (and its entries) |
| GET | `/api/entries?userId=1` | List a user's entries (supports `type`, `status`, `search`, `sort` filters — **uses a SQL JOIN** to include the username) |
| GET | `/api/entries/:id` | Get one entry |
| POST | `/api/entries` | Add a series to the tracker |
| PUT | `/api/entries/:id` | Update progress / status, or prestige |
| DELETE | `/api/entries/:id` | Remove an entry |

The `GET /api/entries` endpoint uses a raw parameterized SQL query joining `entries` to `users`, with optional `WHERE` filters and `ORDER BY` sorting handled in the database.

---

## Installation & Setup

### Prerequisites
- Node.js
- Docker Desktop (for PostgreSQL)

### 1. Clone the repository
```bash
git clone <repository-url>
cd full-stack-template
```

### 2. Configure environment variables (backend)
```bash
cd apps/backend
cp .env.example .env
```
Then set the values in `.env`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/backend-db?schema=public"
PORT=3001
```
The `.env` file is gitignored and never committed. Only `.env.example` (with empty placeholder values) is in the repo.

### 3. Start PostgreSQL (Docker)
```bash
npm run db:up
```

### 4. Create the database tables and seed data
```bash
npm install
npm run prisma:migrate      # creates the tables from the Prisma schema
npm run db:seed             # inserts a demo user with sample entries
```
The raw SQL versions of the schema and seed data are also provided in `apps/backend/database/schema.sql` and `apps/backend/database/seed.sql`.

### 5. Start the backend
```bash
npm run dev
```
Backend runs on `http://localhost:3001`.

### 6. Start the frontend (in a second terminal)
```bash
cd apps/frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`. Open that URL in your browser.

---

## AI Reflection

**How did you use AI?**
I used AI as a step-by-step pair programmer throughout the project — planning the database schema and API, generating starter code for each endpoint and React component, explaining errors as they came up, and reviewing my code. I built the app one feature at a time and tested each piece before moving on, rather than accepting a whole project at once.

**What did AI help you understand?**
It helped me understand how the layers of a full-stack app connect: how a request travels from React through an Express route to a controller, to Prisma, to PostgreSQL, and back. I also learned the difference between default and named imports/exports in JavaScript, how `req.query` differs from `req.params` and `req.body`, why URL values arrive as strings and need `Number()`, how Prisma's raw `$queryRaw` produces safe parameterized SQL, and how a one-to-many relationship with a foreign key and cascade delete works.

**What incorrect or incomplete AI response did you encounter?**
Several, and catching them was part of the learning:
- The AI's first seed script used a *named* import (`import { prisma }`) but my project's `prisma.js` used a *default* export, so the script crashed. I read the error, checked the export, and fixed the import.
- While testing, I mistyped `{"progress": true}` instead of `{"prestige": true}`. The API accepted it because `Number(true)` is `1` — revealing a validation gap. I tightened the backend to reject boolean values for progress.
- The Jikan API (my original data source) went down for over a day. Because I had isolated all external-API code to a single component, I was able to swap to the Kitsu API by changing about 15 lines in one file, without touching the backend or database.

**How did you test the AI-generated code?**
I tested every endpoint with Thunder Client before wiring it to the frontend — checking both the success cases (correct data and status codes like 200, 201) and the failure cases (missing fields returning 400, unknown ids returning 404, duplicate entries being rejected). On the frontend I tested each feature in the browser and used the developer console and terminal errors to debug.

**What part of the project can you explain without AI assistance?**
I can explain the full request flow from the React frontend through the Express API to PostgreSQL, the two-table database design and why `total_units` is nullable for ongoing series, how the prestige logic works, how the SQL JOIN combines the entries and users tables, and why all user-provided data goes through parameterized queries.
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


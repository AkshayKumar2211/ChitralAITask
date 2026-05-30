# Chitralai Backend

Simple backend for Chitralai — resume screening and candidate ranking.

## Quick Overview
- TypeScript + Express server
- Prisma for Postgres ORM
- Uses Cloudinary for file storage and Gemini for generative AI

## Requirements
- Node.js 18+ (or compatible)
- PostgreSQL database
- npm or pnpm

## Setup
1. Install dependencies:

   npm install

2. Create a `.env` file at the project root. Required variables:

- `DATABASE_URL` — Postgres connection string
- `GEMINI_API_KEY` — API key for Gemini
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — Cloudinary credentials
- `PORT` (optional, defaults to 5000)

3. Generate Prisma client (if you change schema):

   npm run prisma:generate

4. Run database migrations (development):

   npm run prisma:migrate

5. Seed example data (optional):

   npm run seed

## Run
- Development (with hot reload):

  npm run dev

- Build and run production:

  npm run build
  npm start

## Scripts (useful)
- `npm run dev` — start dev server (nodemon + ts-node)
- `npm run build` — compile TypeScript
- `npm run start` — run compiled app
- `npm run prisma:studio` — open Prisma Studio
- `npm run seed` — seed sample resumes and job descriptions

## Project Structure
- `src/` — application code
- `scripts/` — helpful scripts (seeding, docs)
- `prisma/` — Prisma schema and migrations

## Notes
- Env configuration is read in `src/config/env.ts` and will throw for required variables.
- If you plan to upload files, set Cloudinary credentials and folder.

If you'd like, I can add a `.env.example` file or expand any section.

# DevEvents

A Next.js app for discovering developer events — hackathons, meetups, and conferences.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **MongoDB + Mongoose**
- **Tailwind CSS**
- **Cloudinary** (image uploads)
- **PostHog** (analytics)

## Quick Start

```bash
npm install
npm run dev
```

Set up `.env.local` with your MongoDB URI, Cloudinary URL, PostHog keys, and `NEXT_PUBLIC_BASE_URL`.

## Scripts

| Command | Description          |
| ------- | -------------------- |
| `dev`   | Start dev server     |
| `build` | Production build     |
| `start` | Start prod server    |
| `lint`  | Run ESLint           |

## Env Variables

| Variable                 | Description          |
| ------------------------ | -------------------- |
| `MONGO_URI`              | MongoDB connection   |
| `CLOUDINARY_URL`         | Cloudinary uploads   |
| `NEXT_PUBLIC_POSTHOG_KEY`| PostHog API key      |
| `NEXT_PUBLIC_POSTHOG_HOST`| PostHog host       |
| `NEXT_PUBLIC_BASE_URL`   | App's public URL     |

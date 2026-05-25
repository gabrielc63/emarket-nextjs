# Emarket Frontend

Next.js storefront for an Amazon-like marketplace. The frontend talks to the Rails API and currently supports a marketplace intro page plus an API-backed product listing page.

## Features

- Marketplace homepage at `/`
- Product listing page at `/products`
- React Query for server state
- Axios API client
- TypeScript API types generated from the Rails backend
- Tailwind CSS styling
- Loading, empty, and error states for product browsing

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The Rails API should be running on `http://localhost:3002` for product data.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Project Notes

- API modules live in `api/`.
- App routes live in `app/`.
- Shared providers live in `components/`.
- Generated backend types are loaded from `../emarket-nextjs-backend/api-schema.d.ts`.

## Screenshots

Planned: add screenshots of the homepage and product listing once the frontend and backend are running together.

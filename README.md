# Travel Planner

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

Using supabase for postgresql database hosting.

## Prerequisites

- [Node.js](https://nodejs.org/en/)

## Development

Add .env file to root directory with database url and change the password placeholder

```bash
echo "DATABASE_URL=\"postgresql://postgres:[PASSWORD]@db.bnrwmpaxrfhfoetnsttq.supabase.co:5432/postgres\"" >> .env
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Database

Pushing changes to database schema

```bash
npx prisma db push
```

Adding data

```bash
npx prisma studio
```

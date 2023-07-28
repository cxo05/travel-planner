# Travel Planner

A web travel scheduler made to be simple, easy to use and robust. Easily plan out trips and add details such as flights, hotels, sightseeing activities, meals and other miscellaneous tasks without ads, offers and other unnecessary information being shoved into your face!

Built with the [PrimeReact](https://github.com/primefaces/primereact) UI Component Library and uses [Supabase](https://supabase.com/) for postgresql database hosting.

## Features

**Drag and Drop Calendar Schedular**
![Alt text](docs/calendar.png)

**Google Maps Support\***
_\*May be disabled due to rate limits/costs_
<img src="docs/googlemaps.png" alt="drawing" width="500"/>

**Collaborative Plans**
Share your plan with other users

**Export schedule to PDF**
![Alt text](docs/export_pdf.png)

## Development

### Prerequisites

- [Node.js](https://nodejs.org/en/)

### Setup

Clone this repository and `npm install`

Add a .env file to root directory with the following

- DATABASE_URL
- GOOGLE_CLIENT_ID (Login)
- GOOGLE_CLIENT_SECRET (Login)
- NEXTAUTH_SECRET (Production)
- NEXTAUTH_URL (Production)
- GOOGLE_API_KEY (Maps)

E.g.

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

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

### Database

Pushing changes to database schema

```bash
npx prisma db push

npx prisma generate

# Adding/Viewing data manually
npx prisma studio
```

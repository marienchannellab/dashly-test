# LUMEA Skincare — Dashly Studio Test Assignment

Responsive Home Page fragment built from the supplied Figma design. The deployed React frontend uses local catalog data and assets, so it runs independently from the included Strapi project.

## Live deployment

- Frontend: https://dashly-frontend-marienchannellab.onrender.com
- Strapi Admin: https://dashly-strapi-marienchannellab.onrender.com/admin
- Repository: https://github.com/marienchannellab/dashly-test

## Stack

- React 19, TypeScript and Vite
- Strapi 5
- PostgreSQL

## Project structure

```text
dashly-test/
├── frontend/   # React application
├── cms/        # Strapi application
├── .nvmrc      # Node.js major version
└── README.md
```

## Requirements

- Node.js 22.12 or newer within the Node 22 release line
- npm
- PostgreSQL 16 or a compatible PostgreSQL server

## 1. Create the PostgreSQL database

Create a database and user using your preferred PostgreSQL client. One possible local setup is:

```sql
CREATE USER strapi WITH PASSWORD 'strapi';
CREATE DATABASE strapi OWNER strapi;
```

## 2. Configure and start Strapi

```bash
cd cms
cp .env.example .env
npm install
npm run develop
```

Update `cms/.env` with your PostgreSQL connection and generate unique random values for every secret. The local admin panel is available at [http://localhost:1337/admin](http://localhost:1337/admin).

On first launch, create a Strapi administrator. In **Settings → Users & Permissions → Roles → Public**, enable `find` and `findOne` for Announcement Message, Category and Product. Create and publish announcement messages, categories and products in the Content Manager. Draft entries are not returned by the public API.

## 3. Configure and start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The default frontend URL is [http://localhost:5173](http://localhost:5173). Product, category and announcement data is stored in `frontend/src/data/catalog.ts`; product media is bundled with the frontend.

## Production configuration

### Frontend

Build command:

```bash
cd frontend && npm install && npm run build
```

Publish directory: `frontend/dist`.

### Strapi

Set the variables documented in `cms/.env.example`, including `DATABASE_URL` or the individual PostgreSQL connection variables. Use unique production secrets and enable SSL when required by the database provider.

Build command:

```bash
cd cms && npm install && npm run build
```

Start command:

```bash
cd cms && npm run start
```

## Validation

```bash
cd frontend
npm run lint
npm run build

cd ../cms
npm run build
```

## Content

The deployed frontend keeps announcement messages, products, product images, pricing, discounts, badges, variation groups, variation values, categories, category order and product-category relationships in local typed data. The Strapi project remains in the repository as the original CMS implementation, but the frontend no longer requests data or media from it at runtime.

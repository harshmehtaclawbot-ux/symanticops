# Moving to a new computer

## On the new computer

```bash
# 1. Clone (or copy the folder)
git clone <your-repo-url> nexus-platform
cd nexus-platform

# 2. Install deps
npm install

# 3. Set up env file
cp .env.example .env
# Edit .env: set DATABASE_URL, AUTH_SECRET, RESEND_API_KEY

# 4. Set up the database
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed

# 5. Run
npm run dev
```

Open http://localhost:3000 — log in with `admin@nexus.dev` / `Admin@1234`.

---

## Files NOT in git (transfer separately)

- `.env` — copy via AirDrop / password manager (contains your real secrets)
- PostgreSQL data — if you have real data, dump and restore:
  ```bash
  # Old computer
  pg_dump nexus_platform > nexus_platform.sql

  # New computer (after createdb)
  psql nexus_platform < nexus_platform.sql
  ```
  If you only have seed data, just run `npm run db:seed` on the new machine.

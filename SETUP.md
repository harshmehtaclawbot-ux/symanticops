# Nexus Platform — Setup Guide

## Stack
- **Next.js 16** (App Router) + TypeScript
- **PostgreSQL** via `@prisma/adapter-pg` + **Prisma 7**
- **NextAuth v5** (JWT sessions)
- **Resend** (email sending)
- **Tailwind CSS** + **shadcn/ui** (base-nova theme)

---

## Prerequisites
- Node.js 18+
- PostgreSQL database running locally (or a hosted instance)

---

## 1. Configure environment

Edit `.env`:

```bash
# Your PostgreSQL connection string
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/nexus_platform"

# Generate a random secret: openssl rand -base64 32
AUTH_SECRET="your-random-secret-here"

# Your Resend API key (resend.com)
RESEND_API_KEY="re_your_key_here"
```

---

## 2. Create the database & run migrations

```bash
# Create the database (if it doesn't exist)
createdb nexus_platform

# Run migrations
npx prisma migrate dev --name init

# Seed the super admin account
npm run db:seed
```

**Default super admin credentials:**
- Email: `admin@nexus.dev`
- Password: `Admin@1234`
- ⚠️ Change the password after first login.

---

## 3. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Portal URLs

| URL | Role | Purpose |
|-----|------|---------|
| `/login` | All | Sign in |
| `/register` | All | Create a new customer org |
| `/admin` | Super Admin | Full platform management |
| `/admin/customers` | Super Admin | Manage customer organizations |
| `/admin/campaigns` | Super Admin | Create & send email campaigns |
| `/admin/users` | Super Admin | View all users |
| `/admin/analytics` | Super Admin | Platform-wide email stats |
| `/dashboard` | Org Admin / User | Customer overview |
| `/dashboard/contacts` | Org Admin / User | Manage contacts |
| `/dashboard/campaigns` | Org Admin / User | View campaigns |

---

## Roles

| Role | Access |
|------|--------|
| `SUPER_ADMIN` | Full admin portal — manages all orgs, campaigns, users |
| `ORG_ADMIN` | Customer dashboard — manages their org's data |
| `ORG_USER` | Customer dashboard — read-only org access |

---

## Email Campaigns

1. Create contacts for an organization (via `/dashboard/contacts` or API)
2. Optionally create contact lists and add contacts to them
3. In admin → Campaigns → New Campaign:
   - Select organization and optional list
   - Build HTML email (template with merge tags provided)
   - Click **Send Now** (sends immediately) or **Save Draft**

**Merge tags:** `{{first_name}}`, `{{last_name}}`, `{{email}}`, `{{company}}`, `{{unsubscribe_url}}`

---

## Useful Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Seed super admin
npm run db:studio    # Open Prisma Studio (DB GUI)
```

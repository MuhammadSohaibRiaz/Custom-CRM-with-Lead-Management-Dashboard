# LeadFlow - Custom CRM with Lead Management Dashboard

LeadFlow is a modern, high-performance Customer Relationship Management (CRM) platform built to handle lead pipelines, team assignments, and analytics dynamically. Designed for speed, aesthetic appeal, and enterprise-grade data management, it leverages Next.js App Router and Supabase Postgres.

> **Project Goals:** To provide a robust, role-based, real-time lead management dashboard enabling sales teams and administrators to capture, track, and convert leads effectively without complex overhead.

## 🚀 Key Features
- **Real-Time Pipeline Management:** Visual Kanban pipeline to track leads through different stages (New → Contacted → Qualified → Proposal → Closed).
- **Role-Based Access Control (RBAC):** Distinct `admin` and `agent` roles. Admins manage users, assign leads, and view global analytics. Agents manage their assigned leads.
- **Analytics & Reporting:** Interactive charts (via Recharts) displaying lead conversion rates, user activity, and total pipeline value.
- **Modern User Interface:** Built with Tailwind CSS v4, Lucide React icons, and accessible custom UI components.
- **Secure Authentication:** Complete integration with Supabase Auth (magic links / email & password authentication).

## 💻 Tech Stack
- **Frontend Framework:** Next.js 14+ (App Router, Server Actions, React 19)
- **Styling:** Tailwind CSS (v4) & clsx/tailwind-merge
- **Data Visualization:** Recharts
- **Icons:** Lucide-React
- **Backend & Database:** Supabase (PostgreSQL with Row Level Security and Triggers)
- **Authentication:** `@supabase/ssr` with Next.js Cookies Server-Side Rendering

## 🛠️ Use-Case
**Target Audience:** Mid-scale sales teams, agencies, and real estate professionals.
**Problem Solved:** Often CRMs are bloated and hard to configure. LeadFlow is lightweight, strictly focusing on lead lifecycle movement and agent assignments, minimizing data sprawl while enforcing strict data ownership via Postgres RLS.

## ⚙️ Setup & Installation
1. First, create a Supabase Project and retrieve your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. Add them to a `.env.local` file at the root.
3. Apply the database schema inside your Supabase SQL Editor: `supabase/migrations/001_schema.sql`
4. Create a few users using the Supabase Dashboard Authentication panel.
5. Populate dummy data by running the provided Dynamic Seed Script `supabase/seed.sql` in the SQL Editor.
6. Install dependencies:
```bash
npm install
```
7. Start the development server:
```bash
npm run dev
```

## 📸 Screenshots
*(Please add screenshots to the `/screenshots/` directory showcasing the desktop and mobile views of the Dashboard, Pipeline, Leads Table, and Analytics!)*

---
*Built as a showcase for high-performance React + Postgres interactions.*
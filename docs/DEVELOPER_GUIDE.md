# EduSync — Developer Guide

Complete reference for understanding, modifying, and extending this School ERP SaaS application.

---

## Table of Contents

1. [What This App Is](#1-what-this-app-is)
2. [Tech Stack](#2-tech-stack)
3. [Getting Started](#3-getting-started)
4. [Project Structure](#4-project-structure)
5. [Application Workflow](#5-application-workflow)
6. [Authentication & Security](#6-authentication--security)
7. [Data Layer (Mock vs API)](#7-data-layer-mock-vs-api)
8. [How to Modify Common Things](#8-how-to-modify-common-things)
9. [Module Reference (All Pages)](#9-module-reference-all-pages)
10. [Connecting ASP.NET Core Backend](#10-connecting-aspnet-core-backend)
11. [Environment Variables](#11-environment-variables)
12. [UI & Design System](#12-ui--design-system)
13. [Conventions & Patterns](#13-conventions--patterns)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. What This App Is

**EduSync** is a multi-tenant School ERP SaaS frontend built with **Next.js 16 (App Router)**. It serves four user types:

| Role | Portal | Purpose |
|------|--------|---------|
| **Admin** | `/dashboard` + admin modules | Full school management |
| **Teacher** | `/teacher-portal` | Classes, leave, attendance, payroll |
| **Student** | `/student-portal` | Timetable, exams, fees, attendance |
| **Parent** | `/parent-portal` | Children, fees, transport, notices |

**Current state:**
- UI is fully built with **mock/demo data** in `lib/erp-data.ts`
- **Production SaaS infrastructure** is wired (auth, BFF proxy, React Query, middleware)
- Backend API calls are **ready to plug in** — flip `NEXT_PUBLIC_USE_MOCK=false` when ASP.NET Core is ready

---

## 2. Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Radix UI) |
| Forms | React Hook Form + Zod |
| Tables | TanStack Table |
| Data Fetching | TanStack React Query |
| Animation | Framer Motion |
| Charts | Recharts |
| Package Manager | **pnpm** (not npm) |

---

## 3. Getting Started

### Install & run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo login credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@school.edu` | `admin123` |
| Teacher | `anita.s@school.edu` | `teacher123` |
| Student | `arjun.s@school.edu` | `student123` |
| Parent | `rajesh.sharma@email.com` | `parent123` |

### Build for production

```bash
pnpm build
pnpm start
```

---

## 4. Project Structure

```
school-erp-dashboard/
├── app/                          # Next.js pages (routes)
│   ├── page.tsx                  # Landing page (/)
│   ├── login/                    # Login
│   ├── get-started/              # SaaS onboarding / signup flow
│   ├── dashboard/                # Admin home
│   ├── students/                 # Admin modules...
│   ├── teacher-portal/           # Teacher portal
│   ├── student-portal/           # Student portal
│   ├── parent-portal/            # Parent portal
│   └── api/                      # BFF (Backend-for-Frontend) routes
│       ├── auth/                 # login, logout, me, refresh
│       ├── proxy/[...path]/      # Forwards to ASP.NET Core
│       ├── tenant/               # Tenant cookie sync
│       └── health/               # Health check
│
├── components/
│   ├── ui/                       # shadcn/ui primitives (Button, Dialog, etc.)
│   ├── dashboard/                # Admin shell (sidebar, header, layout)
│   ├── portal/                   # Portal shell + guards
│   ├── auth/                     # Login animations, AdminGuard
│   ├── landing/                  # Marketing landing page
│   ├── admission/                # Multi-step admission wizard
│   ├── parent-portal/            # Parent-specific panels
│   ├── teacher-portal/           # Teacher-specific components
│   ├── shared/                   # Reusable (DataTable, SlideOver, etc.)
│   └── providers/                # React context providers
│
├── lib/
│   ├── api/                      # API client + domain modules
│   ├── auth/                     # Session, cookies, server auth
│   ├── tenant/                   # Multi-tenant context
│   ├── config/                   # Environment config
│   ├── constants/                # Route constants
│   ├── observability/            # Error reporting hooks
│   ├── erp-data.ts               # ⭐ Main mock/demo data
│   ├── schemas.ts                # Zod validation schemas
│   ├── portal-users.ts           # Demo login accounts
│   ├── parent-portal.ts          # Parent portal data helpers
│   ├── teacher-portal.ts         # Teacher portal data helpers
│   ├── student-portal.ts         # Student portal data helpers
│   └── admission/                # Admission form schemas & storage
│
├── hooks/
│   ├── api/                      # React Query hooks (useStudents, useAuth)
│   └── use-mobile.ts, use-toast.ts
│
├── middleware.ts                 # Route protection + role redirects
├── docs/                         # Documentation (this file)
└── .env.local                    # Local environment (gitignored)
```

---

## 5. Application Workflow

### 5.1 High-level user journey

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────────────────┐
│  Landing    │────▶│    Login     │────▶│  Role-based home page       │
│  (/)        │     │  (/login)    │     │  admin → /dashboard         │
└─────────────┘     └──────────────┘     │  teacher → /teacher-portal  │
       │                    ▲             │  student → /student-portal  │
       │                    │             │  parent → /parent-portal    │
       ▼                    │             └─────────────────────────────┘
┌─────────────┐             │
│ Get Started │─────────────┘  (onboarding → auto admin login)
│ (/get-started)
└─────────────┘
```

### 5.2 Request flow (technical)

When the app talks to your ASP.NET Core API:

```
Browser (React)
    │
    ▼
lib/api/client.ts  ──▶  /api/proxy/students  (Next.js BFF)
    │                         │
    │                         ▼
    │                   Adds: Authorization header (from httpOnly cookie)
    │                         X-Tenant-Id header
    │                         X-Correlation-Id header
    │                         │
    │                         ▼
    │                   ASP.NET Core API  (/api/students)
    │
    ▼
React Query cache → UI updates
```

**Auth flow (login):**

```
Login form
    │
    ▼
POST /api/auth/login  (Next.js route)
    │
    ├── Mock mode: validates against lib/portal-users.ts
    └── Live mode: forwards to ASP.NET POST /auth/login
    │
    ▼
Sets httpOnly cookies (erp-access-token, erp-refresh-token)
Saves session to localStorage (backward compat)
    │
    ▼
Redirects to role home (/dashboard, /teacher-portal, etc.)
```

### 5.3 App bootstrap (every page load)

```
app/layout.tsx
    │
    ├── ThemeProvider          (dark/light mode)
    ├── AppProviders
    │     ├── QueryProvider    (React Query)
    │     ├── AuthProvider     (session from /api/auth/me)
    │     └── TenantProvider   (school/tenant context)
    ├── AppShell               (animated background)
    └── ErpToaster             (toast notifications)
```

### 5.4 Admin page pattern

Most admin modules follow this structure:

```
app/students/page.tsx
    │
    ├── DashboardLayout        ← wraps with AdminGuard + sidebar + header
    │     └── AdminGuard       ← redirects non-admins
    │
    ├── PageHeader, StatCard   ← shared layout components
    ├── DataTable              ← TanStack Table
    ├── SlideOver              ← add/edit form panel
    └── useState(erp-data)     ← currently mock data (will become useStudents())
```

### 5.5 Portal page pattern

```
app/parent-portal/page.tsx
    │
    ├── PortalGuard            ← allowedRoles={['parent']}
    ├── PortalLayout           ← portal sidebar + header
    └── ParentPortalContent    ← reads getSession() + lib/parent-portal.ts
```

---

## 6. Authentication & Security

### Key files

| File | Purpose |
|------|---------|
| `middleware.ts` | Blocks unauthenticated users; redirects by role |
| `lib/auth/session.ts` | Client session (localStorage) |
| `lib/auth/cookies.ts` | Cookie names, demo token encode/decode |
| `lib/auth/server.ts` | Server-side login, token resolution |
| `app/api/auth/*` | BFF auth endpoints |
| `components/providers/auth-provider.tsx` | React context: `useAuth()` |
| `lib/portal-users.ts` | Demo accounts (mock mode only) |

### Using auth in components

```tsx
'use client'
import { useAuth } from '@/components/providers/auth-provider'

function MyComponent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return null

  return <p>Hello, {user?.name} ({user?.role})</p>
}
```

### Route protection

| Guard | File | Used by |
|-------|------|---------|
| `AdminGuard` | `components/auth/admin-guard.tsx` | `DashboardLayout` |
| `PortalGuard` | `components/portal/portal-guard.tsx` | Portal pages |
| `middleware.ts` | root | All routes (cookie check) |

### Adding a new protected route

1. Add the path prefix to `middleware.ts` → `isAdminRoute()` if admin-only
2. Add nav item in `components/dashboard/sidebar.tsx` (for admin)
3. Wrap page with `DashboardLayout` or `PortalGuard`

---

## 7. Data Layer (Mock vs API)

### Current: Mock data (default)

Most pages import data directly:

```tsx
import { studentsData } from '@/lib/erp-data'

const [students, setStudents] = React.useState(studentsData)
```

Changes are **in-memory only** — refresh the page and data resets.

**Main data files:**

| File | Contains |
|------|----------|
| `lib/erp-data.ts` | Students, teachers, fees, payroll, transport, library, etc. |
| `lib/data.ts` | Dashboard stats, charts, schools list |
| `lib/parent-portal.ts` | Parent + children relationships |
| `lib/teacher-portal.ts` | Teacher timetable, leave, attendance |
| `lib/student-portal.ts` | Student profile, exams |
| `lib/parent-fees.ts` | Parent fee summaries |
| `lib/parent-notices.ts` | School notices for parents |
| `lib/parent-transport.ts` | Bus/route info |

### Future: Live API

Infrastructure is ready. Pattern to migrate a module:

```
1. Define DTO types     → lib/api/types/students.ts
2. Implement API calls  → lib/api/students.ts
3. Create React Query hook → hooks/api/use-students.ts
4. Replace in page:
   - OLD: useState(studentsData)
   - NEW: const { data, isLoading } = useStudents()
```

**Example (students — already templated):**

```tsx
// hooks/api/use-students.ts
import { useStudents } from '@/hooks/api'

function StudentsPage() {
  const { data, isLoading, error } = useStudents({ page: 1, pageSize: 20 })
  const students = data?.items ?? []
  // ...
}
```

---

## 8. How to Modify Common Things

### 8.1 Add a new admin page

1. **Create the page:**
   ```
   app/my-module/page.tsx
   ```

2. **Use the standard template:**
   ```tsx
   'use client'
   import { DashboardLayout } from '@/components/dashboard/layout'
   import { PageHeader } from '@/components/shared/page-components'

   export default function MyModulePage() {
     return (
       <DashboardLayout>
         <PageHeader title="My Module" description="Manage something" />
         {/* your content */}
       </DashboardLayout>
     )
   }
   ```

3. **Add to sidebar** — edit `components/dashboard/sidebar.tsx`:
   ```tsx
   const navigationItems = [
     // ...existing items
     { name: 'My Module', href: '/my-module', icon: 'Package' },
   ]
   ```

4. **Add to middleware** — edit `middleware.ts` → `isAdminRoute()` prefixes array.

---

### 8.2 Add a new sidebar menu item (existing page)

Edit `components/dashboard/sidebar.tsx` → `navigationItems` array.

Icons must exist in the `iconMap` object in the same file (Lucide icon names).

---

### 8.3 Change demo login credentials

Edit `lib/portal-users.ts`:
- `portalAccounts` array — all valid logins
- `demoLoginHints` — pre-filled values on login page

---

### 8.4 Add / change form validation

1. Add or edit schema in `lib/schemas.ts`:
   ```tsx
   export const mySchema = z.object({
     name: z.string().min(2),
     email: z.string().email(),
   })
   export type MyFormData = z.infer<typeof mySchema>
   ```

2. Use in page:
   ```tsx
   const form = useForm<MyFormData>({
     resolver: zodResolver(mySchema),
     defaultValues: { name: '', email: '' },
   })
   ```

---

### 8.5 Add mock data for a new entity

1. Add types + array in `lib/erp-data.ts`
2. Import in your page: `import { myData } from '@/lib/erp-data'`
3. Optionally add helper functions in a dedicated `lib/my-module.ts`

---

### 8.6 Change landing page content

| What | File |
|------|------|
| Hero text, features, FAQ | `lib/landing/content.ts` |
| Page sections | `components/landing/landing-page.tsx` |
| Hero, stats, testimonials | `components/landing/*.tsx` |

---

### 8.7 Change app name / branding

| What | File |
|------|------|
| Browser tab title | `app/layout.tsx` → `metadata.title` |
| Login / landing brand | `lib/landing/content.ts` → `brand` |
| Sidebar logo text | `components/dashboard/sidebar.tsx` |

---

### 8.8 Change theme (dark/light default)

Edit `app/layout.tsx`:
```tsx
<ThemeProvider defaultTheme="dark" ...>
```

Colors and CSS variables: `app/globals.css`

---

### 8.9 Add a new portal tab (e.g. parent portal)

1. Edit `app/parent-portal/page.tsx` — add tab to `Tabs` component
2. Create panel component in `components/parent-portal/my-panel.tsx`
3. Add data helpers in `lib/parent-portal.ts` or `lib/parent-*.ts`

---

### 8.10 Modify admission wizard

| Step | File |
|------|------|
| Wizard orchestration | `components/admission/admission-form-wizard.tsx` |
| Individual steps | `components/admission/steps/*.tsx` |
| Validation schema | `lib/admission/schema.ts` |
| Draft auto-save | `lib/admission/storage.ts` |
| Constants (classes, etc.) | `lib/admission/constants.ts` |

---

### 8.11 Connect a module to ASP.NET Core API

**Step-by-step for any module (e.g. Teachers):**

1. **Types** — `lib/api/types/teachers.ts`
   ```tsx
   export type TeacherDto = { id: string; name: string; /* ... */ }
   ```

2. **API module** — `lib/api/teachers.ts`
   ```tsx
   import { api } from './client'
   export const teachersApi = {
     list: () => api<TeacherDto[]>('/teachers'),
     create: (body) => api<TeacherDto>('/teachers', { method: 'POST', body: JSON.stringify(body) }),
   }
   ```

3. **Query keys** — add to `hooks/api/query-keys.ts`

4. **Hook** — `hooks/api/use-teachers.ts`
   ```tsx
   export function useTeachers() {
     return useQuery({
       queryKey: queryKeys.teachers.list(),
       queryFn: () => teachersApi.list(),
     })
   }
   ```

5. **Page** — replace `useState(teachersData)` with `useTeachers()`

6. **Backend** — ensure ASP.NET exposes `GET/POST /api/teachers`

---

### 8.12 Add multi-tenant (school) switching

Tenant context lives in:
- `lib/tenant/` — types, storage, constants
- `components/providers/tenant-provider.tsx` — `useTenant()` hook
- Header school switcher — `components/dashboard/header.tsx` (UI exists, wire to `setTenant()`)

When switching tenants:
```tsx
const { setTenant } = useTenant()
setTenant({ id: 'school-002', slug: 'greenwood', name: 'Greenwood High' })
```

This updates localStorage + syncs `erp-tenant-id` cookie for BFF requests.

---

## 9. Module Reference (All Pages)

### Public pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Marketing landing page |
| `/login` | `app/login/page.tsx` | Multi-role login |
| `/get-started` | `app/get-started/page.tsx` | SaaS signup / onboarding wizard |

### Admin modules (require admin role)

| Route | File | Primary data source |
|-------|------|-------------------|
| `/dashboard` | `app/dashboard/page.tsx` | `lib/data.ts` |
| `/students` | `app/students/page.tsx` | `lib/erp-data.ts` |
| `/teachers` | `app/teachers/page.tsx` | `lib/erp-data.ts` |
| `/parents` | `app/parents/page.tsx` | `lib/erp-data.ts` |
| `/admission` | `app/admission/page.tsx` | `lib/admission/*` |
| `/academics` | `app/academics/page.tsx` | `lib/erp-data.ts` |
| `/attendance` | `app/attendance/page.tsx` | `lib/erp-data.ts` |
| `/fees` | `app/fees/page.tsx` | `lib/erp-data.ts`, `lib/fees/*` |
| `/payroll` | `app/payroll/page.tsx` | `lib/erp-data.ts` |
| `/hr` | `app/hr/page.tsx` | `lib/erp-data.ts` |
| `/transport` | `app/transport/page.tsx` | `lib/erp-data.ts` |
| `/exams` | `app/exams/page.tsx` | `lib/erp-data.ts` |
| `/library` | `app/library/page.tsx` | `lib/erp-data.ts` |
| `/hostel` | `app/hostel/page.tsx` | `lib/erp-data.ts` |
| `/timetable` | `app/timetable/page.tsx` | `lib/erp-data.ts` |
| `/inventory` | `app/inventory/page.tsx` | `lib/erp-data.ts` |
| `/notifications` | `app/notifications/page.tsx` | `lib/erp-data.ts` |
| `/reports` | `app/reports/page.tsx` | `lib/data.ts` |
| `/settings` | `app/settings/page.tsx` | Static UI |
| `/billing` | `app/billing/page.tsx` | Static UI |

### Portals

| Route | File | Guard | Data helpers |
|-------|------|-------|--------------|
| `/teacher-portal` | `app/teacher-portal/page.tsx` | `teacher` | `lib/teacher-portal.ts` |
| `/student-portal` | `app/student-portal/page.tsx` | `student` | `lib/student-portal.ts` |
| `/parent-portal` | `app/parent-portal/page.tsx` | `parent` | `lib/parent-portal.ts`, `lib/parent-fees.ts`, etc. |

---

## 10. Connecting ASP.NET Core Backend

### Enable live API

In `.env.local`:

```env
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_URL=https://your-api.com/api
API_URL=https://your-api.com/api
```

### Required backend endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/auth/login` | Returns `{ accessToken, refreshToken?, user }` |
| POST | `/api/auth/refresh` | Returns `{ accessToken, refreshToken? }` |
| GET | `/api/auth/me` | Returns current user |
| GET/POST/... | `/api/students`, `/api/fees`, etc. | Domain CRUD |

### ASP.NET Core CORS (development)

```csharp
builder.Services.AddCors(o => o.AddPolicy("NextApp", p =>
    p.WithOrigins("http://localhost:3000")
     .AllowAnyHeader()
     .AllowAnyMethod()
     .AllowCredentials()));
```

### Error response format (recommended)

Your API should return errors in this shape (already handled by `lib/api/interceptors/errors.ts`):

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Student email is invalid",
  "errors": {
    "email": ["Invalid email format"]
  }
}
```

### BFF proxy

All browser API calls go through `/api/proxy/*` — you do **not** call ASP.NET directly from React components. The proxy (`app/api/proxy/[...path]/route.ts`) attaches the auth token and tenant ID from cookies.

---

## 11. Environment Variables

Copy `.env.example` → `.env.local`:

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Frontend URL | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | ASP.NET API base (browser-safe) | `http://localhost:5000/api` |
| `NEXT_PUBLIC_USE_MOCK` | Use demo data + mock auth | `true` |
| `API_URL` | Server-side API URL (BFF proxy) | Same as above |

> Never commit `.env.local`. It is gitignored.

---

## 12. UI & Design System

### Component layers

```
components/ui/          → Primitives (don't edit unless theming)
components/shared/      → App-level reusables (DataTable, SlideOver, PageHeader)
components/dashboard/   → Admin shell
components/portal/      → Portal shell
```

### Key shared components

| Component | File | Use for |
|-----------|------|---------|
| `DataTable` | `components/shared/data-table.tsx` | Sortable/filterable tables |
| `SlideOver` | `components/shared/slide-over.tsx` | Add/edit side panels |
| `ConfirmDialog` | `components/shared/confirm-dialog.tsx` | Delete confirmations |
| `PageHeader` | `components/shared/page-components.tsx` | Page title + actions |
| `StatCard` | `components/shared/page-components.tsx` | KPI cards |
| `FormField` | `components/shared/page-components.tsx` | Form field wrapper |

### Adding a new shadcn component

This project uses shadcn/ui. To add a component manually, follow [ui.shadcn.com](https://ui.shadcn.com) and place files in `components/ui/`.

---

## 13. Conventions & Patterns

### File naming
- Pages: `app/module-name/page.tsx`
- Components: `kebab-case.tsx`
- Lib utilities: `kebab-case.ts`
- Types: co-located or in `lib/api/types/`

### Client vs Server
- All interactive pages use `'use client'` at the top
- Server-only logic goes in `app/api/` routes or `lib/auth/server.ts`
- Never import `lib/auth/server.ts` in client components

### State management
- **Local UI state:** `useState`
- **Server data:** React Query hooks in `hooks/api/`
- **Global auth/tenant:** Context providers (`useAuth`, `useTenant`)

### Forms
Always use: **React Hook Form + Zod resolver + shadcn Form components**

### Toasts
```tsx
import { useToast } from '@/hooks/use-toast'
const { toast } = useToast()
toast({ title: 'Saved', description: 'Student updated successfully.' })
```

---

## 14. Troubleshooting

### "Redirected to login" even after logging in
- Clear cookies and localStorage
- Ensure `.env.local` has `NEXT_PUBLIC_USE_MOCK=true` for demo mode
- Check browser devtools → Application → Cookies → `erp-access-token` exists

### `pnpm` vs `npm`
This project uses **pnpm**. Always run:
```bash
pnpm install
pnpm add <package>
pnpm dev
```

### Changes to mock data not showing
- Mock data is imported at module load — hard refresh (Ctrl+Shift+R)
- In-memory edits reset on page refresh (expected until API is connected)

### Middleware blocking a new public route
Add the path to `PUBLIC_ROUTES` in `lib/constants/routes.ts`

### API calls failing after connecting backend
1. Check `NEXT_PUBLIC_USE_MOCK=false`
2. Verify ASP.NET is running and CORS is configured
3. Check Network tab: requests should go to `/api/proxy/...`
4. Check `app/api/proxy/[...path]/route.ts` logs / response status

### TypeScript errors on build
Some pre-existing type issues exist in admission/landing modules — they are unrelated to the SaaS infrastructure. Run:
```bash
pnpm exec tsc --noEmit
```

---

## Quick Reference: "I want to…"

| Goal | Go to |
|------|-------|
| Change demo students data | `lib/erp-data.ts` → `studentsData` |
| Add admin menu item | `components/dashboard/sidebar.tsx` |
| Change login page | `app/login/page.tsx` |
| Change who can access a page | `middleware.ts` + guards |
| Add API endpoint | `lib/api/<module>.ts` + `hooks/api/use-<module>.ts` |
| Change validation rules | `lib/schemas.ts` |
| Change school branding | `lib/landing/content.ts` |
| Switch to real backend | `.env.local` → `NEXT_PUBLIC_USE_MOCK=false` |
| Add error tracking | `lib/observability/report-error.ts` |

---

*Last updated: reflects production SaaS architecture with BFF, React Query, multi-tenant support, and mock data layer.*

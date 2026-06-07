# API Endpoints Reference

Frontend calls the ASP.NET Core backend through the Next.js BFF proxy at `/api/proxy/*`, which forwards to `NEXT_PUBLIC_API_URL` (default `http://localhost:5000/api`).

## Base config

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_TENANT_ID=demo-school-001
NEXT_PUBLIC_USE_MOCK=false
```

**Every protected request needs:**

- `X-Tenant-Id: demo-school-001`
- `Authorization: Bearer <accessToken>`

**`{id}`** = external id from API responses (e.g. `"1"`, `"2"`) — not the database GUID.

**Versioned alias:** all routes also work under `/api/v1/...` (same handlers).

## Auth (no token for login)

| Method | URL |
|--------|-----|
| POST | `/api/auth/login` |
| POST | `/api/auth/refresh` |
| GET | `/api/auth/me` |
| GET | `/api/auth/oidc/config` |
| POST | `/api/auth/oidc/login` |

## System

| Method | URL |
|--------|-----|
| GET | `/health` |
| GET | `/api/version` |
| GET | `/api/region` |
| GET | `/api/chaos/config` |

## Tenancy

| Method | URL |
|--------|-----|
| POST | `/api/tenants/provision` |
| GET | `/api/tenants/by-slug/{slug}` |
| GET | `/api/tenants/current` |
| GET | `/api/tenants/{id}` |

## Students, teachers, parents

CRUD at `/api/students`, `/api/teachers`, `/api/parents`.

## Academics, admissions, attendance, fees

See backend Swagger at `http://localhost:5000/swagger` for full schemas.

Key routes used by this frontend:

- `GET/POST /api/academics/classes`, `/api/academics/subjects`
- `GET/POST/PUT /api/admissions`, `POST /api/admissions/{id}/submit`
- `GET/POST /api/attendance`, `POST /api/attendance/bulk`
- `GET/POST /api/fees`, `POST /api/fees/{id}/payments`
- `GET /api/payments?studentId=`

## Portals

| Role | Endpoints |
|------|-----------|
| Student | `/api/students/me`, `/fees`, `/attendance`, `/exams`, `/timetable`, `/library/issues` |
| Teacher | `/api/teachers/me`, `/leaves`, `/payroll`, `/timetable` |
| Parent | `/api/parents/me`, `/children`, `/children/{id}/fees`, `/attendance`, `/transport` |

## Dashboard & reports

- `GET /api/dashboard`
- `GET /api/reports?type=&from=&to=`
- `GET /api/reports/export?format=csv|pdf&type=fees|attendance|payroll`

## Demo login

```json
POST /api/auth/login
{ "email": "admin@school.edu", "password": "admin123" }
```

## Frontend mapping

| Browser call | Backend |
|--------------|---------|
| `/api/proxy/students` | `GET /api/students` |
| `/api/auth/login` | BFF → `POST /api/auth/login` |

Portal hooks live in `hooks/api/use-*-portal.ts`. Domain APIs live in `lib/api/`.

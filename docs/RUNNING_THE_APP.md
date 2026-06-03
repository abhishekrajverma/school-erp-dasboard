# Running the App

How to start the EduSync frontend locally — with **pnpm** (development) or **Docker** (production-style).

---

## Quick answer

| Goal | Command |
|------|---------|
| **Daily coding** (hot reload) | `pnpm dev` |
| **Run in Docker** | `docker compose up --build` |

Both serve the app at **http://localhost:3000**

---

## Option 1: Local development — `pnpm dev`

Use this while you are building or changing the app.

### Prerequisites

- Node.js 20+
- pnpm installed

### Steps

```bash
# Install dependencies (first time only)
pnpm install

# Copy environment file (first time only)
cp .env.example .env.local

# Start dev server
pnpm dev
```

Open **http://localhost:3000**

### What you get

- Hot reload — save a file and the browser updates
- Fast startup
- Best for everyday work

### Stop the server

Press `Ctrl + C` in the terminal.

---

## Option 2: Docker — `docker compose up`

Use this to run the app inside a container (production-like), or to test before deployment.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and **running**

### Steps

```bash
# Build and start (first time or after code changes)
docker compose up --build
```

Open **http://localhost:3000**

### Run in the background

```bash
docker compose up --build -d
```

### Stop Docker

```bash
docker compose down
```

### Custom environment

```bash
cp .env.docker.example .env.docker
# Edit .env.docker if needed
docker compose --env-file .env.docker up --build
```

### What you get

- Same app, packaged like production
- No hot reload — rebuild after code changes:
  ```bash
  docker compose up --build
  ```

---

## Side-by-side comparison

| | `pnpm dev` | `docker compose up` |
|---|------------|---------------------|
| **Best for** | Development | Deploy test / production |
| **Hot reload** | Yes | No |
| **First start** | Fast | Slower (builds image) |
| **After code changes** | Auto refresh | Run `docker compose up --build` again |
| **Needs Docker Desktop** | No | Yes |

---

## Demo login

Works in both modes (with `NEXT_PUBLIC_USE_MOCK=true`):

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@school.edu` | `admin123` |
| Teacher | `anita.s@school.edu` | `teacher123` |
| Student | `arjun.s@school.edu` | `student123` |
| Parent | `rajesh.sharma@email.com` | `parent123` |

---

## Connecting to ASP.NET Core API

### With `pnpm dev`

In `.env.local`:

```env
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_URL=http://localhost:5000/api
API_URL=http://localhost:5000/api
```

Restart: `pnpm dev`

### With Docker

ASP.NET on your **host machine** (not in Docker):

```env
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_URL=http://localhost:5000/api
API_URL=http://host.docker.internal:5000/api
```

Put these in `.env.docker` and run:

```bash
docker compose --env-file .env.docker up --build
```

> `host.docker.internal` lets the container reach services running on your Windows/Mac host.

---

## Recommended workflow

```
1. Code & test        →  pnpm dev
2. Before deploy      →  docker compose up --build
3. On server/VPS      →  docker compose up -d
```

---

## Troubleshooting

### Docker: "cannot connect to docker API"

Start **Docker Desktop** and wait until it shows "Running", then try again.

### Port 3000 already in use

Stop the other process, or change the port in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"
```

Then open http://localhost:3001

### Docker changes not showing

Rebuild the image:

```bash
docker compose up --build
```

### `pnpm: command not found`

Install pnpm:

```bash
npm install -g pnpm
```

Or enable via corepack:

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

---

## Related docs

- Full architecture & modification guide: [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
- Environment variables: `.env.example` and `.env.docker.example`

/**
 * MSW handlers for local API mocking.
 * Enable when building UI without ASP.NET Core running.
 *
 * Setup (when ready):
 *   pnpm add -D msw
 *   npx msw init public/
 *   import handlers in app layout for dev only
 */

export const mswHandlers = [] as const

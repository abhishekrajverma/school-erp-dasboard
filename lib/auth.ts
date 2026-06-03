/**
 * Backward-compatible re-exports.
 * Prefer importing from '@/lib/auth' submodules in new code.
 */
export {
  AUTH_STORAGE_KEY,
  clearSession,
  getRoleHomePath,
  getSession,
  isAuthenticated,
  login,
  markLoggedIn,
  markLoggedOut,
  saveSession,
  sessionHasRole,
  type AuthSession,
} from './auth/index'

export {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  SESSION_COOKIE,
  AUTH_STORAGE_KEY,
  DEMO_TOKEN_PREFIX,
  decodeDemoSession,
  encodeDemoSession,
  getSecureCookieOptions,
  isDemoToken,
} from './cookies'

export {
  clearSession,
  getSession,
  isAuthenticated,
  login,
  markLoggedIn,
  markLoggedOut,
  saveSession,
  sessionHasRole,
} from './session'

export type {
  AuthContextValue,
  AuthSession,
  AuthUser,
  LoginCredentials,
} from './types'

export { getRoleHomePath } from './types'

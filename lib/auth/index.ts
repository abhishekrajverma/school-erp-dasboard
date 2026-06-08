export {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  SESSION_COOKIE,
  AUTH_STORAGE_KEY,
  getSecureCookieOptions,
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

export { getRoleFromJwt, decodeJwtPayload } from './jwt'

export type {
  Park,
  Enterprise,
  Building,
  ParkType,
  ParkStatus,
  EnterpriseScale,
  EnterpriseStatus,
  BuildingUsage,
  PageResult,
  EnterpriseQuery,
  BuildingQuery,
  ParkOverview,
} from './types.js'
export { parks, enterprises, buildings, mockMeta } from './data.js'
export { getById, filterByParkId, searchByFields, paginate, mockQuery } from './helpers.js'
export { queryEnterprises, queryBuildings, getParkOverview } from './query.js'
export type {
  MockRole,
  MockUser,
  DemoCredential,
  AuthSession,
  LoginOptions,
  AuthMockErrorCode,
} from './auth.js'
export {
  AUTH_SESSION_KEY,
  AUTH_REMEMBER_KEY,
  AuthMockError,
  demoAccounts,
  demoCredentials,
  login,
  logout,
  getSession,
  getCurrentUser,
  isAuthenticated,
  getRememberedUsername,
} from './auth.js'

import { buildings, enterprises, parks } from './data.js'

export const parkMasterData = {
  parks,
  enterprises,
  buildings,
} as const

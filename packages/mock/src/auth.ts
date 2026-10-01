import { mockQuery } from './helpers.js'

/** 会话写入 localStorage 的键。没有 localStorage 时退回内存，方便脚本里调用。 */
export const AUTH_SESSION_KEY = 'park-auth-session'
/** 记住账号只存用户名，不存密码。 */
export const AUTH_REMEMBER_KEY = 'park-auth-remember'

const SESSION_TTL_MS = 12 * 60 * 60 * 1000

export type MockRole = 'admin' | 'operator'

export interface MockUser {
  id: string
  username: string
  displayName: string
  role: MockRole
  /** 界面上展示的中文角色名 */
  roleLabel: string
  orgName: string
  title: string
}

export interface DemoCredential {
  username: string
  password: string
  roleLabel: string
  displayName: string
}

export interface AuthSession {
  token: string
  user: MockUser
  remember: boolean
  issuedAt: string
  expiresAt: string
}

export interface LoginOptions {
  /** 勾选后把用户名写入 localStorage，退出登录不会清掉。 */
  remember?: boolean
  /** 模拟耗时，默认 320ms。测试可传 0。 */
  delayMs?: number
}

export type AuthMockErrorCode = 'EMPTY_CREDENTIALS' | 'INVALID_CREDENTIALS'

export class AuthMockError extends Error {
  readonly code: AuthMockErrorCode

  constructor(code: AuthMockErrorCode, message: string) {
    super(message)
    this.name = 'AuthMockError'
    this.code = code
  }
}

interface DemoAccount extends MockUser {
  password: string
}

const accounts: readonly DemoAccount[] = [
  {
    id: 'user-admin',
    username: 'admin',
    password: 'admin123',
    displayName: '陈启明',
    role: 'admin',
    roleLabel: '园区管理员',
    orgName: '滨江云栖科创园',
    title: '园区管理员',
  },
  {
    id: 'user-operator',
    username: 'operator',
    password: 'operator123',
    displayName: '林知夏',
    role: 'operator',
    roleLabel: '园区运营',
    orgName: '滨江云栖科创园',
    title: '运营专员',
  },
]

/** 不含密码，可直接拿去渲染身份。 */
export const demoAccounts: readonly MockUser[] = accounts.map((account) => toPublicUser(account))

/** 原型演示口令。只存在于前端源码，不能当作真实鉴权。 */
export const demoCredentials: readonly DemoCredential[] = accounts.map((account) => ({
  username: account.username,
  password: account.password,
  roleLabel: account.roleLabel,
  displayName: account.displayName,
}))

const memoryStore = new Map<string, string>()

function storage(): Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> {
  try {
    const store = globalThis.localStorage
    if (!store || typeof store.getItem !== 'function') return memoryAdapter()
    const probe = '__park_auth_probe__'
    store.setItem(probe, '1')
    store.removeItem(probe)
    return store
  } catch {
    return memoryAdapter()
  }
}

function memoryAdapter(): Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> {
  return {
    getItem: (key) => memoryStore.get(key) ?? null,
    setItem: (key, value) => {
      memoryStore.set(key, value)
    },
    removeItem: (key) => {
      memoryStore.delete(key)
    },
  }
}

function toPublicUser(account: DemoAccount): MockUser {
  return {
    id: account.id,
    username: account.username,
    displayName: account.displayName,
    role: account.role,
    roleLabel: account.roleLabel,
    orgName: account.orgName,
    title: account.title,
  }
}

function createToken(username: string): string {
  const bytes = new Uint8Array(12)
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(bytes)
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256)
    }
  }
  const entropy = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `park-demo.${username}.${entropy}`
}

function isSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== 'object') return false
  const session = value as Partial<AuthSession>
  return (
    typeof session.token === 'string' &&
    typeof session.issuedAt === 'string' &&
    typeof session.expiresAt === 'string' &&
    typeof session.remember === 'boolean' &&
    !!session.user &&
    typeof session.user.username === 'string' &&
    typeof session.user.roleLabel === 'string'
  )
}

function readSession(): AuthSession | null {
  const raw = storage().getItem(AUTH_SESSION_KEY)
  if (!raw) return null
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!isSession(parsed)) {
      storage().removeItem(AUTH_SESSION_KEY)
      return null
    }
    if (Date.parse(parsed.expiresAt) <= Date.now()) {
      storage().removeItem(AUTH_SESSION_KEY)
      return null
    }
    return parsed
  } catch {
    storage().removeItem(AUTH_SESSION_KEY)
    return null
  }
}

function writeSession(session: AuthSession): void {
  storage().setItem(AUTH_SESSION_KEY, JSON.stringify(session))
}

/**
 * 演示账号登录。`admin` / `admin123` 为园区管理员，`operator` / `operator123` 为园区运营。
 * 成功后把会话写入 localStorage，刷新后仍可取回。
 */
export async function login(
  username: string,
  password: string,
  options: LoginOptions = {},
): Promise<AuthSession> {
  const name = username.trim()
  const secret = password
  const delayMs = options.delayMs ?? 320
  if (!name || !secret.trim()) {
    await mockQuery(null, delayMs)
    throw new AuthMockError('EMPTY_CREDENTIALS', '请输入账号和密码')
  }
  const account = accounts.find((item) => item.username === name && item.password === secret)
  await mockQuery(null, delayMs)
  if (!account) {
    throw new AuthMockError('INVALID_CREDENTIALS', '账号或密码不正确')
  }

  const remember = options.remember ?? false
  const issuedAt = new Date()
  const session: AuthSession = {
    token: createToken(account.username),
    user: toPublicUser(account),
    remember,
    issuedAt: issuedAt.toISOString(),
    expiresAt: new Date(issuedAt.getTime() + SESSION_TTL_MS).toISOString(),
  }
  writeSession(session)
  if (remember) {
    storage().setItem(AUTH_REMEMBER_KEY, name)
  } else {
    storage().removeItem(AUTH_REMEMBER_KEY)
  }
  return session
}

/** 清除会话。已记住的用户名会保留，方便下次填入。 */
export function logout(): void {
  storage().removeItem(AUTH_SESSION_KEY)
}

export function getSession(): AuthSession | null {
  return readSession()
}

export function getCurrentUser(): MockUser | null {
  return readSession()?.user ?? null
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

export function getRememberedUsername(): string | null {
  const value = storage().getItem(AUTH_REMEMBER_KEY)?.trim()
  return value ? value : null
}

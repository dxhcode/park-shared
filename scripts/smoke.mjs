import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import {
  AuthMockError,
  demoCredentials,
  getCurrentUser,
  getRememberedUsername,
  getParkOverview,
  getWorkOrder,
  isAuthenticated,
  login,
  logout,
  paginate,
  parks,
  queryEnterprises,
  queryNotices,
  queryVisits,
  queryWorkOrders,
} from '../packages/mock/dist/index.js'
import { adminAntdTheme, applyParkTheme, parkMotion, screenAntdTheme } from '../packages/theme/dist/index.js'
import {
  AdminLayout,
  AppLogo,
  DetailPageShell,
  DetailSection,
  EmptyState,
  FormPageShell,
  GlassCard,
  KpiStat,
  ListMotion,
  ListPageShell,
  LoginForm,
  LoginPage,
  PageHeader,
  RouteMotion,
  ScreenLayout,
} from '../packages/components/dist/index.js'

assert.equal(parks.length, 3)
assert.equal(parks[0]?.name, '滨江云栖科创园')

const page = queryEnterprises({ parkId: 'park-binjiang', page: 1, pageSize: 2 })
assert.ok(page.total >= 2)
assert.equal(page.items.length, 2)
assert.equal(page.items.every((item) => item.parkId === 'park-binjiang'), true)

const overview = getParkOverview('park-binjiang')
assert.ok(overview)
assert.equal(overview.buildingCount, 2)
assert.equal(getParkOverview('missing'), undefined)
assert.equal(paginate([], 1, 10).total, 0)

const searched = queryEnterprises({ keyword: '星澜' })
assert.equal(searched.total, 1)
assert.equal(searched.items[0]?.id, 'ent-xinglan')

assert.equal(adminAntdTheme.token?.colorPrimary, '#1d39c4')
assert.equal(screenAntdTheme.token?.colorPrimary, '#22d3ee')
assert.equal(typeof applyParkTheme, 'function')
applyParkTheme('screen')

for (const component of [
  AppLogo,
  PageHeader,
  GlassCard,
  EmptyState,
  KpiStat,
  LoginForm,
  LoginPage,
  AdminLayout,
  ScreenLayout,
  ListPageShell,
  DetailPageShell,
  DetailSection,
  FormPageShell,
  RouteMotion,
  ListMotion,
]) {
  assert.equal(typeof component, 'object')
  assert.ok(component)
}

const orders = queryWorkOrders({ parkId: 'park-binjiang', page: 1, pageSize: 2 })
assert.equal(orders.items.length, 2)
assert.ok(orders.total > 2)
assert.equal(orders.items.every((item) => item.parkId === 'park-binjiang'), true)
assert.equal(queryWorkOrders({ keyword: '不存在的工单标题' }).total, 0)
assert.equal(getWorkOrder('wo-bj-ac')?.title.includes('空调'), true)
assert.equal(getWorkOrder('missing'), undefined)
assert.ok(queryNotices({ keyword: '门禁' }).total >= 1)
assert.ok(queryVisits({ status: '待审核' }).total >= 1)
assert.equal(parkMotion.routeFade, 'park-route-fade')
assert.equal(parkMotion.routeSlide, 'park-route-slide')
assert.equal(parkMotion.list, 'park-list')
assert.equal(parkMotion.menuPulse, 'park-menu-pulse')
assert.equal(parkMotion.row, 'park-row')

assert.equal(demoCredentials.length, 2)
assert.equal(demoCredentials[0]?.roleLabel, '园区管理员')
assert.equal(demoCredentials[1]?.roleLabel, '园区运营')

const session = await login('admin', 'admin123', { remember: true, delayMs: 0 })
assert.equal(session.user.displayName, '陈启明')
assert.equal(session.user.roleLabel, '园区管理员')
assert.equal(session.token.startsWith('park-demo.admin.'), true)
assert.equal(isAuthenticated(), true)
assert.equal(getCurrentUser()?.username, 'admin')
assert.equal(getRememberedUsername(), 'admin')
logout()
assert.equal(isAuthenticated(), false)
assert.equal(getCurrentUser(), null)
assert.equal(getRememberedUsername(), 'admin')

const operator = await login('operator', 'operator123', { remember: false, delayMs: 0 })
assert.equal(operator.user.roleLabel, '园区运营')
assert.equal(getRememberedUsername(), null)
logout()

await assert.rejects(() => login('admin', 'wrong-password', { delayMs: 0 }), (error) => {
  assert.equal(error instanceof AuthMockError, true)
  assert.equal(error.message, '账号或密码不正确')
  return true
})
await assert.rejects(() => login('  ', '', { delayMs: 0 }), (error) => {
  assert.equal(error instanceof AuthMockError, true)
  assert.equal(error.message, '请输入账号和密码')
  return true
})
assert.equal(isAuthenticated(), false)

assert.equal(existsSync(new URL('../packages/theme/src/theme.css', import.meta.url)), true)
assert.equal(existsSync(new URL('../packages/theme/src/motion.css', import.meta.url)), true)
const motionCss = readFileSync(new URL('../packages/theme/src/motion.css', import.meta.url), 'utf8')
assert.match(motionCss, /\.park-route-fade-enter-active/)
assert.match(motionCss, /\.park-route-slide-enter-from/)
assert.match(motionCss, /\.park-list-enter-active/)
assert.match(motionCss, /\.park-menu-pulse/)
assert.match(motionCss, /\.park-row/)
const componentCss = readFileSync(new URL('../packages/components/dist/style.css', import.meta.url), 'utf8')
assert.match(componentCss, /\.park-route-fade-enter-active/)
assert.match(componentCss, /\.park-empty/)
assert.equal(existsSync(new URL('../packages/components/dist/style.css', import.meta.url)), true)

console.log('smoke ok')

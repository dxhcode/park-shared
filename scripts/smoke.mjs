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
  buildDemoHash,
  buildDemoSearch,
  getChartSeries,
  getParkDashboard,
  mapMarkers,
  parseDemoHash,
  parseDemoSearch,
  queryAlertTicker,
  queryChartSeries,
  queryDashboardKpis,
  queryEnterprises,
  queryNotices,
  queryVisits,
  queryWorkOrders,
} from '../packages/mock/dist/index.js'
import {
  adminAntdTheme,
  applyParkTheme,
  parkMotion,
  screenAntdTheme,
  screenBarOption,
  screenLineOption,
  screenPieOption,
} from '../packages/theme/dist/index.js'
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
  ChartPanel,
  KpiTicker,
  ListPageShell,
  LoginForm,
  LoginPage,
  MapPanel,
  PageHeader,
  RouteMotion,
  ScreenChart,
  ScreenKpi,
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
  KpiTicker,
  ScreenKpi,
  ChartPanel,
  ScreenChart,
  MapPanel,
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
assert.match(componentCss, /\.park-ticker/)
assert.match(componentCss, /\.park-screen-kpi/)
assert.match(componentCss, /\.park-chart-panel/)
assert.match(componentCss, /\.park-screen-chart/)
assert.match(componentCss, /\.park-map__pin/)
assert.equal(existsSync(new URL('../packages/components/dist/style.css', import.meta.url)), true)

for (const parkId of ['park-binjiang', 'park-lingang', 'park-guanggu']) {
  const board = getParkDashboard(parkId)
  const parkOverview = getParkOverview(parkId)
  assert.ok(board)
  assert.ok(parkOverview)
  assert.equal(board.kpis.find((item) => item.code === 'settled')?.value, parkOverview.settledCount)
  assert.equal(
    board.kpis.find((item) => item.code === 'occupancy')?.value,
    Math.round(parkOverview.occupancyAvg * 1000) / 10,
  )
  const openOrders = queryWorkOrders({ parkId, page: 1, pageSize: 50 }).items.filter(
    (item) => item.status === '待处理' || item.status === '处理中',
  )
  assert.equal(board.kpis.find((item) => item.code === 'openAlerts')?.value, openOrders.length)
  const todayVisits = queryVisits({ parkId, page: 1, pageSize: 20 }).items.filter(
    (item) => item.visitDate === '2026-10-04',
  )
  assert.equal(board.kpis.find((item) => item.code === 'appointments')?.value, todayVisits.length)
  const industry = board.charts.find((item) => item.metric === '产业')
  assert.ok(industry)
  const activeEnterprises = queryEnterprises({ parkId, page: 1, pageSize: 20 }).items.filter(
    (item) => item.status !== '已迁出',
  )
  for (const enterprise of activeEnterprises) {
    const index = industry.categories.indexOf(enterprise.industry)
    assert.ok(index >= 0)
    assert.equal(industry.series[0]?.data[index], enterprise.employeeCount)
  }
  assert.equal(queryChartSeries({ parkId, metric: '能耗' }).length, 1)
  assert.ok(queryChartSeries({ parkId, metric: '人流' })[0]?.categories.length >= 8)
}

assert.equal(getParkDashboard('missing'), undefined)
assert.equal(queryDashboardKpis({ parkId: 'park-binjiang', code: 'settled' }).length, 1)
assert.equal(queryAlertTicker({ parkId: 'missing-park' }).length, 0)
const doorAlert = queryAlertTicker({ parkId: 'park-binjiang', level: '告警' }).find(
  (item) => item.sourceId === 'wo-bj-door',
)
assert.equal(doorAlert?.title, getWorkOrder('wo-bj-door')?.title)
assert.equal(doorAlert?.location, getWorkOrder('wo-bj-door')?.location)
assert.equal(getChartSeries('chart-bj-energy')?.unit, 'kWh')
assert.equal(getChartSeries('missing'), undefined)
assert.equal(mapMarkers.length, 3)
assert.equal(
  mapMarkers.map((item) => item.name).join(','),
  '光谷生命科学园,滨江云栖科创园,临港智造产业园',
)

const line = screenLineOption(['周一'], [{ name: '用电', data: [1, 2] }])
assert.equal(line.backgroundColor, 'transparent')
assert.equal(line.series[0]?.type, 'line')
assert.equal(line.color.includes('#22d3ee'), true)
const bar = screenBarOption(['人工智能'], [{ name: '人数', data: [186] }])
assert.equal(bar.series[0]?.type, 'bar')
assert.equal(bar.xAxis.data[0], '人工智能')
const pie = screenPieOption([{ name: '人工智能', value: 186 }])
assert.equal(pie.series[0]?.type, 'pie')
assert.equal(pie.series[0]?.data[0]?.value, 186)

const search = buildDemoSearch({ view: 'screen', parkId: 'park-binjiang' }, '?extra=1')
assert.equal(search.includes('view=screen'), true)
assert.equal(search.includes('park=park-binjiang'), true)
assert.equal(search.includes('extra=1'), true)
assert.equal(parseDemoSearch(search).view, 'screen')
assert.equal(parseDemoSearch(search).parkId, 'park-binjiang')
assert.equal(buildDemoSearch({ focus: '' }, search).includes('focus='), false)
const hash = buildDemoHash({ view: 'screen', parkId: 'park-lingang', focus: 'map' })
assert.equal(hash, '#screen/park-lingang/map')
assert.equal(parseDemoHash(hash).focus, 'map')
assert.equal(parseDemoHash(hash).parkId, 'park-lingang')
assert.equal(parseDemoHash('#view=screen&park=park-guanggu').parkId, 'park-guanggu')
assert.equal(parseDemoHash('').view, undefined)

console.log('smoke ok')

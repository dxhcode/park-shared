import { buildings, enterprises, parks } from './data.js'
import { notices, visits, workOrders } from './fixtures.js'
import { getById } from './helpers.js'
import type {
  AlertLevel,
  AlertTickerItem,
  AlertTickerQuery,
  ChartSeriesQuery,
  ChartSeriesSample,
  DashboardKpi,
  DashboardKpiCode,
  DashboardKpiQuery,
  Notice,
  ParkDashboard,
  ParkMapMarker,
  WorkOrder,
} from './types.js'

const shortId: Record<string, string> = {
  'park-binjiang': 'bj',
  'park-lingang': 'lg',
  'park-guanggu': 'gg',
}

const days = ['09-28', '09-29', '09-30', '10-01', '10-02', '10-03', '10-04']
const hours = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17']
const months = ['5月', '6月', '7月', '8月', '9月', '10月']

function codeOf(parkId: string) {
  return shortId[parkId] ?? parkId
}

function settledCount(parkId: string) {
  return enterprises.filter((item) => item.parkId === parkId && item.status === '在园').length
}

function occupancyPercent(parkId: string) {
  const rows = buildings.filter((item) => item.parkId === parkId)
  if (!rows.length) return 0
  const avg = rows.reduce((sum, item) => sum + item.occupancyRate, 0) / rows.length
  return Math.round(avg * 1000) / 10
}

function openAlertCount(parkId: string) {
  return workOrders.filter(
    (item) => item.parkId === parkId && (item.status === '待处理' || item.status === '处理中'),
  ).length
}

function appointmentCount(parkId: string) {
  return visits.filter((item) => item.parkId === parkId && item.visitDate === '2026-10-04').length
}

function kpi(
  parkId: string,
  code: DashboardKpiCode,
  label: string,
  value: number,
  unit: string,
  trend?: number,
  hint?: string,
): DashboardKpi {
  return { id: `kpi-${codeOf(parkId)}-${code}`, parkId, code, label, value, unit, trend, hint }
}

function industryChart(parkId: string): ChartSeriesSample {
  const rows = enterprises.filter((item) => item.parkId === parkId && item.status !== '已迁出')
  return {
    id: `chart-${codeOf(parkId)}-industry`,
    parkId,
    metric: '产业',
    name: '产业从业人数',
    unit: '人',
    categories: rows.map((item) => item.industry),
    series: [{ name: '从业人数', data: rows.map((item) => item.employeeCount) }],
  }
}

function mustOrder(id: string): WorkOrder {
  const row = workOrders.find((item) => item.id === id)
  if (!row) throw new Error(`未找到工单 ${id}`)
  return row
}

function mustNotice(id: string): Notice {
  const row = notices.find((item) => item.id === id)
  if (!row) throw new Error(`未找到公告 ${id}`)
  return row
}

function fromOrder(parkId: string, level: AlertLevel, time: string, sourceId: string): AlertTickerItem {
  const row = mustOrder(sourceId)
  return {
    id: `alt-${sourceId}`,
    parkId,
    level,
    title: row.title,
    location: row.location,
    time,
    sourceId,
  }
}

function fromNotice(
  parkId: string,
  level: AlertLevel,
  time: string,
  sourceId: string,
  location: string,
): AlertTickerItem {
  const row = mustNotice(sourceId)
  return {
    id: `alt-${sourceId}`,
    parkId,
    level,
    title: row.title,
    location,
    time,
    sourceId,
  }
}

/** 在园企业、入驻率、未关闭告警、当日预约与主数据对齐；在岗与负荷为原型运营数。 */
export const dashboardKpis: DashboardKpi[] = [
  kpi('park-binjiang', 'settled', '在园企业', settledCount('park-binjiang'), '家', 4.2, '较上月'),
  kpi('park-binjiang', 'occupancy', '平均入驻率', occupancyPercent('park-binjiang'), '%', 1.6, 'A1 / B2'),
  kpi('park-binjiang', 'onsite', '在岗人数', 214, '人', 3.1, '今日在园'),
  kpi('park-binjiang', 'energyLoad', '能耗负荷', 62.4, '%', -2.4, '相对额定'),
  kpi('park-binjiang', 'appointments', '今日预约', appointmentCount('park-binjiang'), '人次', undefined, '2026-10-04'),
  kpi('park-binjiang', 'openAlerts', '未关闭告警', openAlertCount('park-binjiang'), '条', undefined, '待处理与处理中'),
  kpi('park-lingang', 'settled', '在园企业', settledCount('park-lingang'), '家', 2.1, '较上月'),
  kpi('park-lingang', 'occupancy', '平均入驻率', occupancyPercent('park-lingang'), '%', 0.8, 'M1 / M2'),
  kpi('park-lingang', 'onsite', '在岗人数', 736, '人', 1.4, '两班在岗'),
  kpi('park-lingang', 'energyLoad', '能耗负荷', 81.2, '%', 2.6, '相对额定'),
  kpi('park-lingang', 'appointments', '今日预约', appointmentCount('park-lingang'), '人次', undefined, '2026-10-04'),
  kpi('park-lingang', 'openAlerts', '未关闭告警', openAlertCount('park-lingang'), '条', undefined, '待处理与处理中'),
  kpi('park-guanggu', 'settled', '在园企业', settledCount('park-guanggu'), '家', 0, '建设期'),
  kpi('park-guanggu', 'occupancy', '平均入驻率', occupancyPercent('park-guanggu'), '%', -1.2, 'C1 / C2'),
  kpi('park-guanggu', 'onsite', '在岗人数', 98, '人', -0.6, '中试值班'),
  kpi('park-guanggu', 'energyLoad', '能耗负荷', 44.6, '%', -3.4, '相对额定'),
  kpi('park-guanggu', 'appointments', '今日预约', appointmentCount('park-guanggu'), '人次', undefined, '2026-10-04'),
  kpi('park-guanggu', 'openAlerts', '未关闭告警', openAlertCount('park-guanggu'), '条', undefined, '待处理与处理中'),
]

/** 文案取自公告与工单，时间是 2026-10-04 的原型时刻。 */
export const alertTickerItems: AlertTickerItem[] = [
  fromOrder('park-binjiang', '告警', '10:12', 'wo-bj-door'),
  fromOrder('park-binjiang', '预警', '09:40', 'wo-bj-ac'),
  fromOrder('park-binjiang', '提示', '08:55', 'wo-bj-screen'),
  fromOrder('park-binjiang', '提示', '08:20', 'wo-bj-fiber'),
  fromNotice('park-binjiang', '预警', '08:00', 'ntc-bj-gate', '北门'),
  fromOrder('park-lingang', '告警', '10:05', 'wo-lg-fire'),
  fromNotice('park-lingang', '预警', '08:10', 'ntc-lg-safe', 'M1 智能厂房'),
  fromOrder('park-guanggu', '告警', '09:20', 'wo-gg-lab'),
  fromNotice('park-guanggu', '告警', '09:00', 'ntc-gg-water', 'C2 中试楼'),
  fromOrder('park-guanggu', '预警', '08:30', 'wo-gg-leak'),
]

/**
 * 能耗、人流、产值为虚构运行曲线。
 * 10-03、10-04 是周末，科创园用电下调。产业人数直接来自企业主数据（不含已迁出）。
 */
export const chartSeries: ChartSeriesSample[] = [
  {
    id: 'chart-bj-energy',
    parkId: 'park-binjiang',
    metric: '能耗',
    name: '近七日能耗',
    unit: 'kWh',
    categories: days,
    series: [{ name: '用电量', data: [14200, 14880, 15120, 13640, 13210, 9800, 8640] }],
  },
  {
    id: 'chart-bj-flow',
    parkId: 'park-binjiang',
    metric: '人流',
    name: '今日人流',
    unit: '人次',
    categories: hours,
    series: [
      { name: '入园', data: [42, 86, 64, 28, 18, 22, 16, 12, 9, 6] },
      { name: '出园', data: [4, 6, 8, 12, 38, 16, 14, 22, 48, 72] },
    ],
  },
  {
    id: 'chart-bj-output',
    parkId: 'park-binjiang',
    metric: '产值',
    name: '近六月产值',
    unit: '万元',
    categories: months,
    series: [{ name: '产值', data: [1860, 1920, 2040, 1980, 2160, 2280] }],
  },
  industryChart('park-binjiang'),
  {
    id: 'chart-lg-energy',
    parkId: 'park-lingang',
    metric: '能耗',
    name: '近七日能耗',
    unit: 'kWh',
    categories: days,
    series: [{ name: '用电量', data: [31200, 32840, 33410, 30120, 29660, 27440, 25110] }],
  },
  {
    id: 'chart-lg-flow',
    parkId: 'park-lingang',
    metric: '人流',
    name: '今日人流',
    unit: '人次',
    categories: hours,
    series: [
      { name: '入园', data: [120, 210, 90, 40, 24, 36, 20, 18, 12, 8] },
      { name: '出园', data: [8, 10, 14, 22, 80, 28, 24, 40, 130, 180] },
    ],
  },
  {
    id: 'chart-lg-output',
    parkId: 'park-lingang',
    metric: '产值',
    name: '近六月产值',
    unit: '万元',
    categories: months,
    series: [{ name: '产值', data: [6420, 6680, 7010, 6840, 7320, 7560] }],
  },
  industryChart('park-lingang'),
  {
    id: 'chart-gg-energy',
    parkId: 'park-guanggu',
    metric: '能耗',
    name: '近七日能耗',
    unit: 'kWh',
    categories: days,
    series: [{ name: '用电量', data: [8640, 9120, 9480, 8900, 8720, 6430, 5980] }],
  },
  {
    id: 'chart-gg-flow',
    parkId: 'park-guanggu',
    metric: '人流',
    name: '今日人流',
    unit: '人次',
    categories: hours,
    series: [
      { name: '入园', data: [18, 36, 22, 12, 8, 10, 6, 5, 4, 3] },
      { name: '出园', data: [2, 3, 4, 6, 14, 8, 6, 10, 20, 28] },
    ],
  },
  {
    id: 'chart-gg-output',
    parkId: 'park-guanggu',
    metric: '产值',
    name: '近六月产值',
    unit: '万元',
    categories: months,
    series: [{ name: '产值', data: [980, 1040, 1120, 1080, 1210, 1260] }],
  },
  industryChart('park-guanggu'),
]

function mapMarker(parkId: string, x: number, y: number): ParkMapMarker {
  const park = parks.find((item) => item.id === parkId)
  if (!park) throw new Error(`未找到园区 ${parkId}`)
  return {
    id: park.id,
    parkId: park.id,
    name: park.name,
    shortName: park.shortName,
    city: park.city.replace(/市$/, ''),
    x,
    y,
    status: park.status,
  }
}

/** 自西向东：武汉、杭州、上海。坐标只用于示意底图，不是测绘数据。 */
export const mapMarkers: ParkMapMarker[] = [
  mapMarker('park-guanggu', 44, 56),
  mapMarker('park-binjiang', 70, 63),
  mapMarker('park-lingang', 78, 44),
]

export function queryDashboardKpis(query: DashboardKpiQuery = {}): DashboardKpi[] {
  return dashboardKpis.filter((item) => {
    if (query.parkId && item.parkId !== query.parkId) return false
    if (query.code && item.code !== query.code) return false
    return true
  })
}

export function queryAlertTicker(query: AlertTickerQuery = {}): AlertTickerItem[] {
  return alertTickerItems.filter((item) => {
    if (query.parkId && item.parkId !== query.parkId) return false
    if (query.level && item.level !== query.level) return false
    return true
  })
}

export function queryChartSeries(query: ChartSeriesQuery = {}): ChartSeriesSample[] {
  return chartSeries.filter((item) => {
    if (query.parkId && item.parkId !== query.parkId) return false
    if (query.metric && item.metric !== query.metric) return false
    return true
  })
}

export function getChartSeries(id: string): ChartSeriesSample | undefined {
  return chartSeries.find((item) => item.id === id)
}

export function getParkDashboard(parkId: string): ParkDashboard | undefined {
  const park = getById(parks, parkId)
  if (!park) return undefined
  return {
    park,
    kpis: queryDashboardKpis({ parkId }),
    alerts: queryAlertTicker({ parkId }),
    charts: queryChartSeries({ parkId }),
    marker: mapMarkers.find((item) => item.parkId === parkId),
  }
}

export const dashboardFixtures = {
  kpis: dashboardKpis,
  alerts: alertTickerItems,
  charts: chartSeries,
  markers: mapMarkers,
} as const

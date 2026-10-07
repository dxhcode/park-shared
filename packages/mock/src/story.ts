import { getParkDashboard } from './dashboard.js'
import { buildings, enterprises, parks } from './data.js'
import { notices, visits, workOrders } from './fixtures.js'
import { filterByParkId } from './helpers.js'
import { buildDemoHash, buildDemoSearch, type DemoLink } from './link.js'
import type { Building, Enterprise, Notice, Park, ParkDashboard, Visit, WorkOrder } from './types.js'

export type DemoPlatform = 'industry' | 'campus' | 'gov' | 'shared'
export type DemoSurface = 'login' | 'admin' | 'screen'

export interface DemoPlatformProfile {
  id: Exclude<DemoPlatform, 'shared'>
  repo: string
  title: string
  summary: string
}

export interface DemoBeat {
  id: string
  order: number
  platform: DemoPlatform
  surface: DemoSurface
  title: string
  /** 给讲解的一句话。 */
  cue: string
  parkId: string
  /** 建议的视图名。平台映射到自己的路由，共享预览页只认识 auth / gallery / shells / screen。 */
  view: string
  focus?: string
  /** 讲解时建议打开的模拟记录。 */
  recordId?: string
  /** 这一拍建议读取的 @park/mock 导出。 */
  fixtures: readonly string[]
}

export interface DemoParkSnapshot {
  park: Park
  enterprises: Enterprise[]
  buildings: Building[]
  notices: Notice[]
  workOrders: WorkOrder[]
  visits: Visit[]
  dashboard: ParkDashboard
}

/** 三端仓库各自讲哪一块。登录拍属于 shared，三端演示都从它开始。 */
export const demoPlatforms: readonly DemoPlatformProfile[] = [
  {
    id: 'industry',
    repo: 'park-industry',
    title: '产业服务',
    summary: '在园企业、入园申请，以及产值和产业构成。',
  },
  {
    id: 'campus',
    repo: 'park-campus',
    title: '园区运营',
    summary: '工单、来访、公告，以及能耗和告警。',
  },
  {
    id: 'gov',
    repo: 'park-gov',
    title: '园区治理',
    summary: '三园对照、示意地图，以及未关闭告警。',
  },
]

/**
 * 一条可讲完的原型路线。记录都指向现有模拟数据，不另造一套数。
 * 日期口径是 2026-10-04。
 */
export const demoBeats: readonly DemoBeat[] = [
  {
    id: 'login-admin',
    order: 1,
    platform: 'shared',
    surface: 'login',
    title: '管理员进入工作台',
    cue: '用陈启明的账号 admin / admin123 登录，勾选记住账号。',
    parkId: 'park-binjiang',
    view: 'auth',
    fixtures: ['demoCredentials', 'login'],
  },
  {
    id: 'industry-enterprises',
    order: 2,
    platform: 'industry',
    surface: 'admin',
    title: '在园企业',
    cue: '滨江云栖只看状态为在园的企业，列表里应有星澜智造和青禾生物。',
    parkId: 'park-binjiang',
    view: 'enterprises',
    focus: 'list',
    fixtures: ['queryEnterprises'],
  },
  {
    id: 'industry-detail',
    order: 3,
    platform: 'industry',
    surface: 'admin',
    title: '星澜智造详情',
    cue: '打开星澜智造科技有限公司，产业是人工智能，186 人，联系人沈予安。',
    parkId: 'park-binjiang',
    view: 'enterprise',
    focus: 'detail',
    recordId: 'ent-xinglan',
    fixtures: ['enterprises', 'getById'],
  },
  {
    id: 'industry-form',
    order: 4,
    platform: 'industry',
    surface: 'admin',
    title: '入园申请',
    cue: '表单壳只做填写示意，提交不会写回模拟数据。',
    parkId: 'park-binjiang',
    view: 'enterprise-form',
    focus: 'form',
    fixtures: ['parks', 'buildings'],
  },
  {
    id: 'industry-screen',
    order: 5,
    platform: 'industry',
    surface: 'screen',
    title: '产值与产业',
    cue: '大屏切到滨江，看近六月产值和产业从业人数。人工智能对应星澜的 186 人。',
    parkId: 'park-binjiang',
    view: 'screen',
    focus: 'industry',
    fixtures: ['getParkDashboard', 'queryChartSeries'],
  },
  {
    id: 'campus-orders',
    order: 6,
    platform: 'campus',
    surface: 'admin',
    title: '服务工单',
    cue: '滨江工单里，A1 研发楼空调异响仍在处理中。',
    parkId: 'park-binjiang',
    view: 'work-orders',
    focus: 'list',
    recordId: 'wo-bj-ac',
    fixtures: ['queryWorkOrders'],
  },
  {
    id: 'campus-order-detail',
    order: 7,
    platform: 'campus',
    surface: 'admin',
    title: '空调工单详情',
    cue: '处理人是周衡，位置在 A1 研发楼。',
    parkId: 'park-binjiang',
    view: 'work-order',
    focus: 'detail',
    recordId: 'wo-bj-ac',
    fixtures: ['getWorkOrder'],
  },
  {
    id: 'campus-visits',
    order: 8,
    platform: 'campus',
    surface: 'admin',
    title: '来访预约',
    cue: '看来访列表。今日预约指标只统计 2026-10-04。',
    parkId: 'park-binjiang',
    view: 'visits',
    focus: 'list',
    fixtures: ['queryVisits'],
  },
  {
    id: 'campus-notices',
    order: 9,
    platform: 'campus',
    surface: 'admin',
    title: '门禁公告',
    cue: '打开「国庆期间门禁与访客安排」，发布人是陈启明。',
    parkId: 'park-binjiang',
    view: 'notices',
    focus: 'detail',
    recordId: 'ntc-bj-gate',
    fixtures: ['queryNotices', 'getNotice'],
  },
  {
    id: 'campus-screen',
    order: 10,
    platform: 'campus',
    surface: 'screen',
    title: '能耗与告警',
    cue: '跑马灯里的门禁告警指向工单「B2 实验楼门禁无法识别」。',
    parkId: 'park-binjiang',
    view: 'screen',
    focus: 'energy',
    recordId: 'wo-bj-door',
    fixtures: ['queryAlertTicker', 'queryChartSeries'],
  },
  {
    id: 'gov-overview',
    order: 11,
    platform: 'gov',
    surface: 'admin',
    title: '三园对照',
    cue: '光谷生命科学园仍是建设中，适合讲空态和较低的入驻率。',
    parkId: 'park-guanggu',
    view: 'parks',
    focus: 'list',
    fixtures: ['parks', 'getParkOverview'],
  },
  {
    id: 'gov-map',
    order: 12,
    platform: 'gov',
    surface: 'screen',
    title: '示意地图',
    cue: '从武汉光谷切到上海临港。坐标是示意位置，不是测绘地图。',
    parkId: 'park-lingang',
    view: 'screen',
    focus: 'map',
    fixtures: ['mapMarkers', 'getParkDashboard'],
  },
  {
    id: 'gov-alerts',
    order: 13,
    platform: 'gov',
    surface: 'screen',
    title: '未关闭告警',
    cue: '临港未关闭告警条数应等于待处理与处理中的工单数。',
    parkId: 'park-lingang',
    view: 'screen',
    focus: 'alerts',
    fixtures: ['queryDashboardKpis', 'queryWorkOrders'],
  },
]

export const demoStory = {
  platforms: demoPlatforms,
  beats: demoBeats,
  beatsFor(platform: DemoPlatform): DemoBeat[] {
    return demoBeats.filter((beat) => beat.platform === platform || beat.platform === 'shared')
  },
} as const

/** 同时给出 query 和 hash，方便演示页跳到同一拍。 */
export function demoJump(link: DemoLink, current = ''): { search: string; hash: string } {
  return {
    search: buildDemoSearch(link, current),
    hash: buildDemoHash(link),
  }
}

export function demoBeatJump(
  beat: Pick<DemoBeat, 'view' | 'parkId' | 'focus'>,
  current = '',
): { search: string; hash: string } {
  return demoJump({ view: beat.view, parkId: beat.parkId, focus: beat.focus }, current)
}

/** 某一个园区的主数据、列表和大屏，给单页讲解或故事板用。 */
export function demoParkSnapshot(parkId: string): DemoParkSnapshot | undefined {
  const dashboard = getParkDashboard(parkId)
  if (!dashboard) return undefined
  if (!parks.some((item) => item.id === parkId)) return undefined
  return {
    park: dashboard.park,
    enterprises: filterByParkId(enterprises, parkId),
    buildings: filterByParkId(buildings, parkId),
    notices: filterByParkId(notices, parkId),
    workOrders: filterByParkId(workOrders, parkId),
    visits: filterByParkId(visits, parkId),
    dashboard,
  }
}

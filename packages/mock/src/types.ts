export type ParkType = '科技园' | '产业园' | '综合园'
export type ParkStatus = '运营中' | '建设中'
export type EnterpriseScale = '大型' | '中型' | '小型'
export type EnterpriseStatus = '在园' | '待入驻' | '已迁出'
export type BuildingUsage = '研发' | '生产' | '办公' | '配套'

export interface Park {
  id: string
  name: string
  shortName: string
  code: string
  city: string
  district: string
  address: string
  areaMu: number
  establishedYear: number
  type: ParkType
  status: ParkStatus
  description: string
  manager: string
  phone: string
}

export interface Enterprise {
  id: string
  parkId: string
  buildingId: string
  name: string
  creditCode: string
  industry: string
  scale: EnterpriseScale
  employeeCount: number
  registeredCapital: string
  contact: string
  phone: string
  settledAt: string
  status: EnterpriseStatus
}

export interface Building {
  id: string
  parkId: string
  name: string
  code: string
  floors: number
  areaSqm: number
  usage: BuildingUsage
  occupancyRate: number
}

export interface PageResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  pageCount: number
}

export interface EnterpriseQuery {
  parkId?: string
  buildingId?: string
  keyword?: string
  status?: EnterpriseStatus
  page?: number
  pageSize?: number
}

export interface BuildingQuery {
  parkId?: string
  usage?: BuildingUsage
  keyword?: string
  page?: number
  pageSize?: number
}

export interface ParkOverview {
  park: Park
  enterpriseCount: number
  settledCount: number
  buildingCount: number
  occupancyAvg: number
}

export type NoticeLevel = '普通' | '重要' | '紧急'
export type NoticeStatus = '已发布' | '草稿'

export interface Notice {
  id: string
  parkId: string
  title: string
  category: string
  level: NoticeLevel
  publisher: string
  publishedAt: string
  status: NoticeStatus
  summary: string
}

export type TicketPriority = '低' | '中' | '高'
export type TicketStatus = '待处理' | '处理中' | '已完成' | '已关闭'

export interface WorkOrder {
  id: string
  parkId: string
  title: string
  category: string
  priority: TicketPriority
  status: TicketStatus
  requester: string
  assignee: string
  createdAt: string
  location: string
}

export type VisitStatus = '待审核' | '已通过' | '已到访' | '已取消'

export interface Visit {
  id: string
  parkId: string
  visitor: string
  company: string
  host: string
  purpose: string
  visitDate: string
  status: VisitStatus
  plateNo: string
}

export interface NoticeQuery {
  parkId?: string
  keyword?: string
  status?: NoticeStatus
  level?: NoticeLevel
  page?: number
  pageSize?: number
}

export interface WorkOrderQuery {
  parkId?: string
  keyword?: string
  status?: TicketStatus
  priority?: TicketPriority
  page?: number
  pageSize?: number
}

export interface VisitQuery {
  parkId?: string
  keyword?: string
  status?: VisitStatus
  page?: number
  pageSize?: number
}

export type DashboardKpiCode =
  | 'settled'
  | 'occupancy'
  | 'onsite'
  | 'energyLoad'
  | 'appointments'
  | 'openAlerts'

export interface DashboardKpi {
  id: string
  parkId: string
  code: DashboardKpiCode
  label: string
  value: number
  unit: string
  trend?: number
  hint?: string
}

export type AlertLevel = '提示' | '预警' | '告警'

export interface AlertTickerItem {
  id: string
  parkId: string
  level: AlertLevel
  title: string
  location: string
  time: string
  sourceId?: string
}

export type ChartMetric = '能耗' | '人流' | '产值' | '产业'

export interface ChartPointSeries {
  name: string
  data: number[]
}

export interface ChartSeriesSample {
  id: string
  parkId: string
  metric: ChartMetric
  name: string
  unit: string
  categories: string[]
  series: ChartPointSeries[]
}

export interface ParkMapMarker {
  id: string
  parkId: string
  name: string
  shortName: string
  city: string
  /** 示意底图上的横向位置，0–100。 */
  x: number
  /** 示意底图上的纵向位置，0–100。 */
  y: number
  status: ParkStatus
}

export interface DashboardKpiQuery {
  parkId?: string
  code?: DashboardKpiCode
}

export interface AlertTickerQuery {
  parkId?: string
  level?: AlertLevel
}

export interface ChartSeriesQuery {
  parkId?: string
  metric?: ChartMetric
}

export interface ParkDashboard {
  park: Park
  kpis: DashboardKpi[]
  alerts: AlertTickerItem[]
  charts: ChartSeriesSample[]
  marker?: ParkMapMarker
}

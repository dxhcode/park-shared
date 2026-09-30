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

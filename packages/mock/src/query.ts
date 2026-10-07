import { buildings, enterprises, parks } from './data.js'
import { filterByParkId, getById, paginate, searchByFields } from './helpers.js'
import type { BuildingQuery, EnterpriseQuery, PageResult, ParkOverview, Building, Enterprise } from './types'

export function queryEnterprises(query: EnterpriseQuery = {}): PageResult<Enterprise> {
  let rows = enterprises.slice()
  if (query.parkId) rows = rows.filter((item) => item.parkId === query.parkId)
  if (query.buildingId) rows = rows.filter((item) => item.buildingId === query.buildingId)
  if (query.status) rows = rows.filter((item) => item.status === query.status)
  if (query.keyword) {
    rows = searchByFields(rows, query.keyword, ['name', 'industry', 'creditCode', 'contact'])
  }
  return paginate(rows, query.page ?? 1, query.pageSize ?? 10)
}

export function queryBuildings(query: BuildingQuery = {}): PageResult<Building> {
  let rows = buildings.slice()
  if (query.parkId) rows = rows.filter((item) => item.parkId === query.parkId)
  if (query.usage) rows = rows.filter((item) => item.usage === query.usage)
  if (query.keyword) rows = searchByFields(rows, query.keyword, ['name', 'code', 'usage'])
  return paginate(rows, query.page ?? 1, query.pageSize ?? 10)
}

export function getParkOverview(parkId: string): ParkOverview | undefined {
  const park = getById(parks, parkId)
  if (!park) return undefined
  const parkEnterprises = filterByParkId(enterprises, parkId)
  const parkBuildings = filterByParkId(buildings, parkId)
  const occupancyAvg =
    parkBuildings.length === 0
      ? 0
      : parkBuildings.reduce((sum, item) => sum + item.occupancyRate, 0) / parkBuildings.length
  return {
    park,
    enterpriseCount: parkEnterprises.length,
    settledCount: parkEnterprises.filter((item) => item.status === '在园').length,
    buildingCount: parkBuildings.length,
    occupancyAvg,
  }
}

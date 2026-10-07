import { notices, visits, workOrders } from './fixtures.js'
import { getById, paginate, searchByFields } from './helpers.js'
import type {
  Notice,
  NoticeQuery,
  PageResult,
  Visit,
  VisitQuery,
  WorkOrder,
  WorkOrderQuery,
} from './types'

export function queryNotices(query: NoticeQuery = {}): PageResult<Notice> {
  let rows = notices.slice()
  if (query.parkId) rows = rows.filter((item) => item.parkId === query.parkId)
  if (query.status) rows = rows.filter((item) => item.status === query.status)
  if (query.level) rows = rows.filter((item) => item.level === query.level)
  if (query.keyword) {
    rows = searchByFields(rows, query.keyword, ['title', 'category', 'summary', 'publisher'])
  }
  return paginate(rows, query.page ?? 1, query.pageSize ?? 10)
}

export function queryWorkOrders(query: WorkOrderQuery = {}): PageResult<WorkOrder> {
  let rows = workOrders.slice()
  if (query.parkId) rows = rows.filter((item) => item.parkId === query.parkId)
  if (query.status) rows = rows.filter((item) => item.status === query.status)
  if (query.priority) rows = rows.filter((item) => item.priority === query.priority)
  if (query.keyword) {
    rows = searchByFields(rows, query.keyword, ['title', 'category', 'requester', 'assignee', 'location'])
  }
  return paginate(rows, query.page ?? 1, query.pageSize ?? 10)
}

export function queryVisits(query: VisitQuery = {}): PageResult<Visit> {
  let rows = visits.slice()
  if (query.parkId) rows = rows.filter((item) => item.parkId === query.parkId)
  if (query.status) rows = rows.filter((item) => item.status === query.status)
  if (query.keyword) {
    rows = searchByFields(rows, query.keyword, ['visitor', 'company', 'host', 'purpose', 'plateNo'])
  }
  return paginate(rows, query.page ?? 1, query.pageSize ?? 10)
}

export function getNotice(id: string): Notice | undefined {
  return getById(notices, id)
}

export function getWorkOrder(id: string): WorkOrder | undefined {
  return getById(workOrders, id)
}

export function getVisit(id: string): Visit | undefined {
  return getById(visits, id)
}

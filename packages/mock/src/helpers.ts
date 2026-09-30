import type { PageResult } from './types'

export function getById<T extends { id: string }>(items: readonly T[], id: string): T | undefined {
  return items.find((item) => item.id === id)
}

export function filterByParkId<T extends { parkId: string }>(items: readonly T[], parkId: string): T[] {
  return items.filter((item) => item.parkId === parkId)
}

export function searchByFields<T>(
  items: readonly T[],
  keyword: string,
  fields: readonly (keyof T)[],
): T[] {
  const needle = keyword.trim().toLowerCase()
  if (!needle) return [...items]
  return items.filter((item) =>
    fields.some((field) => String(item[field] ?? '').toLowerCase().includes(needle)),
  )
}

export function paginate<T>(items: readonly T[], page = 1, pageSize = 10): PageResult<T> {
  const size = Math.max(1, Math.floor(pageSize))
  const current = Math.max(1, Math.floor(page))
  const total = items.length
  const pageCount = total === 0 ? 0 : Math.ceil(total / size)
  const start = (current - 1) * size
  return {
    items: items.slice(start, start + size),
    total,
    page: current,
    pageSize: size,
    pageCount,
  }
}

/** 模拟接口延迟，方便页面先接异步数据流。 */
export function mockQuery<T>(data: T, delayMs = 180): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delayMs)
  })
}

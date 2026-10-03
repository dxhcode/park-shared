/** 演示页深链。只读写 query / hash 字符串，不依赖路由库。 */

export interface DemoLink {
  view?: string
  parkId?: string
  focus?: string
}

function stripPrefix(value: string, prefix: string) {
  return value.startsWith(prefix) ? value.slice(prefix.length) : value
}

/** 空字符串会删掉对应参数；未传入的字段保持原样。 */
export function buildDemoSearch(link: DemoLink, current = ''): string {
  const params = new URLSearchParams(stripPrefix(current, '?'))
  assign(params, 'view', link.view)
  assign(params, 'park', link.parkId)
  assign(params, 'focus', link.focus)
  const text = params.toString()
  return text ? `?${text}` : ''
}

export function parseDemoSearch(search: string): DemoLink {
  const params = new URLSearchParams(stripPrefix(search, '?'))
  return {
    view: params.get('view') || undefined,
    parkId: params.get('park') || undefined,
    focus: params.get('focus') || undefined,
  }
}

/** 形如 `#screen/park-binjiang/map`。带等号时按 query 解析。 */
export function buildDemoHash(link: DemoLink): string {
  const parts = [link.view, link.parkId, link.focus].filter((part): part is string => Boolean(part))
  if (!parts.length) return ''
  return `#${parts.map((part) => encodeURIComponent(part)).join('/')}`
}

export function parseDemoHash(hash: string): DemoLink {
  const raw = stripPrefix(hash, '#')
  if (!raw) return {}
  if (raw.includes('=')) return parseDemoSearch(raw)
  const [view, parkId, focus] = raw.split('/').map((part) => decodeURIComponent(part))
  return {
    view: view || undefined,
    parkId: parkId || undefined,
    focus: focus || undefined,
  }
}

function assign(params: URLSearchParams, key: string, value: string | undefined) {
  if (value === undefined) return
  const trimmed = value.trim()
  if (trimmed) params.set(key, trimmed)
  else params.delete(key)
}

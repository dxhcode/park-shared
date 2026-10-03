import type { ParkThemeName } from './tokens'

/** 把 data-park-theme 写到目标节点（默认 documentElement），驱动 theme.css。 */
export function applyParkTheme(name: ParkThemeName, target?: HTMLElement): void {
  const el = target ?? (typeof document !== 'undefined' ? document.documentElement : undefined)
  if (!el) return
  el.dataset.parkTheme = name
  el.style.colorScheme = name === 'screen' ? 'dark' : 'light'
}

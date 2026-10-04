/** 与 src/surface.css 中的类名一致。玻璃、墨色条和骨架可直接加在各端自己的节点上。 */
export const parkSurface = {
  glass: 'park-glass-surface',
  glassGlow: 'park-glass-glow',
  ink: 'park-ink-panel',
  accentLine: 'park-accent-line',
  skeleton: 'park-skeleton',
  skeletonKpi: 'park-skeleton-kpi',
  skeletonLine: 'park-skeleton-line',
  skeletonValue: 'park-skeleton-value',
  skeletonChart: 'park-skeleton-chart',
} as const

export type ParkSurfaceName = (typeof parkSurface)[keyof typeof parkSurface]

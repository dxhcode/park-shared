/** 与 src/theme.css 中的 CSS 变量保持一致，供图表、画布等非 CSS 场景读取。 */
export const adminTokens = {
  colorPrimary: '#1d39c4',
  colorAccent: '#0e1320',
  colorHighlight: '#c6a15b',
  colorBg: '#f3f5fb',
  colorSurface: '#ffffff',
  colorText: '#1a1d26',
  colorTextSecondary: '#5c6578',
  colorBorder: 'rgba(14, 19, 32, 0.12)',
  trendUp: '#15936a',
  trendDown: '#d4384b',
  accentLine: '#c6a15b',
  ink: '#0e1320',
  headerBg: '#0e1320',
  headerText: '#f4f7ff',
  siderBg: '#141a2a',
  radius: 10,
  fontFamily:
    '"Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
  fontDisplay:
    '"DIN Alternate", "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
} as const

export const screenTokens = {
  colorPrimary: '#22d3ee',
  colorAccent: '#3b82f6',
  colorHighlight: '#67e8f9',
  colorBg: '#05070f',
  colorSurface: 'rgba(10, 18, 40, 0.72)',
  colorText: '#e7f6ff',
  colorTextSecondary: '#8fb4d6',
  colorBorder: 'rgba(94, 234, 255, 0.35)',
  colorGlow: 'rgba(34, 211, 238, 0.45)',
  trendUp: '#5eead4',
  trendDown: '#fb7185',
  accentLine: '#22d3ee',
  ink: '#070d1c',
  headerBg: 'rgba(5, 10, 24, 0.82)',
  headerText: '#e7f6ff',
  siderBg: 'rgba(8, 14, 32, 0.92)',
  radius: 14,
  fontFamily:
    '"Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
  fontDisplay: '"Rajdhani", "DIN Alternate", "Segoe UI", sans-serif',
} as const

export const parkCssVars = {
  colorPrimary: '--park-color-primary',
  colorAccent: '--park-color-accent',
  colorHighlight: '--park-color-highlight',
  colorBg: '--park-color-bg',
  colorSurface: '--park-color-surface',
  colorText: '--park-color-text',
  colorTextSecondary: '--park-color-text-secondary',
  colorBorder: '--park-color-border',
  colorGlow: '--park-color-glow',
  trendUp: '--park-trend-up',
  trendDown: '--park-trend-down',
  accentLine: '--park-accent-line',
  ink: '--park-ink',
  skeletonBase: '--park-skeleton-base',
  skeletonShine: '--park-skeleton-shine',
  chart1: '--park-chart-1',
  chart2: '--park-chart-2',
  chart3: '--park-chart-3',
  chart4: '--park-chart-4',
  chart5: '--park-chart-5',
  chart6: '--park-chart-6',
  headerBg: '--park-header-bg',
  headerText: '--park-header-text',
  siderBg: '--park-sider-bg',
  radius: '--park-radius',
  radiusLg: '--park-radius-lg',
  glassBg: '--park-glass-bg',
  glassBorder: '--park-glass-border',
  glassBlur: '--park-glass-blur',
  shadow: '--park-shadow',
  glow: '--park-glow',
  fontFamily: '--park-font-family',
  fontDisplay: '--park-font-display',
} as const

export type ParkThemeName = 'admin' | 'screen'

export const parkThemes = {
  admin: adminTokens,
  screen: screenTokens,
} as const

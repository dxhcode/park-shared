export interface LoginPayload {
  username: string
  password: string
  remember: boolean
}

/** 空态插画。各端按场景选用，不绑定具体业务。 */
export type EmptyVariant = 'empty' | 'search' | 'error' | 'locked' | 'done'

/** auto 跟随祖先的 data-park-theme；显式指定时本节点自己套主题变量。 */
export type EmptyTone = 'auto' | 'admin' | 'screen'

export type TickerLevel = '指标' | '提示' | '预警' | '告警'

export interface TickerItem {
  id: string
  label: string
  value?: string | number
  unit?: string
  level?: TickerLevel
  time?: string
}

export type ScreenChartKind = 'line' | 'bar' | 'donut'

export interface ScreenChartSeries {
  name: string
  data: number[]
}

export interface MapMarker {
  id: string
  name: string
  shortName?: string
  /** 相对示意底图的横向位置，0–100。 */
  x: number
  /** 相对示意底图的纵向位置，0–100。 */
  y: number
  status?: string
  caption?: string
}

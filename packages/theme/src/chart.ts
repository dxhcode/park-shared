import { screenTokens } from './tokens.js'

/**
 * 与 theme.css 里大屏的 --park-chart-1 … --park-chart-6 一致。
 * 对象可直接交给 echarts.setOption，本包不依赖 echarts。
 * SVG 兜底图读取 CSS 变量，以便管理端换上靛蓝 / 金色板。
 */
export const screenChartPalette = ['#22d3ee', '#60a5fa', '#c4b5fd', '#5eead4', '#fbbf24', '#fb7185'] as const

export interface ScreenSeriesInput {
  name: string
  data: number[]
}

export interface ScreenPieDatum {
  name: string
  value: number
}

interface ScreenTooltip {
  trigger: 'axis' | 'item'
  backgroundColor: string
  borderColor: string
  textStyle: { color: string }
}

export interface ScreenCartesianOption {
  backgroundColor: string
  color: string[]
  textStyle: { color: string; fontFamily: string }
  tooltip: ScreenTooltip
  legend: { top: number; textStyle: { color: string } }
  grid: { left: number; right: number; top: number; bottom: number }
  xAxis: {
    type: 'category'
    data: string[]
    axisLine: { lineStyle: { color: string } }
    axisLabel: { color: string }
    splitLine: { show: false }
  }
  yAxis: {
    type: 'value'
    axisLine: { lineStyle: { color: string } }
    axisLabel: { color: string }
    splitLine: { lineStyle: { color: string } }
  }
  series: Array<{
    name: string
    type: 'line' | 'bar'
    data: number[]
    smooth?: boolean
    symbol?: string
    symbolSize?: number
    lineStyle?: { width: number; shadowBlur: number; shadowColor: string }
    areaStyle?: { color: string }
    itemStyle?: { borderRadius: number[]; shadowBlur: number; shadowColor: string }
    barMaxWidth?: number
  }>
}

export interface ScreenPieOption {
  backgroundColor: string
  color: string[]
  textStyle: { color: string; fontFamily: string }
  tooltip: ScreenTooltip
  legend: { bottom: number; textStyle: { color: string } }
  series: Array<{
    type: 'pie'
    radius: [string, string]
    center: [string, string]
    data: ScreenPieDatum[]
    label: { color: string }
    itemStyle: { borderColor: string; borderWidth: number }
  }>
}

const textStyle = {
  color: screenTokens.colorText,
  fontFamily: screenTokens.fontFamily,
}

function tooltip(trigger: 'axis' | 'item'): ScreenTooltip {
  return {
    trigger,
    backgroundColor: 'rgba(6, 12, 28, 0.92)',
    borderColor: screenTokens.colorBorder,
    textStyle: { color: screenTokens.colorText },
  }
}

function categoryAxis(categories: readonly string[]): ScreenCartesianOption['xAxis'] {
  return {
    type: 'category',
    data: [...categories],
    axisLine: { lineStyle: { color: screenTokens.colorBorder } },
    axisLabel: { color: screenTokens.colorTextSecondary },
    splitLine: { show: false },
  }
}

function valueAxis(): ScreenCartesianOption['yAxis'] {
  return {
    type: 'value',
    axisLine: { lineStyle: { color: screenTokens.colorBorder } },
    axisLabel: { color: screenTokens.colorTextSecondary },
    splitLine: { lineStyle: { color: 'rgba(56, 189, 248, 0.12)' } },
  }
}

function frame(): Pick<ScreenCartesianOption, 'backgroundColor' | 'color' | 'textStyle' | 'legend' | 'grid'> {
  return {
    backgroundColor: 'transparent',
    color: [...screenChartPalette],
    textStyle,
    legend: { top: 0, textStyle: { color: screenTokens.colorTextSecondary } },
    grid: { left: 48, right: 16, top: 36, bottom: 28 },
  }
}

export function screenLineOption(
  categories: readonly string[],
  series: readonly ScreenSeriesInput[],
): ScreenCartesianOption {
  return {
    ...frame(),
    tooltip: tooltip('axis'),
    xAxis: categoryAxis(categories),
    yAxis: valueAxis(),
    series: series.map((item, index) => ({
      name: item.name,
      type: 'line' as const,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      data: [...item.data],
      lineStyle: {
        width: 2,
        shadowBlur: 12,
        shadowColor: index === 0 ? 'rgba(34, 211, 238, 0.45)' : 'rgba(96, 165, 250, 0.35)',
      },
      areaStyle: index === 0 ? { color: 'rgba(34, 211, 238, 0.14)' } : undefined,
    })),
  }
}

export function screenBarOption(
  categories: readonly string[],
  series: readonly ScreenSeriesInput[],
): ScreenCartesianOption {
  return {
    ...frame(),
    tooltip: tooltip('axis'),
    xAxis: categoryAxis(categories),
    yAxis: valueAxis(),
    series: series.map((item) => ({
      name: item.name,
      type: 'bar' as const,
      data: [...item.data],
      barMaxWidth: 18,
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
        shadowBlur: 12,
        shadowColor: 'rgba(34, 211, 238, 0.28)',
      },
    })),
  }
}

export function screenPieOption(items: readonly ScreenPieDatum[]): ScreenPieOption {
  return {
    backgroundColor: 'transparent',
    color: [...screenChartPalette],
    textStyle,
    tooltip: tooltip('item'),
    legend: { bottom: 0, textStyle: { color: screenTokens.colorTextSecondary } },
    series: [
      {
        type: 'pie',
        radius: ['46%', '70%'],
        center: ['50%', '46%'],
        data: items.map((item) => ({ name: item.name, value: item.value })),
        label: { color: screenTokens.colorText },
        itemStyle: { borderColor: screenTokens.colorBg, borderWidth: 2 },
      },
    ],
  }
}

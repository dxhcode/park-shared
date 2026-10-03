<script setup lang="ts">
import { computed, useId } from 'vue'
import type { ScreenChartKind, ScreenChartSeries } from '../types'

defineOptions({ name: 'ParkScreenChart' })

const props = withDefaults(
  defineProps<{
    kind?: ScreenChartKind
    categories?: string[]
    series?: ScreenChartSeries[]
    unit?: string
    label?: string
  }>(),
  {
    kind: 'line',
    categories: () => [],
    series: () => [],
    unit: '',
    label: '',
  },
)

const palette = ['#22d3ee', '#60a5fa', '#c4b5fd', '#5eead4', '#fbbf24', '#fb7185']
const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '') || 'park-chart'
const width = 320
const height = 168
const pad = { l: 42, r: 10, t: 12, b: 26 }

const ariaLabel = computed(() => props.label || (props.kind === 'donut' ? '环形图' : props.kind === 'bar' ? '柱状图' : '折线图'))

function colorAt(index: number) {
  return palette[index % palette.length] ?? palette[0]
}

function compact(value: number) {
  const abs = Math.abs(value)
  if (abs >= 10000) {
    const digits = abs >= 100000 ? 0 : 1
    return `${(value / 10000).toFixed(digits)}万`
  }
  if (Number.isInteger(value)) return String(value)
  return value.toFixed(1)
}

function ringPath(cx: number, cy: number, outer: number, inner: number, start: number, end: number): string {
  const sweep = end - start
  if (sweep <= 0.001) return ''
  if (sweep >= Math.PI * 2 - 0.001) {
    return `${ringPath(cx, cy, outer, inner, start, start + Math.PI)} ${ringPath(cx, cy, outer, inner, start + Math.PI, start + Math.PI * 2 - 0.001)}`
  }
  const large = sweep > Math.PI ? 1 : 0
  const point = (radius: number, angle: number) =>
    `${(cx + radius * Math.cos(angle)).toFixed(2)} ${(cy + radius * Math.sin(angle)).toFixed(2)}`
  return `M ${point(outer, start)} A ${outer} ${outer} 0 ${large} 1 ${point(outer, end)} L ${point(inner, end)} A ${inner} ${inner} 0 ${large} 0 ${point(inner, start)} Z`
}

const plot = computed(() => {
  const categories = props.categories
  const series = props.series
  const values = series.flatMap((item) => item.data)
  const empty = categories.length === 0 || values.length === 0
  let min = 0
  let max = 1
  if (!empty) {
    min = Math.min(...values, props.kind === 'bar' ? 0 : values[0] ?? 0)
    max = Math.max(...values, 0)
    if (props.kind === 'bar' && min > 0) min = 0
    if (max === min) max = min + 1
  }
  const span = max - min || 1
  const innerW = width - pad.l - pad.r
  const innerH = height - pad.t - pad.b
  const count = Math.max(categories.length, 1)

  const yAt = (value: number) => pad.t + (1 - (value - min) / span) * innerH
  const lineX = (index: number) => (count <= 1 ? pad.l + innerW / 2 : pad.l + (index / (count - 1)) * innerW)
  const slot = innerW / count

  const ticks = [max, min + span / 2, min].map((value) => ({
    value,
    label: compact(value),
    y: yAt(value),
  }))

  const labels = categories.map((text, index) => ({
    text,
    x: props.kind === 'bar' ? pad.l + slot * index + slot / 2 : lineX(index),
    show: categories.length <= 8 || index === 0 || index === categories.length - 1 || index % 2 === 0,
  }))

  const lines = series.map((item, seriesIndex) => {
    const coords = item.data.map((value, index) => ({ x: lineX(index), y: yAt(value) }))
    const d = coords.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ')
    const baseline = yAt(min)
    const area =
      coords.length === 0
        ? ''
        : `${d} L ${coords[coords.length - 1]?.x.toFixed(1)} ${baseline.toFixed(1)} L ${coords[0]?.x.toFixed(1)} ${baseline.toFixed(1)} Z`
    return { name: item.name, color: colorAt(seriesIndex), d, area, coords }
  })

  const bars = series.flatMap((item, seriesIndex) => {
    const seriesCount = Math.max(series.length, 1)
    const gap = 3
    const barW = Math.min(14, Math.max(4, (slot * 0.72) / seriesCount - gap))
    const groupW = seriesCount * barW + (seriesCount - 1) * gap
    return item.data.map((value, index) => {
      const center = pad.l + slot * index + slot / 2
      const x = center - groupW / 2 + seriesIndex * (barW + gap)
      const y = Math.min(yAt(0), yAt(value))
      const h = Math.max(0, Math.abs(yAt(value) - yAt(0)))
      return { key: `${item.name}-${index}`, x, y, h, w: barW, color: colorAt(seriesIndex) }
    })
  })

  const donutSource = categories.map((name, index) => ({
    name,
    value: series[0]?.data[index] ?? 0,
    color: colorAt(index),
  }))
  const total = donutSource.reduce((sum, item) => sum + item.value, 0)
  let angle = -Math.PI / 2
  const slices = donutSource.map((item) => {
    const sweep = total <= 0 ? 0 : (item.value / total) * Math.PI * 2
    const start = angle
    angle += sweep
    return {
      ...item,
      d: ringPath(90, 84, 58, 36, start, angle),
    }
  })

  return { empty, ticks, labels, lines, bars, slices, total }
})
</script>

<template>
  <div class="park-screen-chart" :class="`is-${kind}`">
    <ul v-if="kind !== 'donut' && series.length > 1" class="park-screen-chart__legend">
      <li v-for="(item, index) in series" :key="item.name">
        <i :style="{ background: palette[index % palette.length] }" />
        {{ item.name }}
      </li>
    </ul>
    <svg
      v-if="kind !== 'donut'"
      :viewBox="`0 0 ${width} ${height}`"
      role="img"
      :aria-label="ariaLabel"
    >
      <defs>
        <filter :id="`${uid}-glow`" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <text v-if="plot.empty" x="160" y="86" text-anchor="middle" class="park-screen-chart__empty">暂无序列</text>
      <template v-else>
        <g class="park-screen-chart__grid">
          <line
            v-for="tick in plot.ticks"
            :key="tick.label + tick.y"
            :x1="pad.l"
            :x2="width - pad.r"
            :y1="tick.y"
            :y2="tick.y"
          />
        </g>
        <g class="park-screen-chart__axis">
          <text v-for="tick in plot.ticks" :key="`y-${tick.y}`" x="0" :y="tick.y + 3">{{ tick.label }}</text>
          <text
            v-for="(item, index) in plot.labels"
            v-show="item.show"
            :key="`x-${item.text}-${index}`"
            :x="item.x"
            :y="height - 6"
            text-anchor="middle"
          >
            {{ item.text }}
          </text>
        </g>
        <template v-if="kind === 'line'">
          <path
            v-for="line in plot.lines"
            :key="`${line.name}-area`"
            :d="line.area"
            :fill="line.color"
            opacity="0.16"
          />
          <path
            v-for="line in plot.lines"
            :key="line.name"
            :d="line.d"
            fill="none"
            :stroke="line.color"
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round"
            :filter="`url(#${uid}-glow)`"
          />
          <g v-for="line in plot.lines" :key="`${line.name}-points`">
            <circle
              v-for="(point, index) in line.coords"
              :key="`${line.name}-${index}`"
              :cx="point.x"
              :cy="point.y"
              r="2.4"
              :fill="line.color"
            />
          </g>
        </template>
        <template v-else>
          <rect
            v-for="bar in plot.bars"
            :key="bar.key"
            :x="bar.x"
            :y="bar.y"
            :width="bar.w"
            :height="bar.h"
            :fill="bar.color"
            rx="3"
            :filter="`url(#${uid}-glow)`"
          />
        </template>
      </template>
    </svg>

    <div v-else class="park-screen-chart__donut">
      <svg viewBox="0 0 180 168" role="img" :aria-label="ariaLabel">
        <text v-if="plot.empty || plot.total <= 0" x="90" y="88" text-anchor="middle" class="park-screen-chart__empty">
          暂无序列
        </text>
        <template v-else>
          <path v-for="slice in plot.slices" v-show="slice.d" :key="slice.name" :d="slice.d" :fill="slice.color" />
          <text class="park-screen-chart__total" x="90" y="82" text-anchor="middle">{{ plot.total.toLocaleString('zh-CN') }}</text>
          <text v-if="unit" class="park-screen-chart__unit" x="90" y="100" text-anchor="middle">{{ unit }}</text>
        </template>
      </svg>
      <ul class="park-screen-chart__legend is-stack">
        <li v-for="slice in plot.slices" :key="slice.name">
          <i :style="{ background: slice.color }" />
          <span>{{ slice.name }}</span>
          <strong>{{ slice.value.toLocaleString('zh-CN') }}</strong>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.park-screen-chart {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
}

.park-screen-chart svg {
  display: block;
  flex: 1;
  width: 100%;
  min-height: 0;
}

.park-screen-chart__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  margin: 0 0 4px;
  padding: 0;
  list-style: none;
  color: var(--park-color-text-secondary, #8fb4d6);
  font-size: 12px;
}

.park-screen-chart__legend li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.park-screen-chart__legend i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  box-shadow: 0 0 8px currentColor;
}

.park-screen-chart__grid line {
  stroke: rgba(56, 189, 248, 0.16);
  stroke-dasharray: 3 4;
}

.park-screen-chart__axis text,
.park-screen-chart__empty,
.park-screen-chart__unit {
  fill: var(--park-color-text-secondary, #8fb4d6);
  font-size: 10px;
}

.park-screen-chart__empty {
  letter-spacing: 0.12em;
}

.park-screen-chart__donut {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(108px, 0.8fr);
  align-items: center;
  height: 100%;
}

.park-screen-chart__legend.is-stack {
  flex-direction: column;
  gap: 8px;
  margin: 0;
}

.park-screen-chart__legend.is-stack li {
  display: grid;
  grid-template-columns: 8px minmax(0, 1fr) auto;
  gap: 8px;
  color: var(--park-color-text, #e7f6ff);
}

.park-screen-chart__legend strong {
  font-family: var(--park-font-display, inherit);
  font-weight: 700;
}

.park-screen-chart__total {
  fill: var(--park-color-text, #e7f6ff);
  font-size: 18px;
  font-weight: 700;
}
</style>

<style>
[data-park-theme='screen'] .park-screen-chart__total,
.park-screen-bg .park-screen-chart__total {
  fill: #f4fdff;
  filter: drop-shadow(0 0 8px rgba(34, 211, 238, 0.45));
}
</style>

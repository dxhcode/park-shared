<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ConfigProvider, Tag } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { screenAntdTheme, screenBarOption, screenLineOption, screenPieOption } from '@park/theme'
import { ChartPanel, GlassCard, KpiTicker, MapPanel, ScreenChart, ScreenKpi, ScreenLayout } from '@park/components'
import type { MapMarker, TickerItem } from '@park/components'
import {
  buildDemoHash,
  buildDemoSearch,
  getParkDashboard,
  mapMarkers,
  parks,
  parseDemoHash,
  parseDemoSearch,
} from '@park/mock'
import type { ChartMetric, ChartSeriesSample, DashboardKpiCode } from '@park/mock'

const headlineCodes: DashboardKpiCode[] = ['settled', 'occupancy', 'onsite', 'energyLoad']
const parkId = ref(readParkId())
const now = ref(new Date())
let timer = 0

const dashboard = computed(() => getParkDashboard(parkId.value))
const park = computed(() => dashboard.value?.park)

const clock = computed(() =>
  new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    hour12: false,
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(now.value),
)

const markers = computed<MapMarker[]>(() =>
  mapMarkers.map((item) => ({
    id: item.parkId,
    name: item.name,
    shortName: item.shortName,
    x: item.x,
    y: item.y,
    status: item.status,
    caption: item.city,
  })),
)

const headlines = computed(() =>
  headlineCodes
    .map((code) => dashboard.value?.kpis.find((item) => item.code === code))
    .filter((item): item is NonNullable<typeof item> => item !== undefined),
)

const kpiTicker = computed<TickerItem[]>(() =>
  (dashboard.value?.kpis ?? []).map((item) => ({
    id: item.id,
    label: item.label,
    value: item.value,
    unit: item.unit,
    level: '指标',
  })),
)

const alertTicker = computed<TickerItem[]>(() =>
  (dashboard.value?.alerts ?? []).map((item) => ({
    id: item.id,
    label: item.title,
    level: item.level,
    time: item.time,
  })),
)

const queryLink = computed(() => buildDemoSearch({ view: 'screen', parkId: parkId.value }))
const hashLink = computed(() => buildDemoHash({ view: 'screen', parkId: parkId.value, focus: 'map' }))

function readParkId() {
  const id = parseDemoSearch(window.location.search).parkId || parseDemoHash(window.location.hash).parkId
  return id && parks.some((item) => item.id === id) ? id : 'park-binjiang'
}

function digits(value: number) {
  const text = String(value)
  const dot = text.indexOf('.')
  return dot === -1 ? 0 : text.length - dot - 1
}

function chartOf(metric: ChartMetric): ChartSeriesSample | undefined {
  return dashboard.value?.charts.find((item) => item.metric === metric)
}

const energy = computed(() => chartOf('能耗'))
const flow = computed(() => chartOf('人流'))
const output = computed(() => chartOf('产值'))
const industry = computed(() => chartOf('产业'))

const energyOption = computed(() => (energy.value ? screenLineOption(energy.value.categories, energy.value.series) : undefined))
const flowOption = computed(() => (flow.value ? screenBarOption(flow.value.categories, flow.value.series) : undefined))
const industryOption = computed(() =>
  industry.value
    ? screenPieOption(
        industry.value.categories.map((name, index) => ({
          name,
          value: industry.value?.series[0]?.data[index] ?? 0,
        })),
      )
    : undefined,
)

function syncUrl() {
  const search = buildDemoSearch({ view: 'screen', parkId: parkId.value }, window.location.search)
  const next = `${window.location.pathname}${search}${window.location.hash}`
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
  if (next !== current) window.history.replaceState(null, '', next)
}

function onSelect(id: string) {
  if (parks.some((item) => item.id === id)) parkId.value = id
}

watch(parkId, syncUrl)

onMounted(() => {
  syncUrl()
  timer = window.setInterval(() => {
    now.value = new Date()
  }, 1000)
  const focus = parseDemoSearch(window.location.search).focus || parseDemoHash(window.location.hash).focus
  if (focus) document.getElementById(`screen-${focus}`)?.scrollIntoView({ block: 'center' })
})

onBeforeUnmount(() => window.clearInterval(timer))
</script>

<template>
  <ConfigProvider :locale="zhCN" :theme="screenAntdTheme">
    <div class="screen-demo">
      <ScreenLayout :fill="false" :title="park?.name ?? '园区运行态势'" subtitle="SCREEN">
        <template #extra>
          <Tag color="cyan">{{ park?.status }}</Tag>
          <span class="screen-clock">北京时间 {{ clock }}</span>
        </template>

        <p class="screen-link">
          演示深链 {{ queryLink }} · 锚点 {{ hashLink }}
          <span v-if="energyOption && flowOption && industryOption">
            · 折线 {{ energyOption.series.length }} 条 / 柱状 {{ flowOption.series.length }} 条 / 环形
            {{ industryOption.series[0]?.data.length ?? 0 }} 项
          </span>
        </p>

        <div class="screen-tickers">
          <KpiTicker :items="alertTicker" label="告警滚动" />
          <KpiTicker :items="kpiTicker" label="指标滚动" />
        </div>

        <div class="screen-kpis">
          <GlassCard v-for="item in headlines" :key="item.id">
            <ScreenKpi
              :label="item.label"
              :value="item.value"
              :unit="item.unit"
              :trend="item.trend"
              :hint="item.hint"
              :decimals="digits(item.value)"
            />
          </GlassCard>
        </div>

        <div class="screen-board">
          <ChartPanel id="screen-energy" :title="energy?.name ?? '近七日能耗'" :caption="energy ? `单位 ${energy.unit}` : ''">
            <template #extra>可交给 ECharts</template>
            <ScreenChart
              kind="line"
              :categories="energy?.categories ?? []"
              :series="energy?.series ?? []"
              :unit="energy?.unit"
              label="近七日能耗"
            />
          </ChartPanel>

          <MapPanel
            id="screen-map"
            :markers="markers"
            :active-id="parkId"
            @select="onSelect"
          >
            <template #extra>{{ park?.city }}</template>
          </MapPanel>

          <ChartPanel id="screen-flow" :title="flow?.name ?? '今日人流'" :caption="flow ? `单位 ${flow.unit} · 横轴为小时` : ''">
            <ScreenChart
              kind="bar"
              :categories="flow?.categories ?? []"
              :series="flow?.series ?? []"
              :unit="flow?.unit"
              label="今日人流"
            />
          </ChartPanel>

          <ChartPanel id="screen-output" :title="output?.name ?? '近六月产值'" :caption="output ? `单位 ${output.unit}` : ''">
            <ScreenChart
              kind="line"
              :categories="output?.categories ?? []"
              :series="output?.series ?? []"
              :unit="output?.unit"
              label="近六月产值"
            />
          </ChartPanel>

          <ChartPanel
            id="screen-industry"
            class="is-wide"
            :title="industry?.name ?? '产业从业人数'"
            :caption="industry ? `单位 ${industry.unit} · 不含已迁出` : ''"
          >
            <ScreenChart
              kind="donut"
              :categories="industry?.categories ?? []"
              :series="industry?.series ?? []"
              :unit="industry?.unit"
              label="产业从业人数"
            />
          </ChartPanel>
        </div>
      </ScreenLayout>
    </div>
  </ConfigProvider>
</template>

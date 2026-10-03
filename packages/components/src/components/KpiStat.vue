<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'ParkKpiStat' })

const props = defineProps<{
  label: string
  value: string | number
  unit?: string
  /** 环比百分比。正数上升，负数下降，不传则不展示。 */
  trend?: number
  hint?: string
}>()

const trendText = computed(() => {
  if (props.trend === undefined) return ''
  const arrow = props.trend > 0 ? '↑' : props.trend < 0 ? '↓' : '–'
  return `${arrow} ${Math.abs(props.trend).toFixed(1)}%`
})

const trendClass = computed(() => {
  if (props.trend === undefined || props.trend === 0) return 'is-flat'
  return props.trend > 0 ? 'is-up' : 'is-down'
})
</script>

<template>
  <article class="park-kpi">
    <p class="park-kpi__label">{{ label }}</p>
    <p class="park-kpi__value">
      <span>{{ value }}</span>
      <small v-if="unit">{{ unit }}</small>
    </p>
    <p v-if="trend !== undefined" class="park-kpi__trend" :class="trendClass">{{ trendText }}</p>
    <p v-if="hint" class="park-kpi__hint">{{ hint }}</p>
  </article>
</template>

<style scoped>
.park-kpi {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.park-kpi__label {
  margin: 0;
  font-size: 13px;
  letter-spacing: 0.08em;
  color: var(--park-color-text-secondary, #5c6578);
}

.park-kpi__value {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin: 0;
  font-family: var(--park-font-display, inherit);
  font-size: 36px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--park-color-text, #1a1d26);
}

.park-kpi__value small {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--park-color-text-secondary, #5c6578);
}

.park-kpi__trend {
  margin: 0;
  font-family: var(--park-font-display, inherit);
  font-size: 13px;
  letter-spacing: 0.06em;
}

.park-kpi__trend.is-up {
  color: #15936a;
}

.park-kpi__trend.is-down {
  color: #d4384b;
}

.park-kpi__trend.is-flat {
  color: var(--park-color-text-secondary, #5c6578);
}

.park-kpi__hint {
  margin: 0;
  font-size: 12px;
  color: var(--park-color-text-secondary, #5c6578);
}
</style>

<style>
[data-park-theme='screen'] .park-kpi__value span,
.park-screen-bg .park-kpi__value span {
  background: linear-gradient(180deg, #f4fdff 10%, #67e8f9 55%, #3b82f6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 12px rgba(34, 211, 238, 0.35));
}

[data-park-theme='screen'] .park-kpi__trend.is-up,
.park-screen-bg .park-kpi__trend.is-up {
  color: #5eead4;
}

[data-park-theme='screen'] .park-kpi__trend.is-down,
.park-screen-bg .park-kpi__trend.is-down {
  color: #fb7185;
}
</style>

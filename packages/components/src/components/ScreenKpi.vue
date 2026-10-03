<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

defineOptions({ name: 'ParkScreenKpi' })

const props = withDefaults(
  defineProps<{
    label: string
    value: number
    unit?: string
    /** 环比百分比。正数上升，负数下降，不传则不展示。 */
    trend?: number
    hint?: string
    /** 从 0 或上一个值滚到当前值。 */
    countUp?: boolean
    /** 左侧光点脉冲。 */
    pulse?: boolean
    duration?: number
    decimals?: number
  }>(),
  {
    countUp: true,
    pulse: true,
    duration: 900,
    decimals: 0,
  },
)

const shown = ref(0)
let frame = 0

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function format(value: number) {
  const digits = Math.max(0, props.decimals)
  if (digits > 0) return value.toFixed(digits)
  return Math.round(value).toLocaleString('zh-CN')
}

const text = computed(() => format(shown.value))
const aria = computed(() => `${props.label} ${format(props.value)}${props.unit ? ` ${props.unit}` : ''}`)

const trendText = computed(() => {
  if (props.trend === undefined) return ''
  const arrow = props.trend > 0 ? '↑' : props.trend < 0 ? '↓' : '–'
  return `${arrow} ${Math.abs(props.trend).toFixed(1)}%`
})

const trendClass = computed(() => {
  if (props.trend === undefined || props.trend === 0) return 'is-flat'
  return props.trend > 0 ? 'is-up' : 'is-down'
})

function stop() {
  if (frame) cancelAnimationFrame(frame)
  frame = 0
}

function animate(from: number, to: number) {
  stop()
  if (!props.countUp || prefersReducedMotion() || props.duration <= 0) {
    shown.value = to
    return
  }
  const start = performance.now()
  const step = (now: number) => {
    const progress = Math.min(1, (now - start) / props.duration)
    const eased = 1 - (1 - progress) ** 3
    shown.value = from + (to - from) * eased
    if (progress < 1) frame = requestAnimationFrame(step)
    else shown.value = to
  }
  frame = requestAnimationFrame(step)
}

onMounted(() => animate(0, props.value))
watch(
  () => props.value,
  (next, previous) => animate(previous ?? shown.value, next),
)
onBeforeUnmount(stop)
</script>

<template>
  <article class="park-screen-kpi" :class="{ 'is-pulse': pulse }">
    <p class="park-screen-kpi__label">{{ label }}</p>
    <p class="park-screen-kpi__value" :aria-label="aria">
      <span>{{ text }}</span>
      <small v-if="unit">{{ unit }}</small>
    </p>
    <p v-if="trend !== undefined" class="park-screen-kpi__trend" :class="trendClass">{{ trendText }}</p>
    <p v-if="hint" class="park-screen-kpi__hint">{{ hint }}</p>
  </article>
</template>

<style scoped>
.park-screen-kpi {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  padding-left: 14px;
}

.park-screen-kpi__label {
  margin: 0;
  font-size: 13px;
  letter-spacing: 0.12em;
  color: var(--park-color-text-secondary, #8fb4d6);
}

.park-screen-kpi__value {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin: 0;
  font-family: var(--park-font-display, inherit);
  font-size: 34px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: var(--park-color-text, #1a1d26);
}

.park-screen-kpi__value small {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--park-color-text-secondary, #8fb4d6);
}

.park-screen-kpi__trend {
  margin: 0;
  font-family: var(--park-font-display, inherit);
  font-size: 13px;
  letter-spacing: 0.06em;
}

.park-screen-kpi__trend.is-up {
  color: #15936a;
}

.park-screen-kpi__trend.is-down {
  color: #d4384b;
}

.park-screen-kpi__trend.is-flat {
  color: var(--park-color-text-secondary, #8fb4d6);
}

.park-screen-kpi__hint {
  margin: 0;
  font-size: 12px;
  color: var(--park-color-text-secondary, #8fb4d6);
}

.park-screen-kpi.is-pulse::before {
  content: '';
  position: absolute;
  top: 6px;
  left: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--park-color-primary, #22d3ee);
  box-shadow: 0 0 10px var(--park-color-glow, rgba(34, 211, 238, 0.45));
}

@media (prefers-reduced-motion: no-preference) {
  .park-screen-kpi.is-pulse::before {
    animation: park-kpi-pulse 1.8s ease-in-out infinite;
  }
}

@keyframes park-kpi-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.75;
  }
  50% {
    transform: scale(1.35);
    opacity: 1;
  }
}
</style>

<style>
[data-park-theme='screen'] .park-screen-kpi__value span,
.park-screen-bg .park-screen-kpi__value span {
  background: linear-gradient(180deg, #f4fdff 10%, #67e8f9 55%, #3b82f6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 12px rgba(34, 211, 238, 0.35));
}

[data-park-theme='screen'] .park-screen-kpi__trend.is-up,
.park-screen-bg .park-screen-kpi__trend.is-up {
  color: #5eead4;
}

[data-park-theme='screen'] .park-screen-kpi__trend.is-down,
.park-screen-bg .park-screen-kpi__trend.is-down {
  color: #fb7185;
}
</style>

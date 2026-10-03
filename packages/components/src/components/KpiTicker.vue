<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TickerItem } from '../types'

defineOptions({ name: 'ParkKpiTicker' })

const props = withDefaults(
  defineProps<{
    items: TickerItem[]
    /** 一整圈的秒数。不传时按条目数拉开。 */
    duration?: number
    pauseOnHover?: boolean
    label?: string
  }>(),
  {
    pauseOnHover: true,
    label: '滚动信息',
  },
)

const paused = ref(false)
const copies = computed(() => (props.items.length ? [0, 1] : []))
const seconds = computed(() => props.duration ?? Math.max(18, props.items.length * 5))
const trackStyle = computed(() => ({
  animationDuration: `${seconds.value}s`,
  animationPlayState: paused.value ? 'paused' : 'running',
}))

function hold() {
  if (props.pauseOnHover) paused.value = true
}
</script>

<template>
  <div
    class="park-ticker"
    :class="{ 'is-empty': items.length === 0 }"
    role="region"
    :aria-label="label"
    @mouseenter="hold"
    @mouseleave="paused = false"
  >
    <p v-if="items.length === 0" class="park-ticker__empty">暂无滚动信息</p>
    <div v-else class="park-ticker__track" :style="trackStyle">
      <div
        v-for="copy in copies"
        :key="copy"
        class="park-ticker__group"
        :role="copy === 0 ? 'list' : undefined"
        :aria-hidden="copy === 1 ? 'true' : undefined"
      >
        <span
          v-for="item in items"
          :key="`${copy}-${item.id}`"
          class="park-ticker__item"
          role="listitem"
          :data-level="item.level ?? '指标'"
        >
          <i class="park-ticker__dot" aria-hidden="true" />
          <em v-if="item.time">{{ item.time }}</em>
          <strong>{{ item.label }}</strong>
          <span v-if="item.value !== undefined && item.value !== ''" class="park-ticker__value">
            {{ item.value }}<small v-if="item.unit">{{ item.unit }}</small>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.park-ticker {
  position: relative;
  overflow: hidden;
  border-radius: 999px;
  border: 1px solid var(--park-glass-border, rgba(94, 234, 255, 0.38));
  background: var(--park-glass-bg, rgba(10, 18, 40, 0.72));
  box-shadow: var(--park-glow, 0 0 24px rgba(34, 211, 238, 0.28));
  backdrop-filter: blur(var(--park-glass-blur, 18px));
}

.park-ticker__empty {
  margin: 0;
  padding: 8px 16px;
  color: var(--park-color-text-secondary, #8fb4d6);
  font-size: 12px;
  letter-spacing: 0.12em;
}

.park-ticker__track {
  display: flex;
  width: max-content;
  animation: park-ticker-move linear infinite;
}

.park-ticker__group {
  display: flex;
  flex: none;
  align-items: center;
  gap: 22px;
  padding: 8px 22px 8px 18px;
}

.park-ticker__item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--park-color-text, #e7f6ff);
  font-size: 13px;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.park-ticker__item em {
  font-style: normal;
  font-family: var(--park-font-display, inherit);
  letter-spacing: 0.08em;
  color: var(--park-color-text-secondary, #8fb4d6);
}

.park-ticker__item strong {
  font-weight: 600;
}

.park-ticker__value {
  font-family: var(--park-font-display, inherit);
  font-weight: 700;
  letter-spacing: 0.06em;
}

.park-ticker__value small {
  margin-left: 4px;
  font-size: 11px;
  font-weight: 600;
  color: var(--park-color-text-secondary, #8fb4d6);
}

.park-ticker__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 8px currentColor;
}

.park-ticker__item[data-level='告警'] {
  color: #fb7185;
}

.park-ticker__item[data-level='预警'] {
  color: #fbbf24;
}

.park-ticker__item[data-level='提示'] {
  color: #67e8f9;
}

.park-ticker__item[data-level='指标'] {
  color: var(--park-color-text, #e7f6ff);
}

@media (prefers-reduced-motion: reduce) {
  .park-ticker {
    overflow: auto;
  }

  .park-ticker__track {
    width: auto;
    animation: none;
  }

  .park-ticker__group[aria-hidden='true'] {
    display: none;
  }

  .park-ticker__group {
    flex-wrap: wrap;
  }
}

@keyframes park-ticker-move {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>

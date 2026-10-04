<script setup lang="ts">
import { computed } from 'vue'
import GlassCard from './GlassCard.vue'

defineOptions({ name: 'ParkChartPanel' })

const props = withDefaults(
  defineProps<{
    title?: string
    caption?: string
    /** 画布高度。数字按像素。 */
    height?: number | string
    /** 用骨架占住画布，不渲染默认插槽。 */
    loading?: boolean
  }>(),
  {
    height: 200,
    loading: false,
  },
)

const canvasStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}))
</script>

<template>
  <GlassCard :title="title" class="park-chart-panel">
    <template v-if="$slots.extra" #extra>
      <slot name="extra" />
    </template>
    <div class="park-chart-panel__canvas" :style="canvasStyle">
      <div v-if="loading" class="park-skeleton park-skeleton-chart" role="status" aria-label="图表加载中" />
      <slot v-else>
        <p class="park-chart-panel__empty">将图表画布放在这里</p>
      </slot>
    </div>
    <p v-if="caption" class="park-chart-panel__caption">{{ caption }}</p>
  </GlassCard>
</template>

<style scoped>
.park-chart-panel__canvas {
  min-width: 0;
}

.park-chart-panel__canvas :deep(> *) {
  width: 100%;
  height: 100%;
}

.park-chart-panel__empty,
.park-chart-panel__caption {
  margin: 0;
  color: var(--park-color-text-secondary, #8fb4d6);
  font-size: 12px;
  letter-spacing: 0.08em;
}

.park-chart-panel__empty {
  display: grid;
  place-items: center;
  height: 100%;
  border-radius: 12px;
  background: color-mix(in srgb, var(--park-color-primary, #22d3ee) 6%, transparent);
}

.park-chart-panel__caption {
  margin-top: 8px;
}
</style>

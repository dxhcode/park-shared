<script setup lang="ts">
import { computed, useId } from 'vue'
import type { MapMarker } from '../types'
import GlassCard from './GlassCard.vue'

defineOptions({ name: 'ParkMapPanel' })

const props = withDefaults(
  defineProps<{
    title?: string
    markers?: MapMarker[]
    activeId?: string
  }>(),
  {
    title: '园区分布示意',
    markers: () => [],
  },
)

const emit = defineEmits<{
  select: [id: string]
}>()

const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '') || 'park-map'
const width = 640
const height = 400

const placed = computed(() =>
  props.markers.map((marker) => ({
    ...marker,
    px: (Math.min(100, Math.max(0, marker.x)) / 100) * width,
    py: (Math.min(100, Math.max(0, marker.y)) / 100) * height,
  })),
)

const corridor = computed(() => placed.value.map((marker) => `${marker.px},${marker.py}`).join(' '))

function choose(id: string) {
  emit('select', id)
}
</script>

<template>
  <GlassCard :title="title" class="park-map">
    <template v-if="$slots.extra" #extra>
      <slot name="extra" />
    </template>
    <div class="park-map__stage">
      <svg :viewBox="`0 0 ${width} ${height}`" role="img" aria-label="三座园区的示意分布">
        <defs>
          <linearGradient :id="`${uid}-land`" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#16325f" />
            <stop offset="1" stop-color="#071226" />
          </linearGradient>
          <linearGradient :id="`${uid}-river`" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#22d3ee" stop-opacity="0.15" />
            <stop offset="0.5" stop-color="#67e8f9" stop-opacity="0.85" />
            <stop offset="1" stop-color="#3b82f6" stop-opacity="0.2" />
          </linearGradient>
          <clipPath :id="`${uid}-clip`">
            <path
              d="M96 128C150 62 268 48 352 74c86 26 168 8 230 52 42 30 48 92 18 146-34 62-108 112-196 124-104 14-214-18-268-86-40-50-58-112-40-186Z"
            />
          </clipPath>
        </defs>

        <g opacity="0.55" stroke="rgba(56,189,248,0.16)" stroke-width="1">
          <path
            v-for="col in 12"
            :key="`c-${col}`"
            :d="`M${col * 52} 0 V${height}`"
          />
          <path
            v-for="row in 8"
            :key="`r-${row}`"
            :d="`M0 ${row * 50} H${width}`"
          />
        </g>

        <path
          d="M96 128C150 62 268 48 352 74c86 26 168 8 230 52 42 30 48 92 18 146-34 62-108 112-196 124-104 14-214-18-268-86-40-50-58-112-40-186Z"
          :fill="`url(#${uid}-land)`"
          stroke="rgba(103,232,249,0.72)"
          stroke-width="1.6"
        />
        <g :clip-path="`url(#${uid}-clip)`" opacity="0.35" stroke="rgba(103,232,249,0.28)">
          <path v-for="col in 11" :key="`ic-${col}`" :d="`M${80 + col * 48} 40 V360`" />
          <path v-for="row in 6" :key="`ir-${row}`" :d="`M70 ${70 + row * 46} H590`" />
        </g>
        <path
          d="M128 246C210 214 292 252 372 228s150-62 214-86"
          fill="none"
          :stroke="`url(#${uid}-river)`"
          stroke-width="3"
          stroke-linecap="round"
        />
        <path
          d="M470 118c28 18 46 18 78 8"
          fill="none"
          stroke="rgba(103,232,249,0.45)"
          stroke-width="1.4"
          stroke-dasharray="3 5"
        />

        <polyline
          v-if="placed.length > 1"
          :points="corridor"
          fill="none"
          stroke="rgba(34,211,238,0.38)"
          stroke-width="1.4"
          stroke-dasharray="5 7"
        />

        <g
          v-for="marker in placed"
          :key="marker.id"
          class="park-map__pin"
          :class="{ 'is-active': marker.id === activeId }"
          :transform="`translate(${marker.px} ${marker.py})`"
          role="button"
          tabindex="0"
          :aria-label="`${marker.name}${marker.status ? `，${marker.status}` : ''}`"
          :aria-pressed="marker.id === activeId"
          @click="choose(marker.id)"
          @keydown.enter.prevent="choose(marker.id)"
          @keydown.space.prevent="choose(marker.id)"
        >
          <circle class="park-map__halo" r="18" />
          <circle class="park-map__ring" r="9" />
          <circle class="park-map__core" r="4.2" />
          <text class="park-map__name" y="-18" text-anchor="middle">{{ marker.shortName || marker.name }}</text>
          <text v-if="marker.caption || marker.status" class="park-map__meta" y="24" text-anchor="middle">
            {{ [marker.caption, marker.status].filter(Boolean).join(' · ') }}
          </text>
        </g>

        <text class="park-map__watermark" x="616" y="384" text-anchor="end">示意 · 非实测地图</text>
      </svg>
    </div>
    <p class="park-map__note">点击园区名称切换该园的指标、告警与曲线。无需地图密钥。</p>
  </GlassCard>
</template>

<style scoped>
.park-map__stage {
  height: 232px;
  overflow: hidden;
  border-radius: 12px;
  background:
    radial-gradient(circle at 20% 20%, rgba(34, 211, 238, 0.12), transparent 32%),
    rgba(3, 8, 20, 0.35);
}

.park-map__stage svg {
  display: block;
  width: 100%;
  height: 100%;
}

.park-map__pin {
  color: #67e8f9;
  cursor: pointer;
  outline: none;
}

.park-map__halo {
  fill: rgba(34, 211, 238, 0.08);
}

.park-map__ring {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  opacity: 0.85;
}

.park-map__core {
  fill: currentColor;
}

.park-map__name {
  fill: #e7f6ff;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.park-map__meta {
  fill: #8fb4d6;
  font-size: 11px;
  letter-spacing: 0.06em;
}

.park-map__pin.is-active {
  color: #f4fdff;
}

.park-map__pin.is-active .park-map__name {
  fill: #67e8f9;
}

.park-map__pin:focus-visible .park-map__ring {
  stroke: #ffffff;
  stroke-width: 2;
}

.park-map__watermark,
.park-map__note {
  fill: rgba(143, 180, 214, 0.7);
  font-size: 12px;
  letter-spacing: 0.14em;
}

.park-map__note {
  margin: 10px 0 0;
  color: var(--park-color-text-secondary, #8fb4d6);
}

@media (prefers-reduced-motion: no-preference) {
  .park-map__ring {
    transform-box: fill-box;
    transform-origin: center;
    animation: park-map-ping 2.6s ease-out infinite;
  }

  .park-map__pin.is-active .park-map__ring {
    animation-duration: 1.5s;
  }
}

@keyframes park-map-ping {
  0% {
    opacity: 0.9;
    transform: scale(0.7);
  }
  100% {
    opacity: 0.05;
    transform: scale(1.7);
  }
}
</style>

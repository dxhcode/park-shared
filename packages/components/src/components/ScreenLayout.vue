<script setup lang="ts">
import AppLogo from './AppLogo.vue'

defineOptions({ name: 'ParkScreenLayout' })

withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    /** 独立铺满视口。嵌在其他布局里时关掉。 */
    fill?: boolean
  }>(),
  {
    title: '园区运行态势',
    subtitle: 'SCREEN',
    fill: true,
  },
)
</script>

<template>
  <div class="park-screen park-screen-bg" :class="{ 'is-fill': fill }" data-park-theme="screen">
    <header class="park-screen__header">
      <div class="park-screen__brand">
        <slot name="header">
          <AppLogo :title="title" :subtitle="subtitle" />
        </slot>
      </div>
      <div v-if="$slots.extra" class="park-screen__extra">
        <slot name="extra" />
      </div>
    </header>
    <main class="park-screen__main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.park-screen {
  display: flex;
  flex-direction: column;
  min-height: 420px;
  overflow: hidden;
  border-radius: var(--park-radius-lg, 18px);
  color: var(--park-color-text, #e7f6ff);
}

.park-screen.is-fill {
  min-height: var(--park-layout-min-height, 100vh);
  border-radius: 0;
}

.park-screen__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 64px;
  padding: 12px 20px;
  background: var(--park-header-bg);
  color: var(--park-header-text);
  border-bottom: 1px solid rgba(103, 232, 249, 0.35);
  box-shadow: 0 0 24px rgba(34, 211, 238, 0.12);
}

.park-screen__brand,
.park-screen__extra {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.park-screen__extra {
  margin-left: auto;
  color: var(--park-color-text-secondary, #8fb4d6);
  font-size: 13px;
  letter-spacing: 0.08em;
}

.park-screen__main {
  flex: 1;
  min-height: 0;
  padding: 20px 22px 28px;
}
</style>

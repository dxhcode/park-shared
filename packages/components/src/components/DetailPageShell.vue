<script setup lang="ts">
import { Button, Spin } from 'ant-design-vue'
import PageHeader from './PageHeader.vue'

defineOptions({ name: 'ParkDetailPageShell' })

withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    eyebrow?: string
    backText?: string
    loading?: boolean
  }>(),
  {
    backText: '',
    loading: false,
  },
)

const emit = defineEmits<{
  back: []
}>()
</script>

<template>
  <section class="park-detail-shell">
    <PageHeader :title="title" :subtitle="subtitle" :eyebrow="eyebrow">
      <template v-if="backText || $slots.extra" #extra>
        <Button v-if="backText" @click="emit('back')">{{ backText }}</Button>
        <slot name="extra" />
      </template>
    </PageHeader>
    <div v-if="$slots.meta" class="park-detail-shell__meta">
      <slot name="meta" />
    </div>
    <Spin :spinning="loading">
      <div class="park-detail-shell__sections">
        <slot />
      </div>
    </Spin>
  </section>
</template>

<style scoped>
.park-detail-shell {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.park-detail-shell__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: -6px;
}

.park-detail-shell__sections {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 120px;
}
</style>

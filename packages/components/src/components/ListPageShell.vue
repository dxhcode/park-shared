<script setup lang="ts">
import { computed } from 'vue'
import { Pagination, Spin } from 'ant-design-vue'
import type { EmptyVariant } from '../types'
import EmptyState from './EmptyState.vue'
import PageHeader from './PageHeader.vue'

defineOptions({ name: 'ParkListPageShell' })

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    eyebrow?: string
    loading?: boolean
    empty?: boolean
    emptyTitle?: string
    emptyDescription?: string
    emptyVariant?: EmptyVariant
    emptyPrimaryText?: string
    emptySecondaryText?: string
    total?: number
    page?: number
    pageSize?: number
    showPagination?: boolean
    pageSizeOptions?: string[]
  }>(),
  {
    loading: false,
    empty: false,
    emptyTitle: '暂无数据',
    emptyDescription: '当前条件下没有可展示的记录。',
    emptyVariant: 'empty',
    emptyPrimaryText: '',
    emptySecondaryText: '',
    page: 1,
    pageSize: 10,
    showPagination: true,
    pageSizeOptions: () => ['10', '20', '50'],
  },
)

const emit = defineEmits<{
  'update:page': [page: number]
  'update:pageSize': [pageSize: number]
  change: [page: number, pageSize: number]
  emptyPrimary: []
  emptySecondary: []
}>()

const showEmpty = computed(() => props.empty && !props.loading)
const pagerVisible = computed(
  () => props.showPagination && !props.empty && typeof props.total === 'number' && props.total > 0,
)

function showTotal(total: number): string {
  return `共 ${total} 条`
}

function onPageChange(page: number, pageSize: number): void {
  emit('update:page', page)
  emit('update:pageSize', pageSize)
  emit('change', page, pageSize)
}
</script>

<template>
  <section class="park-list-shell">
    <PageHeader :title="title" :subtitle="subtitle" :eyebrow="eyebrow">
      <template v-if="$slots.extra" #extra>
        <slot name="extra" />
      </template>
    </PageHeader>
    <div v-if="$slots.filters" class="park-list-shell__filters">
      <slot name="filters" />
    </div>
    <div class="park-list-shell__panel">
      <Spin :spinning="loading">
        <slot v-if="showEmpty" name="empty">
          <EmptyState
            :title="emptyTitle"
            :description="emptyDescription"
            :variant="emptyVariant"
            :primary-text="emptyPrimaryText"
            :secondary-text="emptySecondaryText"
            @primary="emit('emptyPrimary')"
            @secondary="emit('emptySecondary')"
          >
            <template v-if="$slots.emptyPrimary" #primary>
              <slot name="emptyPrimary" />
            </template>
            <template v-if="$slots.emptySecondary" #secondary>
              <slot name="emptySecondary" />
            </template>
          </EmptyState>
        </slot>
        <div v-else class="park-list-shell__content">
          <slot />
        </div>
      </Spin>
    </div>
    <footer v-if="pagerVisible" class="park-list-shell__pager">
      <Pagination
        :current="page"
        :page-size="pageSize"
        :total="total"
        :page-size-options="pageSizeOptions"
        :show-size-changer="true"
        :show-total="showTotal"
        @change="onPageChange"
      />
    </footer>
  </section>
</template>

<style scoped>
.park-list-shell {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.park-list-shell__filters,
.park-list-shell__panel {
  border-radius: var(--park-radius-lg, 16px);
  background: var(--park-color-surface, #ffffff);
  border: 1px solid var(--park-color-border, rgba(14, 19, 32, 0.12));
  box-shadow: 0 10px 28px rgba(14, 19, 32, 0.05);
}

.park-list-shell__filters {
  padding: 14px 16px;
}

.park-list-shell__panel {
  overflow: hidden;
}

.park-list-shell__panel :deep(.ant-spin-nested-loading),
.park-list-shell__panel :deep(.ant-spin-container) {
  min-height: 160px;
}

.park-list-shell__panel :deep(.park-empty) {
  border: 0;
  background: transparent;
  box-shadow: none;
  border-radius: 0;
}

.park-list-shell__pager {
  display: flex;
  justify-content: flex-end;
}

[data-park-theme='screen'] .park-list-shell__filters,
[data-park-theme='screen'] .park-list-shell__panel {
  background: var(--park-glass-bg);
  border-color: var(--park-glass-border);
  box-shadow: var(--park-shadow), var(--park-glow);
  backdrop-filter: blur(var(--park-glass-blur));
}
</style>

<script setup lang="ts">
import { Layout, LayoutContent, LayoutHeader, LayoutSider } from 'ant-design-vue'
import AppLogo from './AppLogo.vue'

defineOptions({ name: 'ParkAdminLayout' })

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    collapsed?: boolean
    siderWidth?: number
    collapsedWidth?: number
  }>(),
  {
    title: '智慧园区',
    subtitle: 'ADMIN',
    collapsed: false,
    siderWidth: 232,
    collapsedWidth: 72,
  },
)

const emit = defineEmits<{
  'update:collapsed': [collapsed: boolean]
}>()

function toggleCollapsed(): void {
  emit('update:collapsed', !props.collapsed)
}
</script>

<template>
  <Layout class="park-admin" :class="{ 'is-collapsed': collapsed }" has-sider>
    <LayoutSider
      class="park-admin__sider"
      theme="dark"
      :width="siderWidth"
      :collapsed-width="collapsedWidth"
      :collapsed="collapsed"
      :trigger="null"
      :style="{ background: 'var(--park-sider-bg)', color: 'var(--park-header-text)' }"
    >
      <div class="park-admin__brand">
        <slot name="logo">
          <AppLogo :title="title" :subtitle="subtitle" />
        </slot>
      </div>
      <div class="park-admin__nav">
        <p v-if="!$slots.sider" class="park-admin__placeholder">侧栏插槽</p>
        <slot name="sider" />
      </div>
      <button
        type="button"
        class="park-admin__collapse"
        :aria-label="collapsed ? '展开侧栏' : '收起侧栏'"
        @click="toggleCollapsed"
      >
        <span aria-hidden="true">{{ collapsed ? '›' : '‹' }}</span>
        <span v-if="!collapsed">收起</span>
      </button>
    </LayoutSider>
    <Layout class="park-admin__main">
      <LayoutHeader
        class="park-admin__header"
        :style="{ background: 'var(--park-header-bg)', color: 'var(--park-header-text)' }"
      >
        <div class="park-admin__header-main">
          <slot name="header" />
        </div>
        <div class="park-admin__header-extra">
          <slot name="extra" />
        </div>
      </LayoutHeader>
      <LayoutContent class="park-admin__content">
        <slot />
      </LayoutContent>
    </Layout>
  </Layout>
</template>

<style scoped>
.park-admin {
  min-height: var(--park-layout-min-height, 100vh);
  background: var(--park-color-bg, #f3f5fb);
  color: var(--park-color-text, #1a1d26);
}

.park-admin__main {
  min-width: 0;
  background: transparent;
}

.park-admin__sider {
  border-right: 1px solid rgba(198, 161, 91, 0.28);
}

.park-admin__sider :deep(.ant-layout-sider-children) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.park-admin__brand {
  display: flex;
  align-items: center;
  min-height: 64px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(244, 247, 255, 0.08);
}

.park-admin.is-collapsed .park-admin__brand {
  justify-content: center;
  padding-inline: 8px;
}

.park-admin.is-collapsed :deep(.park-logo__text) {
  display: none;
}

.park-admin__nav {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 16px;
}

.park-admin__placeholder {
  margin: 0;
  color: rgba(244, 247, 255, 0.45);
  font-size: 12px;
  letter-spacing: 0.14em;
}

.park-admin__collapse {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 44px;
  margin: 0;
  padding: 0 12px;
  border: 0;
  border-top: 1px solid rgba(244, 247, 255, 0.08);
  background: transparent;
  color: rgba(244, 247, 255, 0.78);
  font: inherit;
  letter-spacing: 0.12em;
  cursor: pointer;
}

.park-admin__collapse:hover {
  color: #f4f7ff;
  background: rgba(255, 255, 255, 0.04);
}

.park-admin__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: 64px;
  padding: 0 20px;
  line-height: 1.4;
  border-bottom: 1px solid rgba(198, 161, 91, 0.45);
}

.park-admin__header-main,
.park-admin__header-extra {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.park-admin__header-extra {
  margin-left: auto;
}

.park-admin__content {
  min-height: 240px;
  padding: 20px 22px 32px;
}
</style>

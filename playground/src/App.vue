<script setup lang="ts">
import { ref, watch } from 'vue'
import { ConfigProvider, Segmented } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { adminAntdTheme } from '@park/theme'
import { buildDemoSearch, parseDemoHash, parseDemoSearch } from '@park/mock'
import AuthDemo from './AuthDemo.vue'
import GalleryDemo from './GalleryDemo.vue'
import ScreenDemo from './ScreenDemo.vue'
import ShellDemo from './ShellDemo.vue'

const previewViews = ['auth', 'gallery', 'shells', 'screen'] as const
type PreviewView = (typeof previewViews)[number]

function readView(): PreviewView {
  const candidate = parseDemoSearch(window.location.search).view || parseDemoHash(window.location.hash).view
  return previewViews.includes(candidate as PreviewView) ? (candidate as PreviewView) : 'auth'
}

const view = ref<PreviewView>(readView())
const viewOptions = [
  { label: '登录与布局', value: 'auth' },
  { label: '组件对照', value: 'gallery' },
  { label: '页面壳', value: 'shells' },
  { label: '大屏看板', value: 'screen' },
]

watch(view, (next) => {
  const search = buildDemoSearch({ view: next }, window.location.search)
  const nextUrl = `${window.location.pathname}${search}${window.location.hash}`
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`
  if (nextUrl !== currentUrl) window.history.replaceState(null, '', nextUrl)
})
</script>

<template>
  <ConfigProvider :locale="zhCN" :theme="adminAntdTheme">
    <div class="app-root" :data-view="view">
      <div class="app-switch">
        <div class="app-switch__chip">
          <Segmented v-model:value="view" :options="viewOptions" />
        </div>
      </div>
      <AuthDemo v-if="view === 'auth'" />
      <GalleryDemo v-else-if="view === 'gallery'" />
      <ShellDemo v-else-if="view === 'shells'" />
      <ScreenDemo v-else />
    </div>
  </ConfigProvider>
</template>

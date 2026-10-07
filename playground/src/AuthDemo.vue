<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, ConfigProvider, Tag } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { screenAntdTheme } from '@park/theme'
import {
  AdminLayout,
  GlassCard,
  KpiStat,
  LoginPage,
  PageHeader,
  ScreenLayout,
} from '@park/components'
import type { LoginPayload } from '@park/components'
import {
  demoCredentials,
  getCurrentUser,
  getParkOverview,
  getRememberedUsername,
  getSession,
  login,
  logout,
} from '@park/mock'
import type { DemoCredential, MockUser } from '@park/mock'

const overview = getParkOverview('park-binjiang')
const user = ref<MockUser | null>(getCurrentUser())
const loading = ref(false)
const errorMessage = ref('')
const collapsed = ref(false)
const seed = ref({
  username: getRememberedUsername() ?? '',
  password: '',
  remember: Boolean(getRememberedUsername()),
  tick: 0,
})

const authed = computed(() => user.value !== null)
const session = computed(() => (authed.value ? getSession() : null))

function applyDemo(item: DemoCredential): void {
  seed.value = {
    username: item.username,
    password: item.password,
    remember: true,
    tick: seed.value.tick + 1,
  }
  errorMessage.value = ''
}

async function onSubmit(payload: LoginPayload): Promise<void> {
  loading.value = true
  errorMessage.value = ''
  try {
    const next = await login(payload.username, payload.password, { remember: payload.remember })
    user.value = next.user
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '登录失败'
  } finally {
    loading.value = false
  }
}

function onLogout(): void {
  logout()
  user.value = null
  const remembered = getRememberedUsername()
  seed.value = {
    username: remembered ?? '',
    password: '',
    remember: Boolean(remembered),
    tick: seed.value.tick + 1,
  }
  errorMessage.value = ''
}
</script>

<template>
  <div class="auth-demo">
    <LoginPage
      v-if="!authed"
      :key="seed.tick"
      brand="滨江云栖科创园"
      brand-subtitle="PARK OS"
      headline="进入园区工作台"
      description="用演示账号走一遍登录、布局和退出。会话留在本地，没有后端。"
      :loading="loading"
      :error-message="errorMessage"
      :initial-username="seed.username"
      :initial-password="seed.password"
      :initial-remember="seed.remember"
      @submit="onSubmit"
    >
      <template #hint>
        <p class="demo-hint-title">演示账号，点击即可填入</p>
        <div class="demo-accounts">
          <button
            v-for="item in demoCredentials"
            :key="item.username"
            type="button"
            @click="applyDemo(item)"
          >
            <strong>{{ item.roleLabel }}</strong>
            <span>{{ item.displayName }} · {{ item.username }} / {{ item.password }}</span>
          </button>
        </div>
      </template>
    </LoginPage>

    <AdminLayout
      v-else
      v-model:collapsed="collapsed"
      :title="user?.orgName"
      subtitle="ADMIN"
    >
      <template #sider>
        <div class="sider-note">
          <p>侧栏插槽</p>
          <span>导航留在各端仓库。这里只说明当前身份：{{ user?.roleLabel }}。</span>
        </div>
      </template>
      <template #header>
        <span class="crumb">布局预览</span>
      </template>
      <template #extra>
        <div class="who">
          <strong>{{ user?.displayName }}</strong>
          <em>{{ user?.title }}</em>
        </div>
        <Tag color="gold">{{ user?.roleLabel }}</Tag>
        <Button ghost @click="onLogout">退出登录</Button>
      </template>

      <PageHeader
        eyebrow="已登录"
        title="管理端布局壳"
        subtitle="顶栏、侧栏和内容都是插槽。下面不是平台页面，只用来确认登录态。"
      />
      <div class="stack">
        <div class="kpi-grid">
          <GlassCard :glow="false">
            <KpiStat label="在园企业" :value="overview?.settledCount ?? 0" unit="家" hint="样例主数据" />
          </GlassCard>
          <GlassCard :glow="false">
            <KpiStat label="楼宇" :value="overview?.buildingCount ?? 0" unit="栋" />
          </GlassCard>
          <GlassCard title="当前身份" :glow="false">
            <p class="identity">{{ user?.displayName }}</p>
            <p class="identity-role">{{ user?.roleLabel }}</p>
          </GlassCard>
        </div>
        <GlassCard title="当前会话" :glow="false">
          <dl class="session">
            <div>
              <dt>账号</dt>
              <dd>{{ user?.username }}</dd>
            </div>
            <div>
              <dt>显示名</dt>
              <dd>{{ user?.displayName }}</dd>
            </div>
            <div>
              <dt>令牌</dt>
              <dd class="token">{{ session?.token }}</dd>
            </div>
          </dl>
        </GlassCard>
        <ConfigProvider :locale="zhCN" :theme="screenAntdTheme">
          <ScreenLayout :fill="false" title="大屏布局壳" subtitle="SCREEN">
            <template #extra>
              <span>嵌在内容区，仅作壳预览</span>
            </template>
            <div class="kpi-grid">
              <GlassCard>
                <KpiStat label="占地" :value="overview?.park.areaMu ?? 0" unit="亩" />
              </GlassCard>
              <GlassCard>
                <KpiStat label="平均入驻率" :value="((overview?.occupancyAvg ?? 0) * 100).toFixed(1)" unit="%" />
              </GlassCard>
            </div>
          </ScreenLayout>
        </ConfigProvider>
      </div>
    </AdminLayout>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, ConfigProvider, Table, Tag } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { adminAntdTheme, parkSurface, screenAntdTheme } from '@park/theme'
import { AppLogo, ChartPanel, EmptyState, GlassCard, KpiStat, PageHeader } from '@park/components'
import { getParkOverview, queryBuildings, queryEnterprises } from '@park/mock'

const showSkeleton = ref(true)

const overview = computed(() => getParkOverview('park-binjiang'))
const enterprises = queryEnterprises({ parkId: 'park-binjiang', status: '在园' })
const buildings = queryBuildings({ parkId: 'park-binjiang' })
const empty = queryEnterprises({ keyword: '不存在的企业' })

const columns = [
  { title: '企业', dataIndex: 'name', key: 'name' },
  { title: '产业', dataIndex: 'industry', key: 'industry' },
  { title: '规模', dataIndex: 'scale', key: 'scale' },
  { title: '状态', dataIndex: 'status', key: 'status' },
]

const park = computed(() => overview.value?.park)
</script>

<template>
  <div class="preview-shell">
    <header>
      <h1>园区共享组件预览</h1>
      <p>左侧为管理端（浅底、墨色顶栏），右侧为大屏（深色玻璃与青辉光）。数据来自 @park/mock。</p>
      <Button type="primary" @click="showSkeleton = !showSkeleton">
        {{ showSkeleton ? '显示指标' : '显示骨架' }}
      </Button>
    </header>
    <div class="preview-grid">
      <ConfigProvider :locale="zhCN" :theme="adminAntdTheme">
        <section class="pane" data-park-theme="admin">
          <div class="pane-bar">
            <AppLogo title="滨江云栖科创园" subtitle="ADMIN" />
            <Button type="primary">入园申请</Button>
          </div>
          <div class="pane-body">
            <PageHeader
              eyebrow="Park Admin"
              :title="park?.shortName ?? '园区'"
              :subtitle="park?.description"
            >
              <template #extra>
                <Tag color="gold">{{ park?.status }}</Tag>
                <Tag>{{ park?.type }}</Tag>
              </template>
            </PageHeader>
            <div class="stack">
              <div class="kpi-grid">
                <GlassCard :glow="false"><KpiStat label="在园企业" :value="overview?.settledCount ?? 0" unit="家" :trend="4.2" hint="较上月" /></GlassCard>
                <GlassCard :glow="false"><KpiStat label="楼宇" :value="overview?.buildingCount ?? 0" unit="栋" hint="研发与实验" /></GlassCard>
                <GlassCard :glow="false"><KpiStat label="平均入驻率" :value="((overview?.occupancyAvg ?? 0) * 100).toFixed(1)" unit="%" :trend="1.6" /></GlassCard>
              </div>
              <GlassCard title="在园企业" :glow="false">
                <Table
                  :columns="columns"
                  :data-source="enterprises.items"
                  :pagination="false"
                  row-key="id"
                  size="small"
                />
              </GlassCard>
              <GlassCard title="加载占位" :glow="false">
                <div class="kpi-grid">
                  <KpiStat label="在园企业" :value="overview?.settledCount ?? 0" unit="家" :loading="showSkeleton" />
                  <ChartPanel title="近七日能耗" :height="120" :loading="showSkeleton" />
                </div>
              </GlassCard>
              <GlassCard title="无匹配结果" :glow="false">
                <EmptyState
                  v-if="empty.total === 0"
                  variant="search"
                  title="没有匹配的企业"
                  description="换一个关键词，或清空筛选后再查。"
                />
              </GlassCard>
            </div>
          </div>
        </section>
      </ConfigProvider>

      <ConfigProvider :locale="zhCN" :theme="screenAntdTheme">
        <section class="pane" data-park-theme="screen">
          <div class="pane-bar">
            <AppLogo title="滨江云栖科创园" subtitle="SCREEN" />
            <Button type="primary">实时刷新</Button>
          </div>
          <div class="pane-body">
            <PageHeader
              eyebrow="Cyber Screen"
              title="园区运行态势"
              subtitle="深色玻璃卡片、青蓝辉光边框，供大屏仓库直接套用。"
            >
              <template #extra>
                <Tag color="cyan">{{ park?.city }}</Tag>
              </template>
            </PageHeader>
            <div class="stack">
              <div class="kpi-grid">
                <GlassCard><KpiStat label="占地" :value="park?.areaMu ?? 0" unit="亩" :trend="0" hint="规划用地" /></GlassCard>
                <GlassCard><KpiStat label="在园企业" :value="overview?.settledCount ?? 0" unit="家" :trend="4.2" /></GlassCard>
                <GlassCard><KpiStat label="平均入驻率" :value="((overview?.occupancyAvg ?? 0) * 100).toFixed(1)" unit="%" :trend="-0.8" /></GlassCard>
              </div>
              <GlassCard title="楼宇占用">
                <ul class="building-list">
                  <li v-for="item in buildings.items" :key="item.id">
                    <span>
                      <strong>{{ item.name }}</strong>
                      <span> · {{ item.usage }} · {{ item.floors }} 层</span>
                    </span>
                    <span>{{ Math.round(item.occupancyRate * 100) }}%</span>
                  </li>
                </ul>
              </GlassCard>
              <GlassCard title="加载占位">
                <div class="kpi-grid">
                  <KpiStat label="在园企业" :value="overview?.settledCount ?? 0" unit="家" :trend="4.2" :loading="showSkeleton" />
                  <ChartPanel title="近七日能耗" caption="骨架与曲线共用画布高度" :height="120" :loading="showSkeleton" />
                </div>
              </GlassCard>
              <GlassCard title="空态">
                <EmptyState variant="done" title="暂无告警" description="今日没有新的设备或能耗告警。" />
              </GlassCard>
            </div>
          </div>
        </section>
      </ConfigProvider>
    </div>
    <section class="visual-band">
      <div class="visual-stage" data-park-theme="admin">
        <div :class="[parkSurface.ink, 'visual-ink']">
          <p>管理端墨色条</p>
          <strong>靛蓝主色，金线收边</strong>
          <i :class="parkSurface.accentLine" />
        </div>
      </div>
      <div class="visual-stage" data-park-theme="screen">
        <div :class="[parkSurface.glass, parkSurface.glassGlow, 'visual-glass']">
          <p>大屏玻璃面</p>
          <strong>青辉光与模糊底</strong>
          <i :class="parkSurface.accentLine" />
        </div>
      </div>
    </section>
  </div>
</template>

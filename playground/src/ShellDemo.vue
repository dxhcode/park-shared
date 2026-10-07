<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import {
  Button,
  ConfigProvider,
  Descriptions,
  DescriptionsItem,
  Form,
  FormItem,
  Input,
  Segmented,
  Select,
  Table,
  Tag,
  message,
} from 'ant-design-vue'
import { adminAntdTheme, parkMotion, screenAntdTheme } from '@park/theme'
import {
  DetailPageShell,
  DetailSection,
  EmptyState,
  FormPageShell,
  ListMotion,
  ListPageShell,
  RouteMotion,
} from '@park/components'
import type { EmptyVariant } from '@park/components'
import { getWorkOrder, mockQuery, parks, queryNotices, queryVisits, queryWorkOrders } from '@park/mock'
import type { TicketPriority, TicketStatus, WorkOrder } from '@park/mock'

type Scene = 'list' | 'detail' | 'form'
type ListMode = 'card' | 'table'

const scene = ref<Scene>('list')
const motionName = ref<'park-route-fade' | 'park-route-slide'>(parkMotion.routeFade)
const listMode = ref<ListMode>('card')
const keyword = ref('')
const parkId = ref('park-binjiang')
const status = ref<TicketStatus | undefined>(undefined)
const page = ref(1)
const pageSize = ref(4)
const loading = ref(false)
const forceEmpty = ref(false)
const submitting = ref(false)
const selectedId = ref<string | null>(null)
const variant = ref<EmptyVariant>('search')

const scenes = [
  { label: '工单列表', value: 'list' as const },
  { label: '工单详情', value: 'detail' as const },
  { label: '新建工单', value: 'form' as const },
]

const motionOptions = [
  { label: '淡入', value: parkMotion.routeFade },
  { label: '侧滑', value: parkMotion.routeSlide },
]

const modeOptions = [
  { label: '卡片', value: 'card' },
  { label: '表格', value: 'table' },
]

const parkOptions = computed(() => [
  { label: '全部园区', value: '' },
  ...parks.map((item) => ({ label: item.shortName, value: item.id })),
])

const statusOptions = [
  { label: '待处理', value: '待处理' },
  { label: '处理中', value: '处理中' },
  { label: '已完成', value: '已完成' },
  { label: '已关闭', value: '已关闭' },
]

const variantOptions = [
  { label: '无数据', value: 'empty' },
  { label: '无结果', value: 'search' },
  { label: '失败', value: 'error' },
  { label: '无权限', value: 'locked' },
  { label: '已完成', value: 'done' },
]

const variantCopy: Record<EmptyVariant, { title: string; description: string; primary: string; secondary: string }> = {
  empty: {
    title: '暂无数据',
    description: '还没有可展示的记录，可以先新建一条。',
    primary: '新建',
    secondary: '刷新',
  },
  search: {
    title: '没有匹配结果',
    description: '换一个关键词，或清空筛选后再查。',
    primary: '清空筛选',
    secondary: '返回列表',
  },
  error: {
    title: '内容加载失败',
    description: '网络波动，请稍后再试。',
    primary: '重试',
    secondary: '返回',
  },
  locked: {
    title: '暂无查看权限',
    description: '当前账号看不到这块内容。',
    primary: '申请权限',
    secondary: '返回首页',
  },
  done: {
    title: '全部处理完成',
    description: '没有待办事项。',
    primary: '查看历史',
    secondary: '',
  },
}

const formState = reactive({
  title: '',
  category: '设施',
  priority: '中' as TicketPriority,
  location: '',
  detail: '',
})

const categoryOptions = ['设施', '安防', '信息化', '安全'].map((value) => ({ label: value, value }))
const priorityOptions = ['低', '中', '高'].map((value) => ({ label: value, value }))

const result = computed(() =>
  queryWorkOrders({
    parkId: parkId.value || undefined,
    keyword: keyword.value,
    status: status.value,
    page: page.value,
    pageSize: pageSize.value,
  }),
)

const isEmpty = computed(() => forceEmpty.value || result.value.total === 0)
const current = computed(() => (selectedId.value ? getWorkOrder(selectedId.value) : undefined))
const relatedVisits = computed(() =>
  current.value ? queryVisits({ parkId: current.value.parkId, pageSize: 3 }).items : [],
)
const relatedNotices = computed(() =>
  current.value ? queryNotices({ parkId: current.value.parkId, status: '已发布', pageSize: 2 }).items : [],
)

const columns = [
  { title: '工单', dataIndex: 'title', key: 'title' },
  { title: '类别', dataIndex: 'category', key: 'category' },
  { title: '优先级', dataIndex: 'priority', key: 'priority' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '位置', dataIndex: 'location', key: 'location' },
]

watch([keyword, status, parkId], () => {
  page.value = 1
})

function parkName(id: string): string {
  return parks.find((item) => item.id === id)?.shortName ?? id
}

function statusColor(value: TicketStatus): string {
  if (value === '待处理') return 'gold'
  if (value === '处理中') return 'blue'
  if (value === '已完成') return 'green'
  return 'default'
}

function priorityColor(value: TicketPriority): string {
  if (value === '高') return 'red'
  if (value === '中') return 'orange'
  return 'default'
}

function onStatus(value: unknown): void {
  status.value = value ? (value as TicketStatus) : undefined
}

function resetFilters(): void {
  keyword.value = ''
  status.value = undefined
  parkId.value = 'park-binjiang'
  forceEmpty.value = false
  page.value = 1
}

async function refresh(): Promise<void> {
  loading.value = true
  await mockQuery(true, 320)
  loading.value = false
}

function openDetail(id: string): void {
  selectedId.value = id
  scene.value = 'detail'
}

function openScene(next: Scene): void {
  if (next === 'detail' && !selectedId.value) {
    selectedId.value = result.value.items[0]?.id ?? null
  }
  if (next === 'form') {
    formState.title = ''
    formState.category = '设施'
    formState.priority = '中'
    formState.location = ''
    formState.detail = ''
  }
  scene.value = next
}

function editCurrent(): void {
  const order = current.value
  if (!order) return
  formState.title = order.title
  formState.category = order.category
  formState.priority = order.priority
  formState.location = order.location
  formState.detail = `${order.requester} 发起，当前处理人 ${order.assignee}。`
  scene.value = 'form'
}

function onTableRow(record: WorkOrder) {
  return {
    onClick: () => openDetail(record.id),
  }
}

async function onSubmit(): Promise<void> {
  if (!formState.title.trim()) {
    message.warning('请填写工单标题')
    return
  }
  submitting.value = true
  await mockQuery(true, 360)
  submitting.value = false
  message.success('已保存（演示，未写入数据）')
  scene.value = 'list'
}

function onVariantAction(action: string): void {
  message.info(`演示操作：${action}`)
}
</script>

<template>
  <div class="shell-demo">
    <header class="shell-demo__intro">
      <h1>列表、详情与表单</h1>
      <p>
        页面壳是薄包装，表格和表单仍用 ant-design-vue。切换时走淡入或侧滑，卡片列表入场，导航当前项有一道高亮。
      </p>
    </header>

    <div class="shell-stage" data-park-theme="admin">
      <aside class="shell-nav">
        <p>页面</p>
        <button
          v-for="item in scenes"
          :key="item.value"
          type="button"
          class="park-menu-pulse"
          :class="{ 'is-current': scene === item.value }"
          @click="openScene(item.value)"
        >
          {{ item.label }}
        </button>
        <p>切换</p>
        <Segmented v-model:value="motionName" :options="motionOptions" />
      </aside>

      <RouteMotion :name="motionName">
        <ListPageShell
          v-if="scene === 'list'"
          key="list"
          eyebrow="Work Orders"
          title="服务工单"
          subtitle="筛选、卡片或表格、分页和空态都收在 ListPageShell 里。"
          :loading="loading"
          :empty="isEmpty"
          empty-variant="search"
          empty-title="没有匹配的工单"
          empty-description="换一个状态或关键词，也可以直接看空态。"
          empty-primary-text="清空条件"
          empty-secondary-text="恢复云栖科创"
          :total="result.total"
          :page="page"
          :page-size="pageSize"
          :page-size-options="['4', '8', '12']"
          @update:page="page = $event"
          @update:page-size="pageSize = $event"
          @empty-primary="resetFilters"
          @empty-secondary="resetFilters"
        >
          <template #extra>
            <Button @click="forceEmpty = !forceEmpty">{{ forceEmpty ? '恢复列表' : '看空态' }}</Button>
            <Button @click="refresh">刷新</Button>
            <Button type="primary" @click="openScene('form')">新建工单</Button>
          </template>
          <template #filters>
            <div class="shell-filters">
              <Select v-model:value="parkId" :options="parkOptions" style="width: 150px" />
              <Select
                :value="status"
                allow-clear
                placeholder="全部状态"
                :options="statusOptions"
                style="width: 140px"
                @update:value="onStatus"
              />
              <Input v-model:value="keyword" allow-clear placeholder="标题、位置、处理人" style="width: 220px" />
              <Segmented v-model:value="listMode" :options="modeOptions" />
            </div>
          </template>
          <ListMotion v-if="listMode === 'card'" tag="ul" class="order-cards">
            <li v-for="item in result.items" :key="item.id">
              <button type="button" class="order-card" @click="openDetail(item.id)">
                <span>
                  <strong>{{ item.title }}</strong>
                  <em>{{ item.location }} · {{ item.assignee }}</em>
                </span>
                <span class="order-card__tags">
                  <Tag :color="priorityColor(item.priority)">{{ item.priority }}</Tag>
                  <Tag :color="statusColor(item.status)">{{ item.status }}</Tag>
                </span>
              </button>
            </li>
          </ListMotion>
          <Table
            v-else
            :columns="columns"
            :data-source="result.items"
            :pagination="false"
            row-key="id"
            size="middle"
            :custom-row="onTableRow"
            :row-class-name="() => parkMotion.row"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'status'">
                <Tag :color="statusColor(record.status)">{{ record.status }}</Tag>
              </template>
              <template v-else-if="column.key === 'priority'">
                <Tag :color="priorityColor(record.priority)">{{ record.priority }}</Tag>
              </template>
            </template>
          </Table>
        </ListPageShell>

        <DetailPageShell
          v-else-if="scene === 'detail'"
          key="detail"
          eyebrow="Detail"
          :title="current?.title ?? '未选择工单'"
          :subtitle="current ? `${parkName(current.parkId)} · ${current.location}` : '从列表点进一条工单。'"
          back-text="返回列表"
          @back="scene = 'list'"
        >
          <template v-if="current" #extra>
            <Button type="primary" @click="editCurrent">编辑</Button>
          </template>
          <template v-if="current" #meta>
            <Tag :color="priorityColor(current.priority)">优先级 {{ current.priority }}</Tag>
            <Tag :color="statusColor(current.status)">{{ current.status }}</Tag>
            <Tag>{{ current.category }}</Tag>
          </template>
          <EmptyState
            v-if="!current"
            variant="empty"
            title="还没有选中工单"
            description="回到列表，点一条卡片或表格行。"
            primary-text="返回列表"
            @primary="scene = 'list'"
          />
          <template v-else>
            <DetailSection title="工单信息" hint="字段来自 @park/mock 的 workOrders。">
              <Descriptions :column="2" size="small" bordered>
                <DescriptionsItem label="编号">{{ current.id }}</DescriptionsItem>
                <DescriptionsItem label="创建日期">{{ current.createdAt }}</DescriptionsItem>
                <DescriptionsItem label="发起人">{{ current.requester }}</DescriptionsItem>
                <DescriptionsItem label="处理人">{{ current.assignee }}</DescriptionsItem>
                <DescriptionsItem label="位置">{{ current.location }}</DescriptionsItem>
                <DescriptionsItem label="园区">{{ parkName(current.parkId) }}</DescriptionsItem>
              </Descriptions>
            </DetailSection>
            <DetailSection title="同园区来访" hint="visits 列表示例，方便详情页拼一块关联列表。">
              <ul v-if="relatedVisits.length" class="related-list">
                <li v-for="item in relatedVisits" :key="item.id">
                  <span>{{ item.visitDate }} · {{ item.company }} · {{ item.purpose }}</span>
                  <Tag>{{ item.status }}</Tag>
                </li>
              </ul>
              <EmptyState v-else variant="empty" title="暂无来访" description="这个园区还没有访客记录。" />
            </DetailSection>
            <DetailSection title="已发布公告" hint="notices 列表示例。">
              <ul v-if="relatedNotices.length" class="related-list">
                <li v-for="item in relatedNotices" :key="item.id">
                  <span>
                    <strong>{{ item.title }}</strong>
                    <em>{{ item.summary }}</em>
                  </span>
                  <Tag :color="item.level === '紧急' ? 'red' : item.level === '重要' ? 'gold' : 'blue'">
                    {{ item.level }}
                  </Tag>
                </li>
              </ul>
              <EmptyState v-else variant="done" title="暂无公告" description="没有已发布的公告。" />
            </DetailSection>
          </template>
        </DetailPageShell>

        <FormPageShell
          v-else
          key="form"
          eyebrow="Form"
          title="登记工单"
          subtitle="底部操作条吸底。校验和提交由页面自己处理，壳只负责摆放。"
          :submitting="submitting"
          submit-text="提交"
          cancel-text="取消"
          @submit="onSubmit"
          @cancel="scene = 'list'"
        >
          <Form class="shell-form" layout="vertical" :model="formState">
            <FormItem class="is-wide" label="标题" required>
              <Input v-model:value="formState.title" placeholder="例如：A1 楼空调异响" />
            </FormItem>
            <FormItem label="类别">
              <Select v-model:value="formState.category" :options="categoryOptions" />
            </FormItem>
            <FormItem label="优先级">
              <Select v-model:value="formState.priority" :options="priorityOptions" />
            </FormItem>
            <FormItem class="is-wide" label="位置">
              <Input v-model:value="formState.location" placeholder="楼宇或门岗" />
            </FormItem>
            <FormItem class="is-wide" label="说明">
              <Input.TextArea v-model:value="formState.detail" :rows="4" placeholder="补充说明，仅作演示" />
            </FormItem>
          </Form>
        </FormPageShell>
      </RouteMotion>
    </div>

    <section class="empty-lab">
      <header>
        <div>
          <h2>空态</h2>
          <p>同一套插画。管理端是墨色圆标和金环，大屏是玻璃底和青辉光。</p>
        </div>
        <Segmented v-model:value="variant" :options="variantOptions" />
      </header>
      <div class="empty-lab__grid">
        <ConfigProvider :theme="adminAntdTheme">
          <div class="empty-lab__pane" data-park-theme="admin">
            <p>管理端</p>
            <RouteMotion :name="parkMotion.routeFade">
              <EmptyState
                :key="variant"
                tone="admin"
                :variant="variant"
                :title="variantCopy[variant].title"
                :description="variantCopy[variant].description"
                :primary-text="variantCopy[variant].primary"
                :secondary-text="variantCopy[variant].secondary"
                @primary="onVariantAction(variantCopy[variant].primary)"
                @secondary="onVariantAction(variantCopy[variant].secondary)"
              />
            </RouteMotion>
          </div>
        </ConfigProvider>
        <ConfigProvider :theme="screenAntdTheme">
          <div class="empty-lab__pane" data-park-theme="screen">
            <p>大屏</p>
            <RouteMotion :name="parkMotion.routeFade">
              <EmptyState
                :key="variant"
                tone="screen"
                :variant="variant"
                :title="variantCopy[variant].title"
                :description="variantCopy[variant].description"
                :primary-text="variantCopy[variant].primary"
                :secondary-text="variantCopy[variant].secondary"
                @primary="onVariantAction(variantCopy[variant].primary)"
                @secondary="onVariantAction(variantCopy[variant].secondary)"
              />
            </RouteMotion>
          </div>
        </ConfigProvider>
      </div>
    </section>
  </div>
</template>

# park-shared

园区平台的共享前端库。`park-industry`、`park-campus`、`park-gov` 从这里拿主题、组件、登录壳、布局壳、页面壳、大屏看板积木和模拟数据。各端自己的菜单、页面和真实接口仍留在各自仓库。

## 进度

- D1：主题、基础组件、园区主数据
- D2（2026-10-02）：登录壳、布局壳、本地鉴权模拟
- D3（2026-10-03）：空态变体、列表 / 详情 / 表单页面壳、页面动效，以及公告、工单、来访列表示例
- D4（2026-10-04）：大屏跑马灯、动画指标、图表壳、示意地图，以及看板模拟数据
- D5（2026-10-04）：视觉令牌对齐、玻璃 / 墨色 / 骨架工具类，以及演示路线。用法见 [DEMO.md](./DEMO.md)，阶段一缺口见 [GAPS.md](./GAPS.md)

## 包

| 包 | 内容 |
| --- | --- |
| `@park/theme` | 管理端 / 大屏 CSS 变量、ant-design-vue 4 的 `ThemeConfig`、`motion.css`、`surface.css`，以及大屏 ECharts option |
| `@park/components` | 页头、指标、空态、页面壳、登录壳、布局壳，加上大屏跑马灯、图表壳和示意地图 |
| `@park/mock` | 园区、企业、楼宇、公告 / 工单 / 来访、大屏指标与曲线；分页与搜索；演示账号、本地会话、演示深链和讲解路线 |

`playground` 是本地对照预览，不是平台应用。默认先走登录，进入布局壳后再退出。右上角可切到「组件对照」「页面壳」或「大屏看板」。地址栏可用 `?view=screen&park=park-binjiang`。

## 本地命令

需要 Node.js 20+ 与 pnpm 10。

```bash
pnpm install
pnpm build
pnpm typecheck
pnpm smoke
pnpm dev
```

`pnpm dev` 打开预览页。组件用 Vite library 模式打成 ESM；主题和模拟数据用 `tsc` 产出声明文件。

## 主题

两套令牌都在 `packages/theme/src/theme.css`：

- **admin**：浅色内容区，靛蓝主色，顶栏和强调色用墨色，细金线做点缀。选择器是 `:root` 和 `[data-park-theme="admin"]`。
- **screen**：深海军蓝底、青蓝辉光、玻璃拟态和发光描边。选择器是 `[data-park-theme="screen"]`，也可以加类名 `park-screen-bg`。

组件读的是 `--park-color-*`、`--park-glass-*`、`--park-glow`、`--park-sider-bg`、`--park-header-bg`、`--park-trend-*`、`--park-ink` 这些 CSS 变量，不绑定某一端。图表色是 `--park-chart-1` 到 `--park-chart-6`：管理端偏靛蓝和金，大屏偏青蓝。

`parkSurface` 对应 `surface.css` 里的类名，可直接加在各端自己的节点上：`park-glass-surface`、`park-glass-glow`、`park-ink-panel`、`park-accent-line`，以及 `park-skeleton`、`park-skeleton-kpi`、`park-skeleton-chart`。`theme.css` 会带上这份样式；组件包的 `style.css` 里也有。`KpiStat`、`ScreenKpi`、`ChartPanel` 另有 `loading`，为真时用同一套骨架。

管理端入口示例：

```ts
import { createApp } from 'vue'
import { ConfigProvider } from 'ant-design-vue'
import { adminAntdTheme, applyParkTheme } from '@park/theme'
import '@park/theme/theme.css'
import '@park/components/style.css'

applyParkTheme('admin')

// 模板里：
// <ConfigProvider :theme="adminAntdTheme">...</ConfigProvider>
```

大屏把 `applyParkTheme('admin')` 换成 `applyParkTheme('screen')`，`adminAntdTheme` 换成 `screenAntdTheme`。侧栏底色用 CSS 变量 `--park-sider-bg`，不要只依赖 Ant Design 的组件令牌。当前锁定的 ant-design-vue 4.2 还没有 `cssVar` 主题字段，跨端换肤以这份 CSS 变量为准。

## 组件

```ts
import {
  AdminLayout,
  AppLogo,
  DetailPageShell,
  DetailSection,
  EmptyState,
  FormPageShell,
  GlassCard,
  KpiStat,
  ChartPanel,
  KpiTicker,
  ListMotion,
  ListPageShell,
  LoginForm,
  LoginPage,
  MapPanel,
  PageHeader,
  RouteMotion,
  ScreenChart,
  ScreenKpi,
  ScreenLayout,
} from '@park/components'
import type { EmptyTone, EmptyVariant, LoginPayload, MapMarker, TickerItem } from '@park/components'
```

记得同时引入 `@park/components/style.css`。默认文案是中文，例如空态「暂无数据」、登录按钮「进入工作台」。`@park/components` 把 `vue` 和 `ant-design-vue` 视为 peer。动效类名已经打进这份 `style.css`；只想要 CSS 时也可以单独引 `@park/theme/motion.css`。

| 组件 | 说明 |
| --- | --- |
| `AppLogo` | 标识和名称。`title` / `subtitle`，可用 `mark` 插槽换图标 |
| `PageHeader` | 页头。必填 `title`，可选 `eyebrow`、`subtitle` 和 `extra` 插槽 |
| `GlassCard` | 玻璃卡片。`title`、`glow`，正文默认插槽，右侧 `extra` |
| `EmptyState` | 空态。插画、标题、说明，主按钮和次按钮 |
| `KpiStat` | 指标。`label`、`value`、`unit`、`trend`（百分比）、`hint` |
| `ListPageShell` | 列表页。筛选插槽、默认插槽放表格或卡片、分页、空态 |
| `DetailPageShell` | 详情页。页头操作、`meta` 插槽、分段放默认插槽 |
| `DetailSection` | 详情里的一块。`title`、`hint`，右侧 `extra` |
| `FormPageShell` | 表单页。默认插槽放表单，底部操作可吸底 |
| `RouteMotion` | 路由或视图切换。`name` 用淡入或侧滑 |
| `ListMotion` | 列表入场。包住带 `key` 的子节点 |
| `LoginForm` | 账号、密码、记住账号。校验通过后抛出 `submit` |
| `LoginPage` | 深色入口加玻璃卡片，内部放着 `LoginForm` |
| `AdminLayout` | 管理端壳：侧栏、顶栏、内容插槽。底色走主题变量 |
| `ScreenLayout` | 大屏壳：顶栏和内容插槽，自带 `data-park-theme="screen"` |
| `KpiTicker` | 玻璃跑马灯。指标或告警条目横向滚动，悬停暂停 |
| `ScreenKpi` | 大屏指标。数字滚入，左侧光点脉冲 |
| `ChartPanel` | 玻璃图表壳。标题、说明、画布插槽，边框沿用 `GlassCard` 辉光 |
| `ScreenChart` | 不依赖图表库的折线 / 柱状 / 环形图，给预览和大屏兜底 |
| `MapPanel` | 三园示意地图。点击点位抛出 `select`，不接地图密钥 |

### 空态

`variant` 决定插画：`empty`、`search`、`error`、`locked`、`done`。`tone` 为 `auto` 时跟祖先的 `data-park-theme`；写成 `admin` 或 `screen` 时，节点自己套那套变量。管理端是白底、墨色圆标和金环；大屏是玻璃底和青辉光。`icon` 插槽可换掉插画。

`primaryText` / `secondaryText` 会渲染按钮，并抛出 `primary`、`secondary`。也可以用同名插槽替换。原来的 `action` 插槽仍可用。

```vue
<EmptyState
  variant="search"
  title="没有匹配的企业"
  description="换一个关键词，或清空筛选后再查。"
  primary-text="清空筛选"
  secondary-text="返回列表"
  @primary="reset"
  @secondary="back"
/>
```

### 页面壳

三个壳都不包含菜单，也不发请求。表格、描述列表和表单控件仍由各端用 ant-design-vue 放进插槽。

```vue
<ListPageShell
  eyebrow="企业"
  title="在园企业"
  :loading="loading"
  :empty="page.total === 0"
  empty-variant="search"
  empty-title="没有匹配的企业"
  empty-primary-text="清空筛选"
  :total="page.total"
  v-model:page="pageNo"
  v-model:page-size="pageSize"
  @empty-primary="reset"
>
  <template #filters>
    <a-input v-model:value="keyword" placeholder="企业名称" allow-clear />
  </template>
  <template #extra>
    <a-button type="primary">新建</a-button>
  </template>
  <a-table :columns="columns" :data-source="page.items" :pagination="false" row-key="id" />
</ListPageShell>
```

`v-model:page` 和 `v-model:page-size` 对应分页。`empty` 为真时展示空态并藏起分页。想整块换掉空态，用 `empty` 插槽。

```vue
<DetailPageShell title="星澜智造科技有限公司" back-text="返回列表" @back="back">
  <template #extra>
    <a-button type="primary">编辑</a-button>
  </template>
  <template #meta>
    <a-tag>在园</a-tag>
  </template>
  <DetailSection title="工商信息">
    <a-descriptions :column="2" bordered>...</a-descriptions>
  </DetailSection>
</DetailPageShell>
```

```vue
<FormPageShell title="入园申请" :submitting="submitting" @submit="onSubmit" @cancel="back">
  <a-form layout="vertical" :model="formState">...</a-form>
</FormPageShell>
```

`FormPageShell` 的按钮只抛 `submit` 和 `cancel`，不包一层 `Form`，校验留在页面里。`sticky` 默认 true，操作条吸在底部。用 `actions` 插槽可以换掉这两个按钮。

### 动效

```ts
import { parkMotion } from '@park/theme'
import '@park/theme/motion.css'
```

已经引用 `@park/components/style.css` 时，可以不重复引 `motion.css`。系统开了「减少动态效果」时，过渡和入场动画会停掉，当前项的高亮还在。

| 名称 | 类名 | 用法 |
| --- | --- | --- |
| `parkMotion.routeFade` | `park-route-fade` | 淡入并轻微位移。交给 `RouteMotion` |
| `parkMotion.routeSlide` | `park-route-slide` | 左右侧滑。交给 `RouteMotion` |
| `parkMotion.list` | `park-list` | `ListMotion` 使用的 TransitionGroup 名称 |
| `parkMotion.menuPulse` | `park-menu-pulse` | 加在菜单项上。选中态再加 `is-current`，或依赖 `ant-menu-item-selected` |
| `parkMotion.row` | `park-row` | 表格行 class，入场时错开出现 |

```vue
<RouterView v-slot="{ Component, route }">
  <RouteMotion :name="parkMotion.routeFade">
    <component :is="Component" :key="route.path" />
  </RouteMotion>
</RouterView>

<ListMotion tag="ul">
  <li v-for="item in items" :key="item.id">{{ item.name }}</li>
</ListMotion>

<a-menu-item class="park-menu-pulse">工作台</a-menu-item>
```

`RouteMotion` 使用 `mode="out-in"`。直接写 `<Transition>` 时，`name` 用上表的类名即可。

### 登录壳

`LoginPage` 自己铺深色背景和金、靛光斑，卡片区域固定为管理端浅色玻璃，方便在深底上填写。`submit` 的载荷是 `LoginPayload`：`username`、`password`、`remember`。

```vue
<LoginPage
  brand="滨江云栖科创园"
  :loading="loading"
  :error-message="errorMessage"
  :initial-username="remembered"
  @submit="onSubmit"
>
  <template #hint>演示账号见 @park/mock 的 demoCredentials</template>
</LoginPage>
```

`hint` 插槽放在按钮下方。`points` 插槽可换掉左侧三条说明。组件不内置口令，也不发请求。

### 布局壳

`AdminLayout` 不带菜单。侧栏用 `sider` 插槽，顶栏左侧用 `header`，右侧用 `extra`，页面放默认插槽。`v-model:collapsed` 控制收起。侧栏背景是 `--park-sider-bg`，顶栏是 `--park-header-bg`。

```vue
<AdminLayout v-model:collapsed="collapsed" title="滨江云栖科创园" subtitle="ADMIN">
  <template #sider>导航由各端自己放入</template>
  <template #extra>
    <span>{{ user?.displayName }}</span>
    <button type="button" @click="onLogout">退出登录</button>
  </template>
  <PageHeader title="工作台" />
</AdminLayout>
```

`ScreenLayout` 适合大屏仓库套一层顶栏。`fill` 默认铺满视口；嵌进别的布局时设 `:fill="false"`。

### 大屏看板

这些积木按 `data-park-theme="screen"` 来做青辉光和玻璃底。管理端令牌不动。`ChartPanel` 只提供外壳，平台自己把 ECharts 画布放进默认插槽。没有装 ECharts 时，可以用 `ScreenChart` 先把曲线画出来。

```vue
<KpiTicker :items="alerts" label="告警滚动" />

<ChartPanel title="近七日能耗" caption="单位 kWh" :height="200">
  <template #extra>可交给 ECharts</template>
  <ScreenChart kind="line" :categories="energy.categories" :series="energy.series" />
</ChartPanel>

<MapPanel :markers="markers" :active-id="parkId" @select="parkId = $event" />

<ScreenKpi label="在园企业" :value="2" unit="家" :trend="4.2" hint="较上月" />
```

`KpiTicker` 的 `items` 是 `TickerItem`：`id`、`label`，可选 `value`、`unit`、`time`、`level`（`指标` / `提示` / `预警` / `告警`）。`duration` 是一整圈的秒数。系统开了「减少动态效果」时停掉滚动，改成普通换行。

`ScreenKpi` 的 `value` 是数字。`countUp` 默认从 0 滚到当前值，再次变化时从上一个值接着滚。`decimals` 控制小数位。`pulse` 控制左侧光点。

`MapPanel` 的 `markers` 是 `MapMarker`。`x` / `y` 是示意底图上的百分比。`select` 抛出被点中的 `id`。底图是虚构的滨江云栖、临港智造、光谷生命，不是测绘地图。

`@park/theme` 另外导出三份 option，字段按 ECharts 的 `setOption` 来写，本仓库不安装 ECharts：

```ts
import { screenBarOption, screenLineOption, screenPieOption } from '@park/theme'

const line = screenLineOption(energy.categories, energy.series)
const bar = screenBarOption(flow.categories, flow.series)
const pie = screenPieOption(industry.categories.map((name, index) => ({
  name,
  value: industry.series[0]?.data[index] ?? 0,
})))
// chart.setOption(line)
```

## 模拟数据与登录会话

```ts
import {
  buildings,
  demoCredentials,
  enterprises,
  buildDemoHash,
  buildDemoSearch,
  getCurrentUser,
  getParkDashboard,
  getParkOverview,
  getRememberedUsername,
  getWorkOrder,
  isAuthenticated,
  listFixtures,
  login,
  logout,
  mockQuery,
  parks,
  parseDemoHash,
  parseDemoSearch,
  queryAlertTicker,
  queryBuildings,
  queryChartSeries,
  queryDashboardKpis,
  queryEnterprises,
  queryNotices,
  queryVisits,
  queryWorkOrders,
} from '@park/mock'

const page = queryEnterprises({ parkId: 'park-binjiang', status: '在园', page: 1, pageSize: 10 })
const overview = getParkOverview('park-binjiang')
const orders = queryWorkOrders({ parkId: 'park-binjiang', status: '处理中', page: 1, pageSize: 10 })
const notices = queryNotices({ keyword: '门禁', status: '已发布' })
const visits = queryVisits({ parkId: 'park-binjiang', status: '待审核' })
const oneOrder = getWorkOrder('wo-bj-ac')
const pending = mockQuery(page)

const session = await login('admin', 'admin123', { remember: true })
if (isAuthenticated()) {
  console.log(getCurrentUser()?.roleLabel)
}
logout()
```

内置三个园区：滨江云栖科创园、临港智造产业园、光谷生命科学园，以及对应企业和楼宇。统一社会信用代码和电话都是虚构的。`mockQuery` 只是加一点延迟，方便先接异步界面。

D3 另有三组通用列表，同样是虚构数据，挂在 `listFixtures` 上，也有单独的查询函数：

| 数据 | 查询 | 说明 |
| --- | --- | --- |
| `notices` | `queryNotices` / `getNotice` | 公告。级别普通 / 重要 / 紧急，状态已发布 / 草稿 |
| `workOrders` | `queryWorkOrders` / `getWorkOrder` | 服务工单。优先级、状态、位置 |
| `visits` | `queryVisits` / `getVisit` | 来访预约。访客、单位、事由、车牌 |

查询参数都是可选的 `parkId`、`keyword`、状态，以及 `page` / `pageSize`。关键字匹配标题、处理人、单位等文本字段。没有命中时 `total` 为 0，方便直接接空态。

D4 的看板数据挂在 `dashboardFixtures` 上。在园企业数、入驻率、未关闭告警、2026-10-04 的预约，以及产业从业人数，都跟上面的园区 / 企业 / 工单 / 来访对齐。在岗人数、能耗负荷、人流和产值是原型运行数。

| 数据 | 查询 | 说明 |
| --- | --- | --- |
| `dashboardKpis` | `queryDashboardKpis` / `getParkDashboard` | 六个指标：在园企业、入驻率、在岗、负荷、今日预约、未关闭告警 |
| `alertTickerItems` | `queryAlertTicker` | 跑马灯。级别提示 / 预警 / 告警，`sourceId` 指向工单或公告 |
| `chartSeries` | `queryChartSeries` / `getChartSeries` | 能耗、人流、产值、产业。`metric` 用这四个中文名 |
| `mapMarkers` | `getParkDashboard(id).marker` | 三园示意坐标，自西向东 |

```ts
const board = getParkDashboard('park-binjiang')
const alerts = queryAlertTicker({ parkId: 'park-binjiang', level: '告警' })
const energy = queryChartSeries({ parkId: 'park-binjiang', metric: '能耗' })[0]
```

`getParkDashboard` 在园区不存在时返回 `undefined`。

演示页如果要在地址栏记住视图和园区，用这四个函数，不引入路由：

```ts
const search = buildDemoSearch({ view: 'screen', parkId: 'park-lingang' }, window.location.search)
const hash = buildDemoHash({ view: 'screen', parkId: 'park-lingang', focus: 'map' })
parseDemoSearch(search).parkId
parseDemoHash('#screen/park-lingang/map').focus
```

`buildDemoSearch` 只改传入的字段。空字符串会删掉该参数，没传的字段留在原来的 query 里。锚点格式是 `#视图/园区/焦点`；锚点里带 `=` 时按 query 解析。

整段讲解用 `demoBeats`、`demoStory.beatsFor(...)`、`demoJump` / `demoBeatJump` 和 `demoParkSnapshot`。平台视图名和记录 id 见 [DEMO.md](./DEMO.md)。

演示账号同样是虚构的，口令写在源码里，只给原型用：

| 用户名 | 密码 | 角色 | 显示名 |
| --- | --- | --- | --- |
| `admin` | `admin123` | 园区管理员 | 陈启明 |
| `operator` | `operator123` | 园区运营 | 林知夏 |

`login(username, password, options)` 只接受这两对。成功后把会话 JSON 写入 `localStorage` 键 `park-auth-session`（约 12 小时），里面有 `token`、`user`、`remember`、`issuedAt`、`expiresAt`。令牌形如 `park-demo.admin.…`，不是真实签名。`getCurrentUser`、`getSession`、`isAuthenticated` 会读这份会话；过期或损坏会清掉。`logout` 只删会话。

勾选记住账号时，用户名另外写到 `park-auth-remember`，可用 `getRememberedUsername()` 取回。退出登录不会清掉它。不勾选则会删掉这个键。没有 `localStorage` 时（例如部分 Node 脚本）退回进程内内存，接口不变。失败抛 `AuthMockError`，文案是「请输入账号和密码」或「账号或密码不正确」。

最小接法：

```ts
import { ref } from 'vue'
import type { LoginPayload } from '@park/components'
import { getCurrentUser, getRememberedUsername, isAuthenticated, login, logout } from '@park/mock'

const authed = ref(isAuthenticated())
const user = ref(getCurrentUser())
const remembered = getRememberedUsername() ?? ''

async function onSubmit(payload: LoginPayload) {
  const session = await login(payload.username, payload.password, { remember: payload.remember })
  user.value = session.user
  authed.value = true
}

function onLogout() {
  logout()
  authed.value = false
  user.value = null
}
```

## 兄弟仓库怎么引用

先把本仓库和平台仓库放在同级目录，并在本仓库执行 `pnpm install && pnpm build`，让 `dist` 存在。

### 本地路径

在 `park-industry`（campus、gov 相同）的 `package.json`：

```json
{
  "dependencies": {
    "@park/theme": "file:../park-shared/packages/theme",
    "@park/components": "file:../park-shared/packages/components",
    "@park/mock": "file:../park-shared/packages/mock",
    "ant-design-vue": "^4.2.6",
    "vue": "^3.5.0"
  }
}
```

`@park/theme` 与 `@park/components` 都把 `ant-design-vue` 视为 peer，`@park/components` 同时把 `vue` 视为 peer，由平台仓库自己安装。

### Git 子目录

pnpm 9 及以上可以用 `path:` 只装一个包。`&` 在 shell 里要加引号：

```bash
pnpm add "@park/theme@github:dxhcode/park-shared#main&path:/packages/theme"
pnpm add "@park/components@github:dxhcode/park-shared#main&path:/packages/components"
pnpm add "@park/mock@github:dxhcode/park-shared#main&path:/packages/mock"
```

也可以写进依赖：

```json
{
  "dependencies": {
    "@park/theme": "github:dxhcode/park-shared#main&path:/packages/theme",
    "@park/components": "github:dxhcode/park-shared#main&path:/packages/components",
    "@park/mock": "github:dxhcode/park-shared#main&path:/packages/mock"
  }
}
```

每个包的 `prepare` 会在安装时编译。包内的 `tsconfig` 不引用仓库根目录，所以子目录安装可以单独构建。组件包编译依赖 `esbuild`，消费方若使用 pnpm 10，需要允许 `esbuild` 的安装脚本。本地联调阶段优先用上面的 `file:` 路径。

## 不在这个仓库里

各端菜单和页面、真实鉴权接口、后端。这里的登录只是可复用的界面和本地演示会话。

# 演示指南

`park-shared` 只提供主题、组件和模拟数据。`park-industry`、`park-campus`、`park-gov` 用这些积木讲自己的管理端和大屏。下面是一条可以讲完的原型路线，数据全部来自 `@park/mock`，没有真实接口。

## 准备

在本仓库：

```bash
pnpm install
pnpm build
```

平台仓库用 `file:` 引用 `@park/theme`、`@park/components`、`@park/mock`，并自己安装 `vue` 和 `ant-design-vue`。入口至少做这三件事：

```ts
import { adminAntdTheme, applyParkTheme } from '@park/theme'
import '@park/theme/theme.css'
import '@park/components/style.css'

applyParkTheme('admin')
// 大屏页改成 applyParkTheme('screen')，ConfigProvider 改用 screenAntdTheme
```

本地对照页：

```bash
pnpm dev
```

右上角可切「登录与布局」「组件对照」「页面壳」「大屏看板」。地址栏示例：`?view=screen&park=park-binjiang`。组件对照里可以在指标和骨架之间切换。

共享预览只认识 `auth`、`gallery`、`shells`、`screen` 四个 `view`。讲解路线里的 `enterprises`、`work-orders` 等是给三个平台自己的路由用的，预览页不会打开这些页面。

## 账号

| 用户名 | 密码 | 角色 | 显示名 | 适合讲 |
| --- | --- | --- | --- | --- |
| `admin` | `admin123` | 园区管理员 | 陈启明 | 默认开场 |
| `operator` | `operator123` | 园区运营 | 林知夏 | 换一个身份，数据不变 |

口令写在源码里，只给原型。两个角色看到同一份模拟数据。

## 讲解路线

`demoBeats` 按 `order` 排好。`demoStory.beatsFor('industry' | 'campus' | 'gov')` 会带上共享的登录拍。`recordId` 是建议点开的记录，不写进地址栏。

| 顺序 | 平台 | 画面 | 标题 | 怎么讲 |
| --- | --- | --- | --- | --- |
| 1 | 共享 | 登录 | 管理员进入工作台 | `admin` / `admin123`，勾选记住账号 |
| 2 | 产业 | 管理端 | 在园企业 | 滨江，状态「在园」，能看到星澜智造、青禾生物 |
| 3 | 产业 | 管理端 | 星澜智造详情 | `ent-xinglan`，人工智能，186 人，联系人沈予安 |
| 4 | 产业 | 管理端 | 入园申请 | 表单只做示意，提交不会写回数据 |
| 5 | 产业 | 大屏 | 产值与产业 | 滨江近六月产值；人工智能人数等于星澜的 186 |
| 6 | 运营 | 管理端 | 服务工单 | `wo-bj-ac`，A1 研发楼空调异响，处理中 |
| 7 | 运营 | 管理端 | 空调工单详情 | 处理人周衡，位置 A1 研发楼 |
| 8 | 运营 | 管理端 | 来访预约 | 今日预约只统计 2026-10-04 |
| 9 | 运营 | 管理端 | 门禁公告 | `ntc-bj-gate`，发布人陈启明 |
| 10 | 运营 | 大屏 | 能耗与告警 | 门禁告警指向工单「B2 实验楼门禁无法识别」 |
| 11 | 治理 | 管理端 | 三园对照 | 光谷生命仍是建设中 |
| 12 | 治理 | 大屏 | 示意地图 | 从武汉光谷切到上海临港 |
| 13 | 治理 | 大屏 | 未关闭告警 | 条数等于该园待处理与处理中的工单 |

跳到某一拍：

```ts
import { demoBeatJump, demoBeats, demoJump, demoParkSnapshot, demoStory } from '@park/mock'

const beat = demoBeats.find((item) => item.id === 'campus-screen')
const { search, hash } = beat ? demoBeatJump(beat) : demoJump({ view: 'screen', parkId: 'park-binjiang', focus: 'energy' })
// search 形如 ?view=screen&park=park-binjiang&focus=energy
// hash 形如 #screen/park-binjiang/energy

const board = demoParkSnapshot('park-binjiang')
board?.enterprises.find((item) => item.id === 'ent-xinglan')
board?.dashboard.charts.find((item) => item.metric === '产业')
```

`demoParkSnapshot` 把一个园区的企业、楼宇、公告、工单、来访和大屏收成一份。园区不存在时返回 `undefined`。

三端分工写在 `demoPlatforms`：

| id | 仓库 | 演示重点 |
| --- | --- | --- |
| `industry` | `park-industry` | 企业、入园申请、产值和产业 |
| `campus` | `park-campus` | 工单、来访、公告、能耗和告警 |
| `gov` | `park-gov` | 三园对照、示意地图、未关闭告警 |

## 画面怎么对齐

管理端保持浅底。顶栏和侧栏用墨色，金线只做点缀。大屏用深海军蓝、青辉光和玻璃。不要在管理端整页套上大屏背景。

各端自己的区块可以直接用类名，不必再包一层 `GlassCard`：

```ts
import { parkMotion, parkSurface } from '@park/theme'
```

| 类名 | 用途 |
| --- | --- |
| `parkSurface.glass` | 玻璃底、描边、模糊 |
| `parkSurface.glassGlow` | 再加一圈辉光。大屏下会缓慢呼吸 |
| `parkSurface.ink` | 墨色面板，适合管理端里的深色摘要 |
| `parkSurface.accentLine` | 金线或青线 |
| `parkSurface.skeleton` | 骨架底 |
| `parkSurface.skeletonKpi` | 指标骨架的竖向排列 |
| `parkSurface.skeletonChart` | 图表骨架，铺满画布 |

`KpiStat`、`ScreenKpi`、`ChartPanel` 的 `loading` 使用同一套骨架。列表壳在加载时仍用 Ant Design 的 `Spin`。

空态继续用 `EmptyState`。`tone` 不传时跟祖先的 `data-park-theme`。插画会轻微上下浮动；系统开启「减少动态效果」后停止。

## 建议的拼法

管理端列表：

```vue
<ListPageShell
  eyebrow="企业"
  title="在园企业"
  :loading="loading"
  :empty="page.total === 0"
  empty-variant="search"
  empty-title="没有匹配的企业"
  :total="page.total"
  v-model:page="pageNo"
  v-model:page-size="pageSize"
>
  <a-table :columns="columns" :data-source="page.items" :pagination="false" row-key="id" />
</ListPageShell>
```

大屏：

```vue
<ScreenLayout title="滨江云栖科创园" subtitle="SCREEN">
  <KpiTicker :items="alerts" label="告警滚动" />
  <ChartPanel title="近七日能耗" caption="单位 kWh" :loading="loading" :height="200">
    <ScreenChart kind="line" :categories="energy.categories" :series="energy.series" />
  </ChartPanel>
  <MapPanel :markers="markers" :active-id="parkId" @select="onSelect" />
</ScreenLayout>
```

有 ECharts 时，把 `ScreenChart` 换成自己的画布，option 用 `screenLineOption`、`screenBarOption`、`screenPieOption`。没有图表库时，`ScreenChart` 就是兜底。

更完整的属性说明仍在 [README.md](./README.md)。阶段一还缺什么，见 [GAPS.md](./GAPS.md)。

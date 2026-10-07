# 产业运营平台

园区产业运营前端原型。第一天搭建 pnpm monorepo，包含两个可点击的中文界面壳：

- `apps/admin-app`：运营中台
- `apps/screen-app`：产业驾驶舱

页面路由已经接通。第二天补上运营中台的本地登录，以及招商项目、签约合同的列表、详情和表单。第三天把其余菜单做成可点击的列表、详情和表单。第四天接上产业驾驶舱的地图、图表和告警，并准备 GitHub Pages 静态产物。没有后端。

## 环境

- Node.js `>= 22.12`
- pnpm `10`

```bash
pnpm install
```

## 本地开发

```bash
pnpm dev:admin
pnpm dev:screen
```

- 运营中台：<http://localhost:5173/park-industry/admin/>
- 产业驾驶舱：<http://localhost:5174/park-industry/screen/>

Vite `base` 分别为 `/park-industry/admin/` 和 `/park-industry/screen/`，与 GitHub Pages 项目站点路径一致。

## 登录

运营中台除登录页外都需要本地会话，会话写在 `localStorage` 键 `park-industry.session`。演示密码都是 `demo123`。

| 账号 | 姓名 | 角色 | 默认园区 |
| --- | --- | --- | --- |
| `chenqm` | 陈启明 | 园区管理员 | 滨江云栖科创园 |
| `zhoulan` | 周岚 | 招商经理 | 临港智造产业园 |
| `liucheng` | 刘澄 | 签约专员 | 光谷生命科学园 |

退出登录在顶栏右侧。招商和签约的改动保存在 `park-industry.pipeline.v1`。待办、企业、空间、政策、促进、快报和设置保存在 `park-industry.ops.v1`。顶栏「恢复示例」会把两份数据一起盖回初始样例，登录状态保留。

## 招商与签约

产业招商：

- 项目库：`/investment/projects`，列表、详情、新建和编辑
- 线索：`/investment/leads`，可转化为项目
- 拜访：`/investment/visits`，挂在项目或线索上

签约管理：

- 合同：`/signing/contracts`，必须关联招商项目
- 履约：`/signing/performance`，挂在合同上

样例园区与 park-shared 主数据对齐：滨江云栖科创园、临港智造产业园、光谷生命科学园。企业、电话和金额都是虚构的。

## 其余子系统

运营中台里原先的占位菜单现在也能进列表、详情和表单：

- 工作台：待办，并汇总待跟进线索、在谈项目、待进行拜访
- 企业档案
- 产业空间
- 政策兑现
- 投资促进：推介、考察和渠道沙龙
- 数据分析：阶段快报，图表在产业驾驶舱
- 系统设置：组织架构、数据字典、角色权限

三个演示账号不变。角色页里出现的其他同事不能登录。列表筛空时有空状态，可以清空筛选或新建。侧栏选中和页面切换有轻微动效。

## 产业驾驶舱

六张场景都有数字：招商态势、签约看板、企业分布、空间利用、政策兑现、告警中心。底图是示意，不是测绘。名称与招商签约样例对齐，用滨江云栖科创园、临港智造产业园、光谷生命科学园。电话和金额都是虚构的。

左侧可以换场景，也可以把范围收成单个园区。顶栏有滚动指标。点地图上的园区，图表跟着收窄；再点一次回到三园合计。

本地开发时，驾驶舱和中台不在同一个端口，所以驾驶舱用内置示例，数字与中台初始样例一致。GitHub Pages 上两个应用同域。若本机已经有 `park-industry.pipeline.v1` 或 `park-industry.ops.v1`，驾驶舱只读这两份台账，不会改写。没有台账时仍用同一套示例。

从中台顶栏「驾驶舱」可以跳到和当前菜单对应的场景。工作台、招商和签约页面上也有入口。驾驶舱右上角「返回中台」回到跳转前的页面。本地会打开 `5174` / `5173`，Pages 上则走 `/park-industry/screen/` 和 `/park-industry/admin/`。

## 菜单

运营中台：

- 工作台
- 产业招商：项目库、线索、拜访
- 签约管理：合同、履约
- 企业档案
- 产业空间
- 政策兑现
- 投资促进
- 数据分析
- 系统设置

产业驾驶舱：

- 招商态势
- 签约看板
- 企业分布
- 空间利用
- 政策兑现
- 告警中心

## 构建

```bash
pnpm build
pnpm typecheck
pnpm pages:build
```

`pnpm build` 分别产出 `apps/admin-app/dist` 和 `apps/screen-app/dist`。

`pnpm pages:build` 生成可放到 GitHub Pages 的聚合目录：

```text
dist/index.html
dist/404.html
dist/.nojekyll
dist/admin/
dist/screen/
```

`dist/index.html` 是入口页，链接到两个应用。`dist/404.html` 用来在 Pages 上刷新深链接时回到对应的单页应用。

## 推送到 dist 分支

确认工作区已提交后：

```bash
pnpm pages:publish
```

脚本会重新执行 `pages:build`，再把 `dist/` 里的构建产物强制推送到 `dist` 分支。这个分支只保存静态产物，不保存源码。手改 `dist` 分支会被下一次发布覆盖。

站点要能打开，还得在 GitHub 仓库 Settings → Pages 里选择：

- Source：Deploy from a branch
- Branch：`dist`，目录 `/ (root)`

这一项在仓库设置里，发布脚本改不了。

站点路径：

- https://dxhcode.github.io/park-industry/
- https://dxhcode.github.io/park-industry/admin/
- https://dxhcode.github.io/park-industry/screen/

逐步演示看 [DEMO.md](./DEMO.md)。第一期还没做的部分看 [GAPS.md](./GAPS.md)。

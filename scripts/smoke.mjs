import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { getParkOverview, paginate, parks, queryEnterprises } from '../packages/mock/dist/index.js'
import { adminAntdTheme, applyParkTheme, screenAntdTheme } from '../packages/theme/dist/index.js'
import { AppLogo, EmptyState, GlassCard, KpiStat, PageHeader } from '../packages/components/dist/index.js'

assert.equal(parks.length, 3)
assert.equal(parks[0]?.name, '滨江云栖科创园')

const page = queryEnterprises({ parkId: 'park-binjiang', page: 1, pageSize: 2 })
assert.ok(page.total >= 2)
assert.equal(page.items.length, 2)
assert.equal(page.items.every((item) => item.parkId === 'park-binjiang'), true)

const overview = getParkOverview('park-binjiang')
assert.ok(overview)
assert.equal(overview.buildingCount, 2)
assert.equal(getParkOverview('missing'), undefined)
assert.equal(paginate([], 1, 10).total, 0)

const searched = queryEnterprises({ keyword: '星澜' })
assert.equal(searched.total, 1)
assert.equal(searched.items[0]?.id, 'ent-xinglan')

assert.equal(adminAntdTheme.token?.colorPrimary, '#1d39c4')
assert.equal(screenAntdTheme.token?.colorPrimary, '#22d3ee')
assert.equal(typeof applyParkTheme, 'function')
applyParkTheme('screen')

for (const component of [AppLogo, PageHeader, GlassCard, EmptyState, KpiStat]) {
  assert.equal(typeof component, 'object')
  assert.ok(component)
}

assert.equal(existsSync(new URL('../packages/theme/src/theme.css', import.meta.url)), true)
assert.equal(existsSync(new URL('../packages/components/dist/style.css', import.meta.url)), true)

console.log('smoke ok')

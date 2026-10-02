/** 与 src/motion.css 中的类名一致。页面切调用 routeFade / routeSlide，列表用 list 或 row。 */
export const parkMotion = {
  routeFade: 'park-route-fade',
  routeSlide: 'park-route-slide',
  list: 'park-list',
  menuPulse: 'park-menu-pulse',
  row: 'park-row',
} as const

export type ParkMotionName = (typeof parkMotion)[keyof typeof parkMotion]

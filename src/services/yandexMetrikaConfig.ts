import { Router } from 'vue-router'

type Cfg = {
  id: string | null
  debug: boolean
  [x: string]: any
}

export const getYandexMetrikaDefaultConfig = (router: Router): Cfg => {
  return {
    id: null,
    router: router,
    env: process.env.NODE_ENV,
    scriptSrc: 'https://mc.yandex.ru/metrika/tag.js',
    debug: false,
    options: {
      webvisor: true,
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      defer: true,
    },
  }
}

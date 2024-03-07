import { boot } from 'quasar/wrappers'
import { setApp } from 'yandex-metrika-vue3'

export default boot(({ app }) => {
  // @ts-ignore
  app.use(setApp)
})

declare global {
  interface Window {
    _metrikaKey?: string | null
  }
}

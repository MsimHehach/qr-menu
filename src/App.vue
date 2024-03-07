<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { getYandexMetrikaDefaultConfig } from 'src/services/yandexMetrikaConfig'
import { updateYandexMerikaByConfig } from 'yandex-metrika-vue3'

onMounted(() => {
  if (useQuasar().platform.is.safari) {
    document.body.classList.add('safari')
  }
  initMetrika()
})

const router = useRouter()

let interval: NodeJS.Timeout

const initMetrika = () => {
  interval = setInterval(() => {
    const value = window._metrikaKey
    if (value !== undefined) {
      clearInterval(interval)
      if (value) {
        const cfg = getYandexMetrikaDefaultConfig(router)
        cfg.id = value
        updateYandexMerikaByConfig(cfg as any)
      }
    }
  }, 100)
}
</script>

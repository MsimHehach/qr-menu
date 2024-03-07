<template>
  <div
    @mouseover="hover = true"
    @mouseleave="hover = false"
    class="cursor-pointer border-radius row items-center body"
    @click="clickHandler(item)"
    :style="[
      isHomePage
        ? item.id === $menuGroup.elementsInViewport[0] || hover
          ? `transition: color 0.25s ease-out;`
          : 'transition: color 0.25s ease-out'
        : '',
    ]"
    :class="[
      (item.id === $menuGroup.elementsInViewport[0] &&
        isHomePage &&
        !additional) ||
      hover
        ? 'text-primary'
        : 'text-secondary-text',
    ]"
  >
    <div
      class="ellipsis bold text-uppercase"
      :class="{ 'text-on-background-color': additional }"
    >
      {{ item.name }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { MenuGroup } from 'src/models/menu/menuGroups/menuGroup'
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useIntersectionObserver } from '@vueuse/core'
import { menuGroupRepo } from 'src/models/menu/menuGroups/menuGroupRepo'
import { store } from 'src/models/store'

const groupElement = ref()

const route = useRoute()

const router = useRouter()

const hover = ref(false)

let timeout: NodeJS.Timeout | null = null

const props = defineProps<{
  item: MenuGroup
  additional?: boolean
}>()

watch(
  () => route.name,
  (v) => {
    if (v === 'home' || v === 'qrHome') {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        startScrollMonitoring()
      }, 500)
    }
  }
)

const clickHandler = (v: MenuGroup) => {
  if (route.name === 'home' || route.name === 'qrHome') {
    void scrollToGroup(v)
  } else {
    void router.push({ name: store.tableMode ? 'qrHome' : 'home' }).then(() => {
      setTimeout(() => {
        void scrollToGroup(v)
      }, 500)
    })
  }
}

const scrollToGroup = (v: MenuGroup) => {
  groupElement.value = document.getElementById(v.id)
  if (groupElement.value) {
    const y =
      groupElement.value.getBoundingClientRect().top + window.scrollY - 100
    menuGroupRepo.scrollingToGroup = true
    window.scrollTo({ top: y, behavior: 'smooth' })

    setTimeout(() => {
      const elementIndex = menuGroupRepo.elementsInViewport.findIndex(
        (el) => el === props.item.id
      )
      if (elementIndex > -1)
        menuGroupRepo.elementsInViewport = [
          menuGroupRepo.elementsInViewport[elementIndex],
          ...menuGroupRepo.elementsInViewport.filter(
            (_, index) => index !== elementIndex
          ),
        ]
      menuGroupRepo.scrollingToGroup = false
    }, 600)
  }
}

const isHomePage = computed(() => {
  return route.name === 'home' || route.name === 'qrHome'
})

const startScrollMonitoring = () => {
  useIntersectionObserver(
    groupElement,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        if (!menuGroupRepo.elementsInViewport.includes(props.item.id))
          menuGroupRepo.elementsInViewport.push(props.item.id)
      } else {
        const elementIndex = menuGroupRepo.elementsInViewport.findIndex(
          (el) => el === props.item.id
        )
        if (elementIndex > -1)
          menuGroupRepo.elementsInViewport.splice(elementIndex, 1)
      }
    },
    {
      rootMargin: '-100px',
    }
  )
}

onMounted(() => {
  groupElement.value = document.getElementById(props.item.id)

  startScrollMonitoring()

  // visible.value = useElementVisibility(groupElement)

  // const observer = new window.IntersectionObserver(
  //   ([entry]) => {
  //     if (entry.isIntersecting) {
  //       menuGroupRepo.elementInViewport = groupElement.value?.id || null
  //       return
  //     }
  //   },
  //   {
  //     root: null,
  //     threshold: 0.4,
  //     rootMargin: '0px',
  //   }
  // )

  // if (groupElement.value) observer.observe(groupElement.value)
})
</script>

<template>
  <div
    class="cursor-pointer border-radius ellipsis"
    @click="clickHandler(item)"
    :style="[
      isHomePage
        ? item.id === $menuGroup.elementInViewport
          ? 'transition: background-color 0.4s ease-out'
          : 'transition: background-color 0.3s ease-out'
        : '',
      additional ? '' : 'margin-left: -10px',
    ]"
    style="max-width: 150px"
    :class="[additional ? 'py-2 px-3' : 'py-4 px-5']"
  >
    <!-- item.id === $menuGroup.elementInViewport && isHomePage && !additional
        ? 'bg-button-color text-on-button-color'
        : 'text-on-background-color', -->
    {{ item.name }}
  </div>
</template>
<script lang="ts" setup>
import { MenuGroup } from 'src/models/menu/menuGroups/menuGroup'
import { ref, onMounted, computed } from 'vue'
import { menuGroupRepo } from 'src/models/menu/menuGroups/menuGroupRepo'
import { useRoute, useRouter } from 'vue-router'

const groupElement = ref<Element | null>(null)

const route = useRoute()

const router = useRouter()

const props = defineProps<{
  item: MenuGroup
  additional?: boolean
}>()

const clickHandler = (v: MenuGroup) => {
  if (route.name === 'home') {
    void scrollToGroup(v)
  } else {
    void router.push({ name: 'home' }).then(() => {
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
    window.scrollTo({ top: y, behavior: 'smooth' })
    // groupElement.value.scrollIntoView({
    //   behavior: 'smooth',
    //   block: 'start',
    //   inline: 'nearest',
    // })
  }
}

const isHomePage = computed(() => {
  return route.name === 'home'
})

onMounted(() => {
  groupElement.value = document.getElementById(props.item.id)

  const observer = new window.IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        menuGroupRepo.elementInViewport = groupElement.value?.id || null
        return
      }
    },
    {
      root: null,
      threshold: 0.4,
      rootMargin: '0px',
    }
  )

  if (groupElement.value) observer.observe(groupElement.value)
})
</script>

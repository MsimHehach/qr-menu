<template>
  <div class="column full-width">
    <div class="row justify-center items-center gap-5 pt-4 pb-6">
      <img
        v-if="$company.item?.logo?.thumbnail || $company.item?.image?.thumbnail"
        @click="$router.push({ name: 'home' })"
        :height="$q.screen.gt.md ? '48' : '44'"
        class="border-radius cursor-pointer"
        style="object-fit: contain"
        :src="$company.item?.logo?.thumbnail || $company.item?.image?.thumbnail"
      />
      <CIconButton
        @click="$store.selectCompanyModal = true"
        icon="fa-regular fa-angle-down"
        icon-color="on-secondary-button-color"
        hover-icon-color="primary"
        size="38px"
        color="secondary-button-color"
        icon-size="22px"
      />
    </div>
    <q-separator color="divider-color" />
    <div class="row full-width justify-between pt-4 px-3 items-center">
      <CIcon
        name="fa-regular fa-bars"
        color="on-background-color"
        hover-color="primary"
        class="cursor-pointer"
        size="24px"
      >
        <q-menu auto-close class="column gap-5 pa-5">
          <CButton
            v-for="(el, index) in blocks"
            :key="index"
            @click="el.click()"
            text-button
            :label="el.label"
            style="width: fit-content"
            text-color="on-background-color"
            class="body"
          />
        </q-menu>
      </CIcon>
      <ServiceSettingsBlock v-if="authentication.user" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { authentication } from 'src/models/authentication/authentication'
import { store } from 'src/models/store'
import CButton from 'src/components/template/buttons/CButton.vue'
import ServiceSettingsBlock from 'src/components/serviceSettings/ServiceSettingsBlock.vue'
import CIconButton from 'src/components/template/buttons/CIconButton.vue'

const route = useRoute()

const router = useRouter()

const blocks = computed(() => {
  return [
    {
      label: 'Профиль',
      click: () =>
        router.push({
          name: 'profilePage',
        }),
    },
    {
      label: 'Контакты',
      click: () => {
        scrollToBlock('footer')
      },
    },
    {
      label: 'О нас',
      hidden: !authentication.user,
      click: () => {
        router.push({
          name: 'aboutUs',
        })
      },
    },

    {
      label: 'Разработчик',
      click: () => {
        window.open('https://corex.studio/', '_blank')
      },
    },
    {
      label: 'Мобильное приложение',
      click: () => {
        scrollToBlock('footer')
      },
    },
  ]
})

const scrollToBlock = (v: string, tab?: string) => {
  if (route.name !== 'home') {
    void router.push({
      name: 'home',
    })
    setTimeout(() => {
      scrollToBlock(v, tab)
    }, 300)
  } else {
    const groupElement = document.getElementById(v)
    if (groupElement) {
      if (tab) store.offersTab = tab
      const y = groupElement.getBoundingClientRect().top + window.scrollY - 120
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }
}
</script>

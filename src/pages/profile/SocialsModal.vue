<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="456px"
    class="text-on-background-color"
  >
    <div class="header3 bold mb-10">Ссылки на соц. сети</div>
    <div class="column gap-8">
      <div
        v-for="(el, index) in $company.companyForProfile?.guestContacts.socials"
        :key="index"
        @click="openSocial(el.link)"
        class="row items-center gap-6 cursor-pointer"
      >
        <div>
          <q-img width="30px" fit="contain" :src="getImage(el.link_type)" />
        </div>
        <div class="body">
          {{ el.name }}
        </div>
      </div>
    </div>
  </CDialog>
</template>
<script lang="ts" setup>
import CDialog from 'src/components/template/dialogs/CDialog.vue'
import { LinkType } from 'src/models/company/company'
import { store } from 'src/models/store'

defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
}>()

const getImage = (link: LinkType | null) => {
  let fileName: string | null = null

  try {
    if (link === LinkType.MAPS) fileName = 'yandexMaps.png'
    if (link === LinkType.OK) fileName = 'okLogo.png'
    if (link === LinkType.TELEGRAM) fileName = 'telegramLogo.png'
    if (link === LinkType.VK) fileName = 'VKLogo.png'
    if (link === LinkType.WEBSITE) fileName = 'websiteIcon.png'

    return `assets/${fileName}`
    // return String(new URL('../../assets/' + fileName, import.meta.url))
  } catch {
    return store.images.empty
  }
}

const openSocial = (link: string) => {
  window.open(link, '_blank')
}
</script>

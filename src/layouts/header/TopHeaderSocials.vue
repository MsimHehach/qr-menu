<template>
  <div class="row items-center gap-10">
    <div
      v-for="(el, index) in $company.item?.guestContacts.socials"
      :key="index"
      class="social-button row items-center text-on-secondary-button-color justify-center"
    >
      <CIcon
        @click="openLink(el.link)"
        size="32px"
        class="cursor-pointer"
        color="secondary"
        hover-color="primary"
        :name="getSocialIcon(el.link_type)"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { LinkType } from 'src/models/company/company'
import { ref } from 'vue'

const socialsTypes = ref([
  {
    type: LinkType.VK,
    icon: 'fa-brands fa-vk',
    link: '',
  },
  {
    type: LinkType.MAPS,
    icon: 'fa-solid fa-location-dot',
    link: '',
  },
  {
    type: LinkType.TELEGRAM,
    icon: 'fa-brands fa-telegram',
    link: '',
  },
  {
    type: LinkType.WEBSITE,
    icon: 'fa-solid fa-globe',
    link: '',
  },
  {
    type: LinkType.OK,
    icon: 'fa-brands fa-odnoklassniki',
    link: '',
  },
])

const openLink = (v: string) => {
  window.open(v || undefined, '_blank')
}

const getSocialIcon = (type: string | null) => {
  return socialsTypes.value.find((el) => el.type === type)?.icon
}
</script>

<style lang="scss" scoped></style>

<template>
  <div v-if="company" class="column">
    <q-breadcrumbs
      v-if="$companyGroup.item && $companyGroup.item?.companies.length > 1"
      separator=""
      class="mb-15"
    >
      <CHover v-slot="{ hover }">
        <q-breadcrumbs-el
          :label="'Все заведения'"
          class="cursor-pointer"
          :class="hover ? 'text-primary' : 'text-on-background-color'"
          @click="$company.companyForProfile = null"
        />
      </CHover>
      <q-icon
        class="px-3 text-on-background-color"
        name="fal fa-chevron-right"
        style="font-size: 10px !important"
      />
      <q-breadcrumbs-el
        :label="$company.companyForProfile?.name || ''"
        class="text-on-background-color"
        style="opacity: 0.5"
      />
    </q-breadcrumbs>
    <div
      class="bg-accent border-radius pa-15 row items-center full-width gap-sm-25 gap-xs-20"
      :class="$q.screen.lt.md ? '' : 'no-wrap'"
    >
      <div class="column items-center gap-8 col-xs-12 col-md-4">
        <q-img
          class="border-radius"
          width="183px"
          height="183px"
          fit="contain"
          :src="company.image?.thumbnail"
        >
          <template v-slot:error>
            <span>
              <q-img
                fit="contain"
                width="183px"
                height="183px"
                :src="$store.images.empty"
              ></q-img>
            </span>
          </template>
        </q-img>
        <div class="header2 text-on-accent">{{ company.name }}</div>
        <div class="row full-width justify-center gap-5">
          <div
            v-for="(el, index) in availableOrderMethods"
            :key="index"
            class="py-3 px-4 bg-white-opacity items-center gap-3 row border-radius"
          >
            <CIcon :name="el.icon" />
            {{ el.label }}
          </div>
        </div>
      </div>

      <SwiperContainer
        no-navigation
        class="swiper col mt-md-20"
        use-bullets
        :slides-per-view="slidesPerView"
        :items="company.images"
      >
        <template v-slot:item="{ item }">
          <div style="height: 140px; overflow: hidden">
            <!-- :style="`border-radius:${getBorderRadius}`" -->
            <q-img
              height="140px"
              class="border-radius"
              style="min-height: 140px"
              :src="item.thumbnail || $store.images.empty"
              fit="cover"
            >
              <template v-slot:error>
                <span>
                  <q-img
                    class="border-radius"
                    fit="cover"
                    height="140px"
                    :src="$store.images.empty"
                  ></q-img>
                </span>
              </template>
            </q-img>
          </div> </template
      ></SwiperContainer>
    </div>
    <div class="subtitle-text-light text-on-background-color mt-15">
      {{ company.description }}
    </div>
    <div class="mt-15 row gap-10">
      <div
        v-for="(el, index) in contacts"
        :key="index"
        @click="openContactsModal(el.field, el.label)"
        style="width: 130px; height: 140px"
        class="column items-center justify-between bg-backing-color text-primary border-radius py-11 body cursor-pointer"
      >
        <div style="text-align: center; font-weight: 500">{{ el.label }}</div>
        <div
          style="width: fit-content"
          class="bg-white-opacity box-shadow border-radius px-6 py-5"
        >
          <CIcon size="18px" :name="el.icon" color="primary" />
        </div>
      </div>
    </div>
    <q-img
      v-if="
        $uiSettings.item?.socialButtonImage &&
        company.guestContacts.socials.length
      "
      fit="cover"
      @click="socialsModal = true"
      class="border-radius mt-15 cursor-pointer"
      style="max-height: 230px; max-width: 400px"
      :src="$uiSettings.item?.socialButtonImage?.thumbnail"
    >
    </q-img>
    <CButton
      v-if="
        company.guestContacts.socials.length &&
        !$uiSettings.item?.socialButtonImage
      "
      label="Полезные ссылки"
      width="200px"
    />
    <ProfileAddressesOnMap />
  </div>
  <SelectCompany v-else />
  <SocialsModal
    :model-value="socialsModal"
    @update:model-value="socialsModal = false"
  />
  <ContactsModal
    @update:model-value="concatsModal = false"
    :model-value="concatsModal"
    :contact="currentContactType"
  />
</template>
<script lang="ts" setup>
import CIcon from 'src/components/template/helpers/CIcon.vue'
import SwiperContainer from 'src/layouts/containers/SwiperContainer.vue'
import { companyRepo } from 'src/models/company/companyRepo'
import { computed, ref } from 'vue'
import SocialsModal from './SocialsModal.vue'
import CButton from 'src/components/template/buttons/CButton.vue'
import ProfileAddressesOnMap from './ProfileAddressesOnMap.vue'
import SelectCompany from './SelectCompany.vue'
import CHover from 'src/components/template/helpers/CHover.vue'
import ContactsModal from './ContactsModal.vue'
import { useQuasar } from 'quasar'

const socialsModal = ref(false)

const q = useQuasar()

const concatsModal = ref(false)

const currentContactType = ref<{
  label: string
  type: 'phones' | 'emails' | 'messages'
} | null>(null)

type ContactType = {
  label: string
  icon: string
  field: 'phones' | 'emails' | 'messages'
}

const slidesPerView = computed(() => {
  return q.screen.xs ? 1.2 : q.screen.sm ? 2 : 3.2
})

const contacts = computed(() => {
  const result: ContactType[] = []
  if (company.value?.guestContacts.phones.length) {
    result.push({
      label: 'Позвонить',
      icon: 'fa-light fa-phone',
      field: 'phones',
      // click: () => {
      //   company.value?.guestContacts.phones.forEach((v) => {
      //     Notify.create({
      //       message: `${v.name || 'Телефон'}: ${v.value}`,
      //       timeout: 20000,
      //     })
      //   })
      // },
    })
  }
  if (company.value?.guestContacts.messages.length) {
    result.push({
      label: 'Написать',
      icon: 'fa-light fa-message',
      field: 'messages',
      // click: () => {
      //   company.value?.guestContacts.messages.forEach((v) => {
      //     Notify.create({
      //       message: `${v.name}: ${v.value}`,
      //       timeout: 20000,
      //     })
      //   })
      //   void 0
      // },
    })
  }
  company.value?.guestContacts.emails.forEach((v) => {
    result.push({
      label: v.name || '-',
      icon: 'fa-light fa-message',
      field: 'emails',
      // click: () => {
      //   company.value?.guestContacts.emails.forEach((v) => {
      //     Notify.create({
      //       message: `${v.name}: ${v.value}`,
      //       timeout: 20000,
      //     })
      //   })
      // },
    })
  })

  return result
})

const availableOrderMethods = computed(() => {
  const result = []
  if (company.value?.salesPoints?.some((v) => v.settings.pickup_enabled)) {
    result.push({
      label: 'Заказ с собой',
      icon: 'fa-light fa-person-walking',
    })
    if (company.value.salesPoints.some((v) => v.settings.delivery_enabled)) {
      result.push({
        label: 'Доставка',
        icon: 'fa-light fa-house',
      })
    }
    if (company.value.salesPoints.some((v) => v.settings.booking_enabled)) {
      result.push({
        label: 'Бронь стола',
        icon: 'fa-light fa-calendar-day',
      })
    }
  }
  return result
})

const company = computed(() => {
  return companyRepo.companyForProfile
})

const openContactsModal = (
  type: 'phones' | 'emails' | 'messages',
  label: string
) => {
  currentContactType.value = {
    label,
    type,
  }
  concatsModal.value = true
}

// onMounted(() => {
//   if (!companyRepo.item) {
//     store.selectCompanyModal = true
//   }
// })
</script>

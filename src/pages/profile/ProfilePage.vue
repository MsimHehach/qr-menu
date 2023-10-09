<template>
  <div>
    <q-breadcrumbs separator="" class="mb-sm-15 mb-xs-12 mt-sm-8 mt-xs-5">
      <CHover v-slot="{ hover }">
        <q-breadcrumbs-el
          :label="'Главная'"
          class="caption-text pb-2"
          :class="hover ? 'text-primary' : 'text-on-background-color'"
          :to="{ name: 'home' }"
        />
      </CHover>
      <q-icon
        class="px-3 text-on-background-color"
        name="fal fa-chevron-right"
        style="font-size: 10px !important"
      />
      <q-breadcrumbs-el
        @click="profileBreadcrumbClickHandler()"
        :label="'Профиль'"
        :style="isProfileBreadcrumbClickable ? '' : 'opacity: 0.6'"
        class="caption-text text-on-background-color"
        :class="isProfileBreadcrumbClickable ? 'cursor-pointer ' : ''"
      />
    </q-breadcrumbs>
    <div
      class="row bg-primary py-sm-15 py-xs-10 px-10 justify-between items-center border-radius"
    >
      <div class="row no-wrap items-center gap-5">
        <div
          style="width: 50px; height: 50px"
          class="bg-background-color border-radius row items-center justify-center"
        >
          <CIcon
            size="20px"
            name="fa-light fa-user"
            color="on-background-color"
          />
        </div>
        <div class="column gap-4 text-on-primary">
          <div class="header3">
            {{ authentication.user?.fullName || 'Без имени' }}
          </div>
          <div class="secondary-text">{{ authentication.user?.phone }}</div>
        </div>
      </div>
      <!-- <div
        style="width: 40px; height: 40px"
        class="row justify-center items-center bell-icon border-radius cursor-pointer"
      >
        <CIcon color="on-primary" name="fa-light fa-bell" />
      </div> -->
    </div>
    <div
      class="row no-wrap full-width mt-md-25 mt-xs-12 mt-sm-20 gap-lg-40 gap-xs-15 gap-md-25"
    >
      <ProfileMenu v-if="showMenu" />
      <div class="col" v-if="!menuView">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CHover from 'src/components/template/helpers/CHover.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { authentication } from 'src/models/authentication/authentication'
import ProfileMenu from './ProfileMenu.vue'
import { onMounted, watch, ref, computed } from 'vue'
import { companyRepo } from 'src/models/company/companyRepo'
import { useRoute, useRouter } from 'vue-router'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { useQuasar } from 'quasar'

const router = useRouter()

const route = useRoute()

const q = useQuasar()

const cashedRoute = ref<string | null>(null)

const menuView = computed(() => {
  return q.screen.xs && route.name === 'profilePage'
})

const isProfileBreadcrumbClickable = computed(() => {
  return q.screen.xs && route.name !== 'profilePage'
})

const showMenu = computed(() => {
  return !q.screen.xs || route.name === 'profilePage'
})

const profileBreadcrumbClickHandler = () => {
  if (!isProfileBreadcrumbClickable.value) return
  void router.push({
    name: 'profilePage',
  })
}

onMounted(() => {
  if (q.screen.gt.xs) {
    router.replace({
      name: 'profileData',
    })
  }
  if (!authentication.user) void router.push({ name: 'home' })
  if (companyGroupRepo.item && companyGroupRepo.item?.companies.length < 2) {
    companyRepo.companyForProfile = companyRepo.item
  }
})

watch(
  () => q.screen.name,
  (v) => {
    if (v === 'xs') {
      cashedRoute.value = String(route.name)
      router.replace({
        name: 'profilePage',
      })
    } else {
      if (route.name === 'profilePage') {
        router.replace({
          name: cashedRoute.value || 'profileData',
        })
      }
    }
  }
)
</script>

<style lang="scss" scoped>
.bell-icon {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>

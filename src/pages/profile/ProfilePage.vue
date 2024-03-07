<template>
  <div class="pt-lg-20">
    <div
      :class="$q.screen.lt.lg ? 'column' : 'row'"
      class="no-wrap full-width gap-lg-40 gap-xs-12 gap-md-18"
    >
      <ProfileMenu />
      <div class="col">
        <router-view />
      </div>
    </div>

    <q-spinner-puff
      v-if="
        $order.loadings.list ||
        $deliveryAddress.loadings.list ||
        $paymentCard.loadings.list
      "
      style="position: fixed; top: 44%; left: 43%; z-index: 9999"
      color="primary"
      size="12%"
    />
  </div>
</template>
<script lang="ts" setup>
import { authentication } from 'src/models/authentication/authentication'
import ProfileMenu from './ProfileMenu.vue'
import { onMounted } from 'vue'
import { companyRepo } from 'src/models/company/companyRepo'
import { useRouter } from 'vue-router'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'

const router = useRouter()

onMounted(() => {
  if (!authentication.user) void router.push({ name: 'home' })
  if (companyGroupRepo.item && companyGroupRepo.item?.companies.length < 2) {
    companyRepo.companyForProfile = companyRepo.item
  }
})
</script>

<style lang="scss" scoped>
.bell-icon {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>

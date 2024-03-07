<template>
  <div
    v-if="authentication.user"
    class="row gap-5 full-width border-radius pa-10 justify-between items-start card-element no-wrap"
  >
    <div class="row gap-13 items-center no-wrap">
      <q-img
        width="58px"
        height="58px"
        style="border-radius: 50%"
        fit="cover"
        :src="authentication.user.image?.thumbnail || $store.images.empty"
      >
        <template v-slot:error>
          <span>
            <q-img
              fit="cover"
              style="border-radius: 50%"
              height="54px"
              width="54px"
              :src="$store.images.empty"
            ></q-img>
          </span>
        </template>
      </q-img>
      <div class="column gap-3">
        <div class="header3 bold">
          {{ authentication.user.fullName }}
        </div>
        <div style="opacity: 0.7" class="body">
          {{ authentication.user.phone }}
        </div>
      </div>
    </div>
    <div class="row items-center gap-7 no-wrap">
      <CIcon
        @click="$emit('editProfile', true)"
        size="20px"
        hover-color="primary"
        class="cursor-pointer"
        name="fa-regular fa-pen"
        color="secondary"
      />
      <CIcon
        @click="
          $router.push({
            name: 'deleteAccountPage',
            params: {
              companyGroup: $companyGroup.item?.externalId,
            },
          })
        "
        size="20px"
        hover-color="primary"
        class="cursor-pointer"
        name="fa-regular fa-trash"
        color="secondary"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { authentication } from 'src/models/authentication/authentication'

defineEmits<{
  (evt: 'editProfile', val: boolean): void
}>()
</script>

<style lang="scss" scoped>
.card-element {
  // background: linear-gradient(90deg, var(--accent) 50%, var(--primary) 100%);
  border: 2px var(--primary) solid;
}
</style>

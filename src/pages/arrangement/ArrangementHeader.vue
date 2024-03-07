<template>
  <div class="column full-width">
    <div
      class="row c-container no-wrap justify-between items-center py-6 bg-background-color"
    >
      <div
        @click="
          $router.push({
            name: 'home',
          })
        "
        class="cursor-pointer col-lg-7 col-xs-5"
      >
        <img
          v-if="
            $company.item?.image?.thumbnail || $company.item?.logo?.thumbnail
          "
          :height="$q.screen.lt.lg ? '48' : '52'"
          class="border-radius"
          style="object-fit: contain"
          :src="
            $company.item?.logo?.thumbnail || $company.item?.image?.thumbnail
          "
        />
      </div>
      <ArrangementStepper class="col-lg-5 col-xs-7" />
    </div>
    <q-separator color="divider-color" />
  </div>
</template>
<script lang="ts" setup>
import ArrangementStepper from './ArrangementStepper.vue'
</script>

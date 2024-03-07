<template>
  <div class="row gap-10 text-on-background-color">
    <div
      v-if="$salesPoint.item?.contacts.contact_phone"
      class="row gap-6 items-center"
    >
      <CIcon name="fa-regular fa-phone" color="primary" size="24px" />
      <div class="column">
        <div class="body bold">
          {{ $salesPoint.item?.contacts.contact_phone }}
        </div>
        <!-- <div style="opacity: 0.6" class="body">Номер доставки</div> -->
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CIcon from 'src/components/template/helpers/CIcon.vue'
</script>

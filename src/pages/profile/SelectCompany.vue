<template>
  <div style="max-width: 456px" class="text-on-background-color">
    <div class="row full-width huge3 bold mb-10">Выберите заведение</div>
    <div class="column gap-10">
      <CompanyRow
        @click="selectCompany(el)"
        v-for="(el, index) in $companyGroup.item?.companies"
        :key="index"
        :item="el"
        :selected="false"
        class="company-block"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { companyRepo } from 'src/models/company/companyRepo'
import CompanyRow from './CompanyRow.vue'
import { Company } from 'src/models/company/company'

const selectCompany = (el: Company) => {
  companyRepo.companyForProfile = el
}
</script>

<style lang="scss" scoped>
.company-block {
  outline: 1px var(--secondary-button-color) solid;
}
</style>

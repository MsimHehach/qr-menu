<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="456px"
  >
    <template v-slot:header>
      <div class="row full-width items-center justify-between gap-5 no-wrap">
        <div>Выберите заведение</div>
        <div
          class="row box-shadow bg-white-opacity px-4 py-2 border-radius justify-center items-center"
        >
          <CIcon color="on-secondary-button-color" name="fa-light fa-shop" />
        </div>
      </div>
    </template>
    <div class="column full-width gap-8">
      <CompanyRow
        @click="selectCompany(el)"
        v-for="(el, index) in $companyGroup.item?.companies"
        :key="index"
        :item="el"
      />
    </div>
  </CDialog>
</template>
<script lang="ts" setup>
import { Company } from 'src/models/company/company'
import CDialog from '../template/dialogs/CDialog.vue'
import CIcon from '../template/helpers/CIcon.vue'
import CompanyRow from 'src/pages/profile/CompanyRow.vue'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
  (evt: 'select', v: Company): void
}>()

const selectCompany = (v: Company) => {
  // if (v.salesPoints) salesPointRepo.item = v.salesPoints[0]
  emit('select', v)
}
</script>

<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="345px"
  >
    <div class="header3 light" style="text-align: center">
      Официант скоро подойдет, пожалуйста ожидайте
    </div>
    <div class="row full-width justify-center mt-10">
      <CButton
        @click="$emit('update:modelValue', false)"
        width="160px"
        label="Понятно"
        height="40px"
      />
    </div>
  </CDialog>
</template>
<script lang="ts" setup>
import CButton from 'src/components/template/buttons/CButton.vue'
import CDialog from 'src/components/template/dialogs/CDialog.vue'

defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
}>()
</script>

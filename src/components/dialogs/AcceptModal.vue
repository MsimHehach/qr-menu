<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="322px"
  >
    <div class="header3 text-center mb-10 px-10 text-on-background-color">
      Вы подтверждаете действие?
    </div>
    <div class="row gap-10 flex-center">
      <CButton
        label="Отменить"
        @click="$emit('update:modelValue', false)"
        color="secondary-button-color"
        text-color="on-secondary-button-color"
        width="46%"
      />
      <CButton label="Подтвердить" @click="acceptHandler" width="46%" />
    </div>
  </CDialog>
</template>
<script lang="ts" setup>
import CButton from '../template/buttons/CButton.vue'
import CDialog from '../template/dialogs/CDialog.vue'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
  (evt: 'accept'): void
}>()

const acceptHandler = () => {
  emit('accept')
  emit('update:modelValue', false)
}
</script>

<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="422px"
  >
    <div class="header3 text-center mb-10 px-10 text-on-background-color">
      {{ text || 'Вы подтверждаете действие?' }}
    </div>
    <div class="row gap-sm-10 gap-xs-5 flex-center">
      <CButton
        label="Отменить"
        :height="$q.screen.md ? '44px' : $q.screen.lt.md ? '40px' : '48px'"
        class="body"
        @click="$emit('update:modelValue', false)"
        color="secondary-button-color"
        text-color="on-secondary-button-color"
        :width="$q.screen.xs ? '100%' : '46%'"
      />
      <CButton
        class="body"
        label="Подтвердить"
        :height="$q.screen.md ? '44px' : $q.screen.lt.md ? '40px' : '48px'"
        @click="acceptHandler"
        :width="$q.screen.xs ? '100%' : '46%'"
      />
    </div>
  </CDialog>
</template>
<script lang="ts" setup>
import CButton from '../template/buttons/CButton.vue'
import CDialog from '../template/dialogs/CDialog.vue'

defineProps<{
  modelValue: boolean
  text?: string
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

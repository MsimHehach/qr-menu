<template>
  <CDialog
    width="570px"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    class="text-on-background-color"
    :maximize="$q.screen.lt.md"
  >
    <div class="column full-width">
      <div class="row full-width justify-center">
        <q-img src="assets/bonuses.png" width="325px" />
      </div>

      <div class="huge3 bold mt-15">Этот блок находится в разработке!</div>
      <div class="body mt-6">
        К сожалению, блок с бонусами все еще находится в процессе разработки, и
        мы приносим свои искренние извинения за любые неудобства, которые это
        может вызывать.
      </div>
      <CButton
        @click="$emit('update:modelValue', false)"
        label="Понятно"
        width="100%"
        height="48px"
        class="body mt-15"
      /></div
  ></CDialog>
</template>
<script lang="ts" setup>
import CButton from '../buttons/CButton.vue'
import CDialog from './CDialog.vue'

defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
  <div
    class="column full-width px-xs-8 px-md-0 py-md-0 py-xs-12 text-on-background-color"
  >
    <div class="header3 bold mb-10">Выберите способ получения</div>
    <div class="column full-width">
      <div
        v-for="(type, index) in types"
        :key="index"
        @click="$emit('select', type)"
        class="row full-width items-center justify-between py-5 cursor-pointer"
      >
        <div class="body">{{ type.label }}</div>
        <RoundedSelector
          :model-value="currentTab?.type === type.type"
          check
          height="22px"
          width="22px"
          icon-size="14px"
        />
      </div>
    </div>
    <CButton
      @click="$emit('confirm')"
      :disabled="!currentTab"
      label="Выбрать"
      height="40px"
      class="mt-12 body"
    />
  </div>
</template>
<script lang="ts" setup>
import CButton from '../template/buttons/CButton.vue'
import RoundedSelector from '../template/buttons/RoundedSelector.vue'
import { TabRaw } from './ServiceSettingsModal.vue'

defineProps<{
  types: TabRaw[]
  currentTab: TabRaw | null
}>()

defineEmits<{
  (evt: 'select', val: TabRaw): void
  (evt: 'confirm'): void
}>()
</script>

<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="429px"
  >
    <template v-slot:header> Способ оплаты </template>
    <div class="column full-width gap-5">
      <div
        v-for="(el, index) in types"
        :key="index"
        @click="selectedPaymentType = el"
        class="row justify-between no-wrap items-center px-8 py-6 cursor-pointer"
      >
        <div class="row gap-6 body text-on-background-color">
          <q-icon color="on-background-color" :name="el.icon" size="20px" />
          {{ el.label }}
        </div>
        <!-- <div style="width: 24px; height: "></div> -->
        <RoundedSelector
          check
          height="26px"
          width="26px"
          :model-value="selectedPaymentType?.type === el.type"
        />
      </div>
    </div>
    <CButton
      @click="select()"
      width="100%"
      label="Выбрать"
      :disabled="!selectedPaymentType"
      class="mt-12 body"
    />
  </CDialog>
</template>
<script lang="ts" setup>
import CButton from 'src/components/template/buttons/CButton.vue'
import RoundedSelector from 'src/components/template/buttons/RoundedSelector.vue'
import CDialog from 'src/components/template/dialogs/CDialog.vue'
import { PaymentObjectType } from 'src/models/order/order'
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  types: PaymentObjectType[]
  currentType: PaymentObjectType | null
}>()

const emit = defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
  (evt: 'select', value: PaymentObjectType): void
}>()

const selectedPaymentType = ref<PaymentObjectType | null>(null)

watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      if (props.currentType) selectedPaymentType.value = props.currentType
    }
  }
)

const select = () => {
  if (!selectedPaymentType.value) return
  emit('select', selectedPaymentType.value)
  emit('update:modelValue', false)
}
</script>

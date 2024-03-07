<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="649px"
    :position="$q.screen.lt.md ? 'bottom' : undefined"
    :maximize="$q.screen.lt.md"
  >
    <template v-if="$q.screen.gt.sm" v-slot:header>Адреса доставки</template>
    <DeliveryAddressesTab
      @select="currentAddress = $event"
      @back="$emit('update:modelValue', false)"
      :currentAddress="currentAddress"
      no-padding
      selection-only
    >
      <template v-slot:bottom>
        <div class="row full-width gap-6">
          <CButton
            @click="select()"
            :height="$q.screen.md ? '44px' : $q.screen.lt.md ? '40px' : '48px'"
            label="Выбрать"
            :disabled="!currentAddress"
            :loading="$cart.setParamsLoading || $store.catalogLoading"
            class="col body"
          />
          <!-- <CButton
            label="Добавить адрес"
            height="48px"
            color="secondary-button-color"
            class="col subtitle-text"
            text-color="on-secondary-button-color"
          /> -->
        </div>
      </template>
    </DeliveryAddressesTab>
  </CDialog>
</template>
<script lang="ts" setup>
import DeliveryAddressesTab from 'src/components/serviceSettings/DeliveryAddressesTab.vue'
import CDialog from './CDialog.vue'
import CButton from '../buttons/CButton.vue'
import { DeliveryAddress } from 'src/models/customer/deliveryAddress/deliveryAddress'
import { ref, watch } from 'vue'
import { cartRepo } from 'src/models/carts/cartRepo'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
  (evt: 'addressSelected', value: DeliveryAddress): void
}>()

const currentAddress = ref<DeliveryAddress | null>(null)

watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      if (cartRepo.item?.deliveryAddress) {
        currentAddress.value = cartRepo.item.deliveryAddress
      }
    }
  }
)

const select = () => {
  if (!currentAddress.value) return
  emit('addressSelected', currentAddress.value)
}
</script>

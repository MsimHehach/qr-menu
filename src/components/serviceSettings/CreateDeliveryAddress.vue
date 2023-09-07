<template>
  <div class="column items-center text-on-background-color pb-10">
    <div v-if="newAddress" class="column px-1 full-width gap-10">
      <CInput
        height="42px"
        external-label="Название адреса"
        v-model="newAddress.name"
      />
      <AddressSearch
        @update="selectAddress($event)"
        :address="newAddress.address"
        label="Адрес"
      />
      <div class="row gap-5 no-wrap">
        <CInput
          height="42px"
          class="col"
          external-label="Подъезд"
          v-model="newAddress.entrance"
        />
        <CInput
          height="42px"
          class="col"
          external-label="Этаж"
          v-model="newAddress.floor"
        />
      </div>
      <div class="row gap-5 no-wrap">
        <CInput
          height="42px"
          class="col"
          external-label="Код двери"
          v-model="newAddress.intercom"
        />
      </div>
      <CInput
        placeholder="Комментарий"
        class="rounded-10"
        input-style="border-radius: 15px !important"
        v-model="newAddress.description"
        text-area
      />
    </div>
    <CButton
      @click="createAddress()"
      height="50px"
      :disabled="!isSaveAvailable"
      class="mt-15"
      width="280px"
      label="Сохранить"
    />
  </div>
</template>
<script lang="ts" setup>
import { DeliveryAddress } from 'src/models/customer/deliveryAddress/deliveryAddress'
import CButton from '../template/buttons/CButton.vue'
import AddressSearch from '../template/inputs/AddressSearch.vue'
import CInput from '../template/inputs/CInput.vue'
import { ref, onMounted, computed } from 'vue'
import { deliveryAddressRepo } from 'src/models/customer/deliveryAddress/deliveryAddressRepo'
import { Notify } from 'quasar'
import { Address } from 'src/models/types'

const props = defineProps<{
  address?: DeliveryAddress
}>()

const newAddress = ref<DeliveryAddress | null>(null)

const isSaveAvailable = computed(() => {
  return (
    !!newAddress.value?.name?.length &&
    !!newAddress.value.address.length &&
    !!newAddress.value.floor?.length &&
    !!newAddress.value.entrance?.length
  )
})

onMounted(() => {
  newAddress.value = new DeliveryAddress({
    uuid: props.address?.id || undefined,
    name: props.address?.name || '',
    address: props.address?.address || '',
    coords: props.address?.coords || [],
    city: props.address?.city || '',
    street: props.address?.street || '',
    house: props.address?.house || '',
    flat: props.address?.flat || '',
    floor: props.address?.floor || '',
    entrance: props.address?.entrance || '',
    intercom: props.address?.intercom || '',
    description: props.address?.description || '',
  })
})

const emit = defineEmits(['back', 'create'])

const createAddress = async () => {
  try {
    if (props.address) {
      const res = await deliveryAddressRepo.update(newAddress.value)
      const foundAddressIndex = deliveryAddressRepo.items.findIndex(
        (v) => v.id === newAddress.value?.id
      )
      if (foundAddressIndex > -1) {
        deliveryAddressRepo.items[foundAddressIndex] = res
      }
      Notify.create({
        message: 'Адрес успешно изменен',
      })
    } else {
      await deliveryAddressRepo.create(newAddress.value)
      Notify.create({
        message: 'Адрес успешно создан',
      })
      emit('create')
    }
  } catch {
    if (props.address) {
      Notify.create({
        message: 'Ошибка при обновлении адреса',
        color: 'danger',
      })
    } else {
      Notify.create({
        message: 'Ошибка при создании адреса',
        color: 'danger',
      })
    }
  }
}

const selectAddress = (v: Address) => {
  if (!newAddress.value) return

  newAddress.value.address = v.address
  newAddress.value.city = v.city
  newAddress.value.coords = v.coords

  newAddress.value.flat = v.flat
  newAddress.value.street = v.street
  newAddress.value.house = v.house
}
</script>

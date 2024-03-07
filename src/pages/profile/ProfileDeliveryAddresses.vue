<template>
  <div
    v-if="$deliveryAddress.items.length"
    :style="$q.screen.lt.lg ? '' : 'max-width: 515px;'"
    style="width: 100%; height: fit-content"
    class="column gap-md-15 gap-xs-10 border-radius bg-background-color text-on-background-color"
  >
    <div class="header3 bold">Мои адреса</div>
    <div class="column full-width gap-lg-10 gap-xs-8 no-wrap">
      <template v-for="(el, index) in $deliveryAddress.items" :key="index">
        <ProfileDeliveryAddressRow
          :item="el"
          @edit="selectAddressToEdit($event)"
          @delete="openDeleteAddressModal($event)"
        />
        <q-separator
          v-if="$q.screen.lt.lg"
          color="divider-color"
          class="ml-27"
        />
      </template>
    </div>
  </div>
  <div
    v-else-if="!$deliveryAddress.loadings.list"
    :style="$q.screen.xs ? '' : 'width: 416px;'"
    style="min-height: 180px"
    class="bg-background-color bordered text-on-background-color border-radius column no-wrap justify-center items-center gap-5"
  >
    <CIcon
      color="on-background-color"
      name="fa-light fa-location-plus"
      size="60px"
    />
    <div class="row full-width justify-center">
      <div class="header3 col-9" style="text-align: center">
        У вас нет добавленных адресов доставки
      </div>
    </div>
  </div>
  <div
    style="width: fit-content"
    @click="deliveryAddressModal = true"
    class="row cursor-pointer items-center gap-6 no-wrap mt-md-10 mt-xs-8"
  >
    <CIconButton
      color="secondary"
      icon-color="on-secondary"
      icon-size="20px"
      :size="$q.screen.gt.sm ? '44px' : '40px'"
      icon="fa-regular fa-plus"
    />
    <div class="body text-on-background-color">Добавить новый адрес</div>
  </div>
  <Pagination
    :loading="$deliveryAddress.loadings.list"
    class="px-10 mt-15 full-width"
    @update:modelValue="setPage($event)"
    @appendItems="setPage($event, true)"
    :page="$deliveryAddress.pagination.page"
    :last-page="$deliveryAddress.pagination.last_page"
  ></Pagination>
  <DeliveryAddressModal
    :model-value="deliveryAddressModal"
    :address="addressToEdit || undefined"
    @update:model-value="deliveryAddressModalCloseHandler()"
    @create="deliveryAddressCreated()"
  />
  <AcceptModal
    @accept="deleteAddress()"
    v-model="deleteModal"
    text="Вы точно хотите удалить выбранный адрес?"
  />
</template>
<script lang="ts" setup>
import Pagination from 'src/components/inputs/Pagination.vue'
import DeliveryAddressModal from 'src/pages/profile/DeliveryAddressModal.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { DeliveryAddress } from 'src/models/customer/deliveryAddress/deliveryAddress'
import { deliveryAddressRepo } from 'src/models/customer/deliveryAddress/deliveryAddressRepo'
import { onMounted, ref } from 'vue'
import { authentication } from 'src/models/authentication/authentication'
import ProfileDeliveryAddressRow from './ProfileDeliveryAddressRow.vue'
import CIconButton from 'src/components/template/buttons/CIconButton.vue'
import AcceptModal from 'src/components/dialogs/AcceptModal.vue'
import { Notify } from 'quasar'

const deliveryAddressModal = ref(false)

const addressToEdit = ref<DeliveryAddress | null>(null)

const addressToDelete = ref<DeliveryAddress | null>(null)

const deleteModal = ref(false)

const deliveryAddressCreated = async () => {
  deliveryAddressModal.value = false
  await loadAddresses()
}

const deliveryAddressModalCloseHandler = () => {
  addressToEdit.value = null
  deliveryAddressModal.value = false
}

const openDeleteAddressModal = (v: DeliveryAddress) => {
  addressToDelete.value = v
  deleteModal.value = true
}

const selectAddressToEdit = (v: DeliveryAddress) => {
  addressToEdit.value = v
  deliveryAddressModal.value = true
}

const setPage = async (page = 1, appendItems = false) => {
  await loadAddresses(page, appendItems)
}

const deleteAddress = async () => {
  try {
    if (!addressToDelete.value)
      throw new Error('Адрес для удаления не может быть пустым')
    deleteModal.value = false
    await deliveryAddressRepo.delete(addressToDelete.value)
    const foundAddressIndex = deliveryAddressRepo.items.findIndex(
      (el) => el.id === addressToDelete.value?.id
    )
    if (foundAddressIndex > -1) {
      deliveryAddressRepo.items.splice(foundAddressIndex, 1)
    }
    addressToDelete.value = null
    Notify.create({
      message: 'Адрес успешно удален',
    })
  } catch {
    Notify.create({
      message: 'Ошибка при удалении адреса',
      color: 'danger',
    })
  }
}

const loadAddresses = async (page = 1, appendItems = false) => {
  await deliveryAddressRepo.list(
    {},
    {
      page: page ? page : deliveryAddressRepo.pagination.page,
      appendItems: appendItems,
      pageSize: 10,
    }
  )
}

onMounted(() => {
  if (!authentication.user) return
  void loadAddresses()
})
</script>

<style lang="scss" scoped>
.bordered {
  outline: 1px var(--secondary-button-color) solid;
}
</style>

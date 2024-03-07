<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :width="modalWidth"
    no-padding
    :height="modalHeight"
    :maximize="$q.screen.lt.lg"
    :no-close="$q.screen.lt.md"
    :position="$q.screen.lt.md ? 'bottom' : undefined"
  >
    <template v-if="!newAddressMode">
      <div
        v-if="$q.screen.gt.sm"
        class="row full-width no-wrap bg-background-color text-on-background-color border-radius"
      >
        <div
          :class="
            currentTab?.type === CartType.PICKUP ||
            (currentTab?.type === CartType.BOOKING &&
              bookingMode === 'bookingList')
              ? ''
              : 'col-12'
          "
          :style="
            currentTab?.type === CartType.PICKUP ||
            (currentTab?.type === CartType.BOOKING &&
              bookingMode === 'bookingList')
              ? `width: ${$q.screen.md ? '100%' : '47%'} `
              : ''
          "
          class="column py-lg-15 py-xs-10 px-xs-10 px-lg-15"
        >
          <ServiceModalHeader :tab="currentTab">
            <template v-slot:action>
              <CIcon
                v-if="
                  bookingMode === 'tablePicker' ||
                  bookingMode === 'tableDetail' ||
                  bookingMode === 'successBooked'
                "
                @click="navigationButtonClickHandler()"
                name="fa-regular fa-angle-left"
                hover-color="primary"
                class="cursor-pointer"
                size="24px"
              />
            </template>
          </ServiceModalHeader>
          <ServiceSettingsTabPicker
            class="mt-12 mb-13"
            @update-tab="currentTab = $event"
            :tabs="availableCartTypes"
            :model-value="currentTab || undefined"
          />
          <div>
            <DeliveryAddressesTab
              v-if="currentTab?.type === CartType.DELIVERY"
              :current-address="selectedDeliveryAddress"
              @select="selectedDeliveryAddress = $event"
              @edit="editAddressHandler($event)"
            >
              <template v-slot:bottom>
                <div class="row full-width gap-6">
                  <CButton
                    @click="confirmSelectedAddress()"
                    height="48px"
                    label="Выбрать"
                    :disabled="!selectedDeliveryAddress"
                    :loading="$cart.setParamsLoading || $store.catalogLoading"
                    class="col body"
                  />
                  <CButton
                    @click="addAddressHandler()"
                    label="Добавить адрес"
                    height="48px"
                    color="secondary-button-color"
                    class="col body"
                    text-color="on-secondary-button-color"
                  />
                </div>
              </template>
            </DeliveryAddressesTab>
            <PickupAddressesTab
              v-if="currentTab?.type === CartType.PICKUP"
              @select="selectedPickupAddress = $event"
              :current-point="selectedPickupAddress"
            >
              <template v-slot:bottom>
                <CButton
                  @click="confirmSelectedAddress()"
                  height="48px"
                  width="100%"
                  :loading="$cart.setParamsLoading || $store.catalogLoading"
                  class="body"
                  label="Заберу здесь"
                />
              </template>
            </PickupAddressesTab>
            <template v-if="currentTab?.type === CartType.BOOKING">
              <BookingAddressesTab
                v-if="bookingMode === 'bookingList'"
                @select="selectedSalesPoint = $event"
                :current-point="selectedSalesPoint"
              >
                <template v-slot:bottom>
                  <CButton
                    @click="bookingMode = 'bookingInfo'"
                    height="48px"
                    :disabled="!selectedSalesPoint"
                    width="100%"
                    class="body"
                    label="Выбрать"
                  />
                </template>
              </BookingAddressesTab>
              <BookingInfo
                v-if="bookingMode != 'bookingList'"
                :sales-point="selectedSalesPoint"
                :current-mode="bookingMode"
                @change-booking-mode="bookingMode = $event"
                @close="$emit('update:modelValue', false)"
              />
            </template>
            <DeliveryAggregatorTab
              v-if="currentTab?.type === AggregatorType.DELIVERY_CLUB"
              :tab="currentTab"
            />
            <YandexAggregatorTab
              v-if="currentTab?.type === AggregatorType.YANDEX"
              :tab="currentTab"
            />
          </div>
        </div>
        <SalesPointsOnMap
          v-if="
            $q.screen.gt.md &&
            (currentTab?.type === CartType.PICKUP ||
              (currentTab?.type === CartType.BOOKING &&
                bookingMode === 'bookingList'))
          "
          :selected-point="selectedPickupAddress"
          :addresses="currentSalesPoints || []"
          @select="
            currentTab?.type === CartType.DELIVERY
              ? (selectedSalesPoint = $event)
              : (selectedPickupAddress = $event)
          "
        />
      </div>
      <div v-else class="full-height column text-on-background-color">
        <SalesPointsOnMap
          v-if="
            mobileViewTypeConfirmed &&
            (currentTab?.type === CartType.PICKUP ||
              (currentTab?.type === CartType.BOOKING &&
                bookingMode === 'bookingList'))
          "
          :selected-point="selectedPickupAddress"
          :addresses="currentSalesPoints || []"
          @select="
            currentTab?.type === CartType.DELIVERY
              ? (selectedSalesPoint = $event)
              : (selectedPickupAddress = $event)
          "
        />
        <DeliveryTypeSelector
          v-if="!mobileViewTypeConfirmed"
          @confirm="mobileViewTypeConfirmed = true"
          @select="currentTab = $event"
          :types="availableCartTypes"
          :current-tab="currentTab"
        />
        <template v-else>
          <DeliveryAddressesTab
            v-if="currentTab?.type === CartType.DELIVERY"
            :current-address="selectedDeliveryAddress"
            @back="mobileViewTypeConfirmed = false"
            @select="selectedDeliveryAddress = $event"
            @edit="editAddressHandler($event)"
            @add-address="addAddressHandler()"
          >
            <template v-slot:bottom>
              <div class="row full-width gap-6">
                <CButton
                  @click="confirmSelectedAddress()"
                  :height="$q.screen.lt.md ? '40px' : '48px'"
                  label="Выбрать"
                  :disabled="!selectedDeliveryAddress"
                  :loading="$cart.setParamsLoading || $store.catalogLoading"
                  class="col body"
                />
              </div>
            </template>
          </DeliveryAddressesTab>
          <PickupAddressesTab
            v-if="currentTab?.type === CartType.PICKUP"
            @select="selectedPickupAddress = $event"
            @back="mobileViewTypeConfirmed = false"
            :current-point="selectedPickupAddress"
          >
            <template v-slot:bottom>
              <CButton
                @click="confirmSelectedAddress()"
                :height="$q.screen.lt.md ? '40px' : '48px'"
                width="100%"
                :loading="$cart.setParamsLoading || $store.catalogLoading"
                class="subtitle-text"
                label="Заберу здесь"
              />
            </template>
          </PickupAddressesTab>
          <template v-if="currentTab?.type === CartType.BOOKING">
            <BookingAddressesTab
              v-if="bookingMode === 'bookingList'"
              @select="selectedSalesPoint = $event"
              @back="mobileViewTypeConfirmed = false"
              :current-point="selectedSalesPoint"
            >
              <template v-slot:bottom>
                <CButton
                  @click="bookingMode = 'bookingInfo'"
                  :height="$q.screen.lt.md ? '40px' : '48px'"
                  :disabled="!selectedSalesPoint"
                  width="100%"
                  class="subtitle-text col-6"
                  label="Выбрать"
                />
              </template>
            </BookingAddressesTab>
            <BookingInfo
              v-if="bookingMode != 'bookingList'"
              :sales-point="selectedSalesPoint"
              :current-mode="bookingMode"
              @change-booking-mode="bookingMode = $event"
              @close="$emit('update:modelValue', false)"
              @back="navigationButtonClickHandler()"
            />
          </template>
          <DeliveryAggregatorTab
            v-if="currentTab?.type === AggregatorType.DELIVERY_CLUB"
            :tab="currentTab"
            @back="mobileViewTypeConfirmed = false"
          />
          <YandexAggregatorTab
            v-if="currentTab?.type === AggregatorType.YANDEX"
            :tab="currentTab"
            @back="mobileViewTypeConfirmed = false"
          />
        </template>
      </div>
    </template>
    <template v-else>
      <CreateDeliveryAddress
        :back-callback="() => (newAddressMode = false)"
        @updated="deliveryAddressCreateHandler()"
        @created="deliveryAddressCreateHandler($event)"
        :address="deliveryAddressToEdit || undefined"
      />
    </template>
  </CDialog>
</template>
<script lang="ts" setup>
import { CartType } from 'src/models/carts/cart'
import CDialog from '../template/dialogs/CDialog.vue'
import { ref, computed, watch } from 'vue'
import { companyRepo } from 'src/models/company/companyRepo'
import { authentication } from 'src/models/authentication/authentication'
import ServiceSettingsTabPicker from './ServiceSettingsTabPicker.vue'
import DeliveryAddressesTab from './DeliveryAddressesTab.vue'
import { deliveryAddressRepo } from 'src/models/customer/deliveryAddress/deliveryAddressRepo'
import { cartRepo } from 'src/models/carts/cartRepo'
import { DeliveryAddress } from 'src/models/customer/deliveryAddress/deliveryAddress'
import { SalesPoint } from 'src/models/salesPoint/salesPoint'
import { deliveryAreaRepo } from 'src/models/deliveryAreas/deliveryAreaRepo'
import { Notify, useQuasar } from 'quasar'
import { store } from 'src/models/store'
import { menuGroupRepo } from 'src/models/menu/menuGroups/menuGroupRepo'
import ServiceModalHeader from './ServiceModalHeader.vue'
import CreateDeliveryAddress from './CreateDeliveryAddress.vue'
import CButton from '../template/buttons/CButton.vue'
import PickupAddressesTab from './PickupAddressesTab.vue'
import BookingAddressesTab from './BookingAddressesTab.vue'
import SalesPointsOnMap from './SalesPointsOnMap.vue'
import BookingInfo from './BookingInfo.vue'
import CIcon from '../template/helpers/CIcon.vue'
import { AggregatorType } from 'src/models/company/company'
import DeliveryAggregatorTab from './DeliveryAggregatorTab.vue'
import YandexAggregatorTab from './YandexAggregatorTab.vue'
import { menuRepo } from 'src/models/menu/menuRepo'
import { menuItemRepo } from 'src/models/menu/menuItem/menuItemRepo'
import DeliveryTypeSelector from './DeliveryTypeSelector.vue'

export type TabRaw = {
  label: string | null
  type: string
  link?: string | null
}

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
}>()

export type BookingModes =
  | 'bookingList'
  | 'bookingInfo'
  | 'tablePicker'
  | 'tableDetail'
  | 'successBooked'

const currentTab = ref<TabRaw | null>(null)

const mobileViewTypeConfirmed = ref(false)

const newAddressMode = ref(false)

const selectedDeliveryAddress = ref<DeliveryAddress | null>(null)

const selectedPickupAddress = ref<SalesPoint | null>(null)

const selectedSalesPoint = ref<SalesPoint | null>(null)

const bookingMode = ref<BookingModes>('bookingList')

const deliveryAddressToEdit = ref<DeliveryAddress | null>(null)

const q = useQuasar()

watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      void deliveryAddressRepo.list().then(() => {
        selectCurrentTab()
      })
    }
  }
)

const modalWidth = computed(() => {
  return q.screen.lt.md
    ? '450px'
    : newAddressMode.value
    ? '1094px'
    : currentTab.value?.type === CartType.PICKUP ||
      (currentTab.value?.type === CartType.BOOKING &&
        bookingMode.value === 'bookingList')
    ? '1300px'
    : '649px'
})

const modalHeight = computed(() => {
  return q.screen.lt.md &&
    ((currentTab.value?.type === CartType.PICKUP &&
      mobileViewTypeConfirmed.value) ||
      (currentTab.value?.type === CartType.BOOKING &&
        mobileViewTypeConfirmed.value &&
        bookingMode.value === 'bookingList') ||
      newAddressMode.value)
    ? '100vh'
    : 'unset'
})

const currentSalesPoints = computed(() => {
  return currentTab.value?.type === CartType.PICKUP
    ? availablePickupAddresses.value
    : availableBookingAddresses.value
})

const availablePickupAddresses = computed(() => {
  return companyRepo.cartCompany?.salesPoints?.filter(
    (v) => v.settings.pickup_enabled
  )
})

const availableBookingAddresses = computed(() => {
  return companyRepo.cartCompany?.salesPoints?.filter(
    (v) => v.settings.booking_enabled
  )
})

const availableCartTypes = computed(() => {
  const result: TabRaw[] = []
  if (
    companyRepo.cartCompany?.salesPoints?.some(
      (v) => v.settings.delivery_enabled
    )
  ) {
    result.push({
      label: 'Доставка',
      type: CartType.DELIVERY,
    })
  }
  if (
    companyRepo.cartCompany?.salesPoints?.some((v) => v.settings.pickup_enabled)
  ) {
    result.push({
      label: 'Самовывоз',
      type: CartType.PICKUP,
    })
  }
  if (
    companyRepo.cartCompany?.salesPoints?.some(
      (v) => v.settings.booking_enabled
    ) &&
    authentication.user
  ) {
    result.push({
      label: 'Бронь',
      type: CartType.BOOKING,
    })
  }
  if (companyRepo.item)
    companyRepo.item?.deliveryAggregators.forEach((el) => {
      result.push({
        label: el.type === AggregatorType.YANDEX ? 'Яндекс еда' : 'Деливери',
        type: el.type,
        link: el.link,
      })
    })
  return result
})

const addAddressHandler = () => {
  deliveryAddressToEdit.value = null
  newAddressMode.value = true
}

const editAddressHandler = (v: DeliveryAddress) => {
  newAddressMode.value = true
  deliveryAddressToEdit.value = v
}

const deliveryAddressCreateHandler = async (newAddress?: DeliveryAddress) => {
  newAddressMode.value = false
  void deliveryAddressRepo.list()
  if (newAddress) {
    selectedDeliveryAddress.value = newAddress
    await confirmSelectedAddress()
  }
}

const navigationButtonClickHandler = () => {
  if (bookingMode.value === 'tablePicker') bookingMode.value = 'bookingInfo'
  else if (bookingMode.value === 'tableDetail')
    bookingMode.value = 'tablePicker'
  else if (
    bookingMode.value === 'successBooked' ||
    bookingMode.value === 'bookingInfo'
  )
    bookingMode.value = 'bookingList'
}

const selectCurrentTab = () => {
  if (cartRepo.item) {
    if (cartRepo.item.type === CartType.DELIVERY) {
      selectedDeliveryAddress.value = cartRepo.item.deliveryAddress
      selectedPickupAddress.value = null
      selectedSalesPoint.value = null
    }
    if (cartRepo.item.type === CartType.PICKUP) {
      selectedPickupAddress.value = cartRepo.item.salesPoint || null
      selectedDeliveryAddress.value = null
      selectedSalesPoint.value = null
      currentTab.value =
        availableCartTypes.value.find((el) => el.type === CartType.PICKUP) ||
        null
    }
    if (cartRepo.item.type === CartType.BOOKING) {
      selectedSalesPoint.value = cartRepo.item.salesPoint || null
    }
    const foundType = availableCartTypes.value.find(
      (el) => el.type === cartRepo.item?.type
    )
    if (foundType) {
      currentTab.value = foundType
      mobileViewTypeConfirmed.value = true
    }
  } else if (availableCartTypes.value.length) {
    currentTab.value = availableCartTypes.value[0]
  }
}

const openPreviousMenuItem = () => {
  if (!store.storedMenuItem) return
  if (
    menuRepo.item?.allMenuItems?.map((v) => v.id).includes(store.storedMenuItem)
  ) {
    void menuItemRepo.retrieve(store.storedMenuItem)
    store.menuItemModal = true
    store.storedMenuItem = null
  }
}

const confirmSelectedAddress = async () => {
  if (
    selectedDeliveryAddress.value &&
    currentTab.value?.type === CartType.DELIVERY
  ) {
    const res = await deliveryAreaRepo.byCoords([
      selectedDeliveryAddress.value?.coords?.latitude || 0,
      selectedDeliveryAddress.value?.coords?.longitude || 0,
    ])
    if (!res.length) {
      Notify.create({
        message: 'По данному адресу не осуществляется доставка',
        color: 'danger',
      })
      return
    }
    if (authentication.user)
      await cartRepo.setParams({
        sales_point: res[0].salesPoint,
        type: 'delivery',
        delivery_address: selectedDeliveryAddress.value?.id,
      })
    await store.loadCatalog(res[0].salesPoint)
    void openPreviousMenuItem()
    emit('update:modelValue', false)
  } else if (
    currentTab.value?.type === CartType.PICKUP &&
    selectedPickupAddress.value
  ) {
    if (authentication.user)
      await cartRepo.setParams({
        sales_point: selectedPickupAddress.value.id,
        type: 'pickup',
      })
    await store.loadCatalog(selectedPickupAddress.value)
    void openPreviousMenuItem()
    emit('update:modelValue', false)
  }
  menuGroupRepo.elementsInViewport = []
}
</script>

<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="456px"
    no-padding
    height="580px"
  >
    <template v-slot:header>
      <div v-if="mode === 'select'">Тип доставки</div>
      <div
        v-if="mode === 'create'"
        class="row gap-5 no-wrap items-center justify-between full-width"
      >
        <div class="row items-center no-wrap gap-5">
          <CIconButton
            @click="mode = 'select'"
            icon="fa-light fa-angle-left"
            hover-icon-color="primary"
            icon-class="box-shadow"
            color="white-opacity"
            icon-color="on-secondary-button-color"
            size="30px"
          />
          Создать адрес
        </div>
        <div
          class="row box-shadow bg-white-opacity px-4 py-2 border-radius justify-center items-center"
        >
          <CIcon
            color="on-secondary-button-color"
            name="fa-light fa-location-dot"
          />
        </div>
      </div>
      <div
        v-if="mode === 'bookingInfo'"
        class="row gap-5 no-wrap items-center justify-between full-width"
      >
        <div class="row items-center no-wrap gap-5">
          <CIconButton
            @click="bookingBackHandler()"
            icon="fa-light fa-angle-left"
            hover-icon-color="primary"
            color="white-opacity box-shadow"
            icon-color="on-secondary-button-color"
            size="30px"
          />
          {{
            bookingMode === 'bookingInfo'
              ? 'Данные бронирования'
              : bookingMode === 'tablePicker'
              ? 'Выберите стол'
              : 'Информация'
          }}
        </div>
        <div
          class="row box-shadow bg-white-opacity px-4 py-2 border-radius justify-center items-center"
        >
          <CIcon
            color="on-secondary-button-color"
            :name="
              bookingMode === 'tableDetail'
                ? 'fa-light fa-info-circle'
                : 'fa-light fa-calendar-day'
            "
          />
        </div>
      </div>
    </template>
    <div class="full-height text-on-background-color">
      <q-tab-panels
        style="height: 520px !important"
        animated
        v-model="mode"
        class="bg-transparent full-height"
      >
        <q-tab-panel name="select" class="pa-0 column no-wrap pt-10 px-10">
          <div class="full-width">
            <div
              :style="$q.screen.xs ? 'overflow-x: auto' : ''"
              class="row full-width no-wrap mb-15 gap-5"
            >
              <CButton
                v-for="(type, index) in availableCartTypes"
                :key="index"
                @click="currentTab = type.type"
                :label="type.label"
                :icon="type.icon"
                :class="
                  currentTab === type.type
                    ? type.class
                    : 'text-on-secondary-button-color'
                "
                :color="
                  currentTab === type.type
                    ? type.color
                    : 'secondary-button-color'
                "
              />
              <!-- <CButton
              v-if="
                $company.item?.salesPoints?.some(
                  (v) => v.settings.delivery_enabled
                )
              "
              @click="currentTab = CartType.DELIVERY"
              label="Доставка"
              height="38px"
              icon="fa-light fa-home"
              class="box-shadow"
              :class="
                currentTab === CartType.DELIVERY
                  ? 'text-on-delivery-button-color'
                  : 'text-on-secondary-button-color'
              "
              :color="
                currentTab === CartType.DELIVERY
                  ? 'delivery-button-color'
                  : 'secondary-button-color'
              "
            />
            <CButton
              v-if="
                $company.item?.salesPoints?.some(
                  (v) => v.settings.pickup_enabled
                )
              "
              @click="currentTab = 2"
              label="Самовывоз"
              height="38px"
              icon="fa-light fa-store"
              class="box-shadow"
              :class="
                currentTab === 2
                  ? 'text-on-pickup-button-color'
                  : 'text-on-secondary-button-color'
              "
              :color="
                currentTab === 2
                  ? 'pickup-button-color'
                  : 'secondary-button-color'
              "
            />
            <CButton
              v-if="
                $company.item?.salesPoints?.some(
                  (v) => v.settings.booking_enabled
                )
              "
              @click="currentTab = 3"
              label="Бронь"
              height="38px"
              icon="fa-light fa-calendar-day"
              class="box-shadow"
              :class="
                currentTab === 3
                  ? 'text-on-booking-button-color'
                  : 'text-on-secondary-button-color'
              "
              :color="
                currentTab === 3
                  ? 'booking-button-color'
                  : 'secondary-button-color'
              "
            /> -->
              <div v-if="!availableCartTypes.length">
                Нет доступных способов заказа
              </div>
            </div>
          </div>
          <div
            :class="{
              'col-grow':
                ($deliveryAddress.items.length < 6 &&
                  currentTab === CartType.DELIVERY) ||
                currentTab === CartType.PICKUP ||
                (currentTab === CartType.BOOKING &&
                  ($company.cartCompany?.salesPoints
                    ? $company.cartCompany?.salesPoints.length < 6
                    : true)) ||
                !currentTab,
            }"
            class="relative-position column no-wrap justify-between items-center pb-10"
          >
            <div
              v-if="
                !$deliveryAddress.items.length &&
                currentTab === CartType.DELIVERY
              "
            ></div>
            <q-tab-panels
              v-if="currentTab"
              animated
              v-model="currentTab"
              class="bg-transparent full-width"
            >
              <q-tab-panel
                :name="CartType.DELIVERY"
                class="px-0 py-0 full-height"
              >
                <template v-if="!deliveryAddressRepo.items.length">
                  <div></div>
                  <div class="column items-center">
                    <CIcon
                      size="75px"
                      class="mb-17"
                      name="fa-thin fa-map-location-dot"
                      color="on-background-color"
                    />
                    <div style="font-weight: 400" class="header3">
                      У вас нет адресов доставки
                    </div>
                  </div>
                </template>
                <div v-else class="column full-width">
                  <div class="full-width header2 mb-10">Адреса доставки</div>
                  <template
                    v-for="(el, index) in $deliveryAddress.items"
                    :key="index"
                  >
                    <q-separator
                      v-if="index"
                      color="divider-color"
                      class="my-6 mr-2"
                    />
                    <div
                      @click="selectedAddress = el"
                      class="row no-wrap cursor-pointer items-center pr-5 full-width justify-between"
                    >
                      <div
                        :class="{
                          'text-primary':
                            el.id === $cart.item?.deliveryAddress?.id,
                        }"
                        class="column body col-10"
                      >
                        <div class="bold mb-3">
                          {{ el.name }}
                        </div>
                        <div class="ellipsis-2-lines">
                          {{ el.address }}
                        </div>
                      </div>
                      <!-- <div
                        v-if="selectedAddress?.id === el.id"
                        class="bg-on-background-color"
                        style="border-radius: 50%; padding: 4px 6px"
                      >
                        <CIcon
                          name="fa-solid fa-check"
                          color="background-color"
                        />
                      </div> -->
                      <RoundedSelector
                        :model-value="selectedAddress?.id === el.id"
                      />
                    </div>
                  </template>
                </div>
              </q-tab-panel>
              <q-tab-panel :name="CartType.PICKUP" class="px-0 py-0 column">
                <div class="full-width header2 mb-10">Адреса самовывоза</div>
                <div
                  v-for="(el, index) in availablePickupAddresses"
                  :key="index"
                  class="full-width"
                >
                  <q-separator
                    v-if="index"
                    class="my-5"
                    color="divider-color"
                  />
                  <div
                    style="min-height: 29px"
                    @click="selectedPickupAddress = el.id || null"
                    class="row no-wrap justify-between full-width cursor-pointer items-center"
                  >
                    <div
                      :class="{
                        'text-primary':
                          el.id === $cart.item?.salesPoint?.id &&
                          $cart.item?.type === CartType.PICKUP,
                      }"
                      class="col-11 pr-5"
                    >
                      {{ el.customAddress || el.address }}
                    </div>
                    <RoundedSelector
                      :model-value="selectedPickupAddress === el.id"
                    />
                    <!-- <div
                      v-if="selectedPickupAddress === el.id"
                      class="bg-on-background-color"
                      style="border-radius: 50%; padding: 4px 6px"
                    >
                      <CIcon
                        name="fa-solid fa-check"
                        color="background-color"
                      />
                    </div> -->
                  </div>
                </div>
              </q-tab-panel>
              <q-tab-panel :name="CartType.BOOKING" class="px-0 py-0 column">
                <div class="full-width header2 mb-10">Адреса заведений</div>
                <div
                  v-for="(el, index) in availableBookingAddresses"
                  :key="index"
                  class="full-width"
                >
                  <q-separator
                    v-if="index"
                    class="my-5"
                    color="divider-color"
                  />
                  <div
                    style="min-height: 29px"
                    @click="selectedSalesPoint = el.id || null"
                    class="row justify-between no-wrap full-width cursor-pointer items-center"
                  >
                    <div
                      :class="{
                        'text-primary':
                          el.id === $cart.item?.salesPoint?.id &&
                          $cart.item?.type === CartType.BOOKING,
                      }"
                      class="col-11 pr-5"
                    >
                      {{ el.customAddress || el.address }}
                    </div>
                    <!-- <div
                      :class="{
                        'bg-on-background-color': selectedSalesPoint === el.id,
                      }"
                      style="border-radius: 50%; padding: 4px 6px"
                    >
                      <CIcon
                        :style="`visibility: ${
                          selectedSalesPoint === el.id ? 'visible' : 'hidden'
                        }`"
                        name="fa-solid fa-check"
                        color="background-color"
                      />
                    </div> -->
                    <RoundedSelector
                      :model-value="selectedSalesPoint === el.id"
                    />
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
            <div v-else></div>

            <!-- <div v-if="!currentTab" class="header3 column items-center">
              <CIcon
                size="75px"
                class="mb-17"
                color="on-background-color"
                name="fa-thin fa-truck"
              />
              <div>Выберите удобный для вас тип доставки</div>
            </div> -->

            <div class="column mt-15 items-center">
              <template v-if="currentTab === CartType.DELIVERY">
                <CButton
                  v-if="$deliveryAddress.items.length"
                  @click="mode = 'create'"
                  text-button
                  text-color="on-background-color"
                  class="mb-5"
                >
                  <div style="text-decoration: underline">
                    Создать адрес
                  </div></CButton
                >

                <CButton
                  @click="
                    $deliveryAddress.items.length
                      ? selectAddress()
                      : (mode = 'create')
                  "
                  :label="
                    $deliveryAddress.items.length ? 'Выбрать' : 'Создать адрес'
                  "
                  :disabled="
                    !selectedAddress && !!$deliveryAddress.items.length
                  "
                  class=""
                  color="button-color"
                  text-color="on-button-color"
                  :width="$q.screen.xs ? '200' : '280'"
                  height="50"
              /></template>
              <CButton
                v-else
                @click="selectAddress()"
                :label="currentTab === CartType.BOOKING ? 'Далее' : 'Выбрать'"
                :disabled="disableFurtherButton"
                class=""
                :width="$q.screen.xs ? '200' : '280'"
                color="button-color"
                text-color="on-button-color"
                height="50"
              />
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel
          style="height: 520px !important"
          name="create"
          class="pa-10"
        >
          <CreateDeliveryAddress
            @create=";(mode = 'select'), deliveryAddressRepo.list()"
          />
        </q-tab-panel>
        <q-tab-panel
          style="height: 520px !important; overflow: hidden"
          name="bookingInfo"
          class="pa-0"
        >
          <BookingInfo
            v-if="selectedSalesPoint"
            @change-booking-mode="bookingMode = $event"
            @close="$emit('update:modelValue', false)"
            :booking-mode="bookingMode"
            :sales-point="selectedSalesPoint"
          />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </CDialog>
</template>
<script lang="ts" setup>
import CButton from '../template/buttons/CButton.vue'
import CDialog from '../template/dialogs/CDialog.vue'
import { ref, watch, computed } from 'vue'
import CIcon from '../template/helpers/CIcon.vue'
import CreateDeliveryAddress from './CreateDeliveryAddress.vue'
import { deliveryAddressRepo } from 'src/models/customer/deliveryAddress/deliveryAddressRepo'
import { DeliveryAddress } from 'src/models/customer/deliveryAddress/deliveryAddress'
import { deliveryAreaRepo } from 'src/models/deliveryAreas/deliveryAreaRepo'
import { cartRepo } from 'src/models/carts/cartRepo'
import BookingInfo, { BookingModes } from './BookingInfo.vue'
import CIconButton from '../template/buttons/CIconButton.vue'
import { Notify } from 'quasar'
import RoundedSelector from 'src/components/template/buttons/RoundedSelector.vue'
import { store } from 'src/models/store'
import { CartType } from 'src/models/carts/cart'
import { companyRepo } from 'src/models/company/companyRepo'

export type ServiceModes = 'create' | 'select' | 'bookingInfo'

const currentTab = ref<CartType | null>(null)

const selectedAddress = ref<DeliveryAddress | null>(null)

const selectedPickupAddress = ref<string | null>(null)

const selectedSalesPoint = ref<string | null>(null)

const mode = ref<ServiceModes>('select')

const bookingMode = ref<BookingModes>('bookingInfo')

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
}>()

const availableCartTypes = computed(() => {
  const result = []

  if (
    companyRepo.cartCompany?.salesPoints?.some(
      (v) => v.settings.delivery_enabled
    )
  ) {
    result.push({
      label: 'Доставка',
      type: CartType.DELIVERY,
      icon: 'fa-light fa-home',
      color: 'delivery-button-color',
      class: 'text-on-delivery-button-color',
    })
  }
  if (
    companyRepo.cartCompany?.salesPoints?.some((v) => v.settings.pickup_enabled)
  ) {
    result.push({
      label: 'Самовывоз',
      type: CartType.PICKUP,
      icon: 'fa-light fa-store',
      color: 'pickup-button-color',
      class: 'text-on-pickup-button-color',
    })
  }
  if (
    companyRepo.cartCompany?.salesPoints?.some(
      (v) => v.settings.booking_enabled
    )
  ) {
    result.push({
      label: 'Бронирование',
      type: CartType.BOOKING,
      icon: 'fa-light fa-calendar-day',
      color: 'booking-button-color',
      class: 'text-on-booking-button-color',
    })
  }
  return result
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

const disableFurtherButton = computed(() => {
  return currentTab.value === CartType.PICKUP
    ? !selectedPickupAddress.value
    : !selectedSalesPoint.value
})

watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      bookingMode.value = 'bookingInfo'
      void deliveryAddressRepo.list().then(() => {
        selectCurrentAddress()
        if (availableCartTypes.value.length)
          currentTab.value = availableCartTypes.value[0].type
      })
    }
  }
)

watch(
  () => currentTab.value,
  () => {
    selectCurrentAddress()
  }
)

const selectCurrentAddress = () => {
  if (cartRepo.item) {
    if (cartRepo.item.type === CartType.DELIVERY) {
      selectedAddress.value = cartRepo.item.deliveryAddress
    }
    if (cartRepo.item.type === CartType.PICKUP)
      selectedPickupAddress.value = cartRepo.item.salesPoint.id || null
    if (cartRepo.item.type === CartType.BOOKING)
      selectedSalesPoint.value = cartRepo.item.salesPoint.id || null
  }
}

const bookingBackHandler = () => {
  bookingMode.value === 'bookingInfo'
    ? (mode.value = 'select')
    : bookingMode.value === 'tablePicker'
    ? (bookingMode.value = 'bookingInfo')
    : (bookingMode.value = 'tablePicker')
}

const selectAddress = async () => {
  if (selectedAddress.value && currentTab.value === CartType.DELIVERY) {
    const res = await deliveryAreaRepo.byCoords(selectedAddress.value?.coords)
    if (!res.length) {
      Notify.create({
        message: 'По данному адресу не осуществляется доставка',
        color: 'danger',
      })
      return
    }

    await cartRepo.setParams({
      sales_point: res[0].salesPoint,
      type: 'delivery',
      delivery_address: selectedAddress.value?.id,
    })

    await store.loadCatalog(res[0].salesPoint)

    emit('update:modelValue', false)
  } else if (
    currentTab.value === CartType.PICKUP &&
    selectedPickupAddress.value
  ) {
    await cartRepo.setParams({
      sales_point: selectedPickupAddress.value,
      type: 'pickup',
    })
    await store.loadCatalog(selectedPickupAddress.value)

    emit('update:modelValue', false)
  } else if (currentTab.value === CartType.BOOKING) {
    mode.value = 'bookingInfo'
    // await cartRepo.setParams({
    //   sales_point: selectedSalesPoint.value || '',
    //   type: 'booking',
    // });
  }
}
</script>

<style lang="scss" scoped>
.q-tab-panels.q-panel-parent {
  overflow-y: unset !important;
  overflow-x: hidden !important;
}
</style>

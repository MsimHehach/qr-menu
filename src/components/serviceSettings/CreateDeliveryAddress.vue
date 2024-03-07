<template>
  <div
    :class="$q.screen.lt.md ? 'column reverse full-height' : 'row '"
    :style="$q.screen.lt.md ? '' : 'height: 600px'"
    class="full-width no-wrap"
  >
    <div
      v-if="newAddress"
      :style="$q.screen.lt.md ? 'max-height: 65vh' : 'width: 47%'"
      class="column no-wrap justify-between text-on-background-color pa-lg-15 pa-md-10 py-xs-12 px-xs-8"
      style="overflow-y: auto"
    >
      <div class="column full-width gap-md-8 gap-xs-6">
        <div class="row items-center no-wrap gap-5 mb-md-7 mb-xs-4">
          <CIcon
            v-if="backCallback"
            class="cursor-pointer"
            color="on-background-color"
            hover-color="primary"
            name="fa-regular fa-angle-left"
            size="24px"
            @click="backCallback()"
          />
          <div class="header3 bold">
            {{ address ? address.name || 'Изменение адреса' : 'Новый адрес' }}
          </div>
        </div>
        <CInput
          v-model="newAddress.name"
          external-label="Название адреса"
          height="48px"
          placeholder="Название"
        />
        <div class="column full-width gap-md-6 gap-xs-4">
          <CButton
            :loading="geoloading"
            icon="fa-regular fa-location-dot"
            icon-size="24px"
            style="width: fit-content"
            text-button
            text-color="primary"
            @click="geolocate()"
          >
            <div class="body bold">Определить адрес автоматически</div>
          </CButton>
          <AddressSearch
            :address="newAddress.address"
            label="Укажите адрес"
            placeholder="Город, улица, дом"
            @update="selectAddress($event, 15)"
          />
        </div>
        <div v-if="!isPrivateHouse" class="row gap-5 no-wrap">
          <CInput
            v-model="newAddress.entrance"
            :readonly="isPrivateHouse"
            class="col"
            external-label="Подъезд"
            height="48px"
            placeholder="Номер"
          />
          <CInput
            v-model="newAddress.floor"
            :readonly="isPrivateHouse"
            class="col"
            external-label="Этаж"
            height="48px"
            placeholder="Номер"
            type="number"
          />
          <CInput
            v-model="newAddress.intercom"
            :readonly="isPrivateHouse"
            class="col"
            external-label="Код двери"
            height="48px"
            placeholder="Номер"
          />
        </div>
        <CInput
          v-model="newAddress.description"
          auto-grow
          height="fit-content"
          input-style="border-radius: 15px !important"
          placeholder="Комментарий"
        />
      </div>
      <div class="mt-md-15 mt-xs-8 column full-width gap-12">
        <CCheckBox
          :model-value="isPrivateHouse"
          class="body"
          label="У меня частный дом"
          size="50px"
          @click="privateHouseClickHandler()"
        />
        <CButton
          :disabled="!isSaveAvailable"
          :loading="
            $deliveryAddress.loadings.update || $deliveryAddress.loadings.create
          "
          class="body"
          height="48px"
          label="Сохранить"
          width="100%"
          @click="createAddress()"
        />
      </div>
    </div>
    <div
      :style="$q.screen.lt.md ? `` : 'height: 600px; width: 53%'"
      class="col"
    >
      <div
        id="map"
        :style="`border-radius: ${getBorderRadius};`"
        class="map"
        style="z-index: 9; width: 100%; height: 100%"
      ></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { DeliveryAddress } from 'src/models/customer/deliveryAddress/deliveryAddress'
import CButton from '../template/buttons/CButton.vue'
import AddressSearch from '../template/inputs/AddressSearch.vue'
import CInput from '../template/inputs/CInput.vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { deliveryAddressRepo } from 'src/models/customer/deliveryAddress/deliveryAddressRepo'
import { Notify, useQuasar } from 'quasar'
import { Address } from 'src/models/types'
import CIcon from '../template/helpers/CIcon.vue'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import L, { Layer } from 'leaflet'
import { CorexLeafletMap } from 'src/models/corexLeafletMap/corexLeafletMap'
import CCheckBox from '../helpers/CCheckBox.vue'
import { useGeolocation } from '@vueuse/core'
import { utilsRepo } from 'src/models/utils/utilsRepo'

const props = defineProps<{
  address?: DeliveryAddress
  backCallback?: () => void
}>()

const { coords, resume, pause } = useGeolocation()
const currentCoords = ref<{
  lat: number
  lng: number
}>()

const emit = defineEmits<{
  (evt: 'updated'): void
  (evt: 'created', val: DeliveryAddress): void
}>()

const drawnItems = new L.FeatureGroup()

const newAddress = ref<DeliveryAddress | null>(null)

const isPrivateHouse = ref(false)

const geoloading = ref(false)

const q = useQuasar()

let map: CorexLeafletMap

const isSaveAvailable = computed(() => {
  return !!newAddress.value?.name?.length && !!newAddress.value.address.length
})

const getBorderRadius = computed(() => {
  return q.screen.lt.md
    ? 'unset'
    : `0px ${uiSettingsRepo.item?.borderRadius}px ${uiSettingsRepo.item?.borderRadius}px 0`
})

const geolocate = async () => {
  geoloading.value = true
  if (coords.value.latitude !== Infinity) {
    currentCoords.value = {
      lat: coords.value.latitude,
      lng: coords.value.longitude,
    }
    await loadAddressDataByCoords()
  } else {
    currentCoords.value = undefined
    Notify.create({
      message: 'Ошибка при получении вашего положения',
      color: 'danger',
    })
  }
  geoloading.value = false
  // if (!newAddress.value) throw new Error('Объект адреса не может быть пустым')
  // resume()
  // const res = await utilsRepo.geolocate(
  //   coords.value.latitude,
  //   coords.value.longitude

  // )
  // const addressWithCorrectCoords: Address = {
  //   ...res,
  //   coords: [res.coords[1], res.coords[0]],
  // }
  // selectAddress(addressWithCorrectCoords)
  // } catch {
  //   Notify.create({
  //     message: 'Ошибка при получении вашего положения',
  //     color: 'danger',
  //   })
  // } finally {
  //   geoloading.value = false
  //   // pause()
  // }
}

const loadAddressDataByCoords = async () => {
  if (!currentCoords.value) return
  const res = await utilsRepo.geolocate(
    currentCoords.value.lat,
    currentCoords.value.lng
  )
  selectAddress(res, 13)
}

const privateHouseClickHandler = () => {
  if (!newAddress.value) return
  isPrivateHouse.value = !isPrivateHouse.value
}

const drawPoint = (zoom?: number) => {
  const values: {
    id: number | string | undefined
    coords: {
      latitude: number | null
      longitude: number | null
    }
  }[] = []
  if (newAddress.value?.coords?.latitude || newAddress.value?.coords?.longitude)
    values.push({
      id: newAddress.value.id,
      coords: newAddress.value.coords,
    })

  const collection = map.pointCollection(values)
  const layer = map.pointLayer(
    collection,
    null,
    `#${uiSettingsRepo.item?.primaryColor.color}`,
    'home'
  )

  map.lmap.addLayer(layer)
  if (values.length)
    map.lmap.fitBounds(layer.getBounds(), {
      maxZoom: zoom || map.lmap.getZoom(),
    })
}

onBeforeUnmount(() => {
  pause()
})

onMounted(() => {
  resume()
  newAddress.value = new DeliveryAddress({
    uuid: props.address?.id || undefined,
    name: props.address?.name || '',
    address: props.address?.address || '',
    coords: props.address?.coords || null,
    city: props.address?.city || '',
    street: props.address?.street || '',
    house: props.address?.house || '',
    flat: props.address?.flat || null,
    floor: props.address?.floor || null,
    entrance: props.address?.entrance || null,
    intercom: props.address?.intercom || null,
    description: props.address?.description || '',
  })
  setTimeout(() => {
    map = new CorexLeafletMap()
    if (!map) return
    map.lmap.addLayer(drawnItems)
    void geolocate()
    drawPoint(13)
    map.lmap.invalidateSize()
    map.lmap.on(
      'click',
      async (v: { latlng: { lat: number; lng: number } }) => {
        if (!newAddress.value) return
        newAddress.value.coords = {
          latitude: v.latlng.lat,
          longitude: v.latlng.lng,
        }

        const res = await utilsRepo.geolocate(v.latlng.lat, v.latlng.lng)
        const addressWithCorrectCoords: Address = {
          ...res,
        }
        selectAddress(addressWithCorrectCoords)
      }
    )
  }, 200)
})

const createAddress = async () => {
  try {
    if (props.address) {
      if (isPrivateHouse.value && newAddress.value) {
        newAddress.value.entrance = null
        newAddress.value.floor = null
        newAddress.value.intercom = null
      }
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
      emit('updated')
    } else {
      const res = await deliveryAddressRepo.create(newAddress.value)
      Notify.create({
        message: 'Адрес успешно создан',
      })
      emit('created', res)
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

const selectAddress = (v: Address, zoom?: number) => {
  if (!newAddress.value) return

  newAddress.value.address = v.address
  newAddress.value.city = v.city
  newAddress.value.coords = {
    latitude: v.coords[1],
    longitude: v.coords[0],
  }

  newAddress.value.flat = v.flat
  newAddress.value.street = v.street
  newAddress.value.house = v.house
  redrawPoint(zoom)
}

const redrawPoint = (zoom?: number) => {
  map.lmap.eachLayer((layer: Layer) => {
    if (layer instanceof map.L.Marker) layer.remove()
  })
  drawPoint(zoom)
}
</script>

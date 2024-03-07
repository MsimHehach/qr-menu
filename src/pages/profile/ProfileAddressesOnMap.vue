<template>
  <div class="relative-position">
    <template v-if="$slots.title">
      <slot name="title"></slot>
    </template>
    <div v-else class="huge3 bold mb-lg-18 mb-md-15 mb-xs-10">
      Карта с нашими заведениями
    </div>
    <div
      id="map-about-us"
      ref="mapRef"
      class="border-radius col-12 marker-shadow"
      style="width: 100%; height: 475px; z-index: 9"
    ></div>
    <div
      ref="salesPointDataRef"
      :style="{
        display: salesPointInfoModelValue ? 'block' : 'none',
      }"
      class="sales-points-info border-radius"
    >
      <SalesPointScheduleData
        :delivery-data="salesPointDeliveryData"
        :pickup-data="salesPointPickupData"
        @close="salesPointInfoModelValue = false"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { CorexLeafletMap } from 'src/models/corexLeafletMap/corexLeafletMap'
import L from 'leaflet'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { companyRepo } from 'src/models/company/companyRepo'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import { store } from 'src/models/store'
import { Feature } from 'geojson'
import { deliveryAreaRepo } from 'src/models/deliveryAreas/deliveryAreaRepo'
import { deliveryAreaSettingsRepo } from 'src/models/deliveryAreas/deliveryAreaSettings/deliveryAreaSettingsRepo'
import { SalesPoint } from 'src/models/salesPoint/salesPoint'
import { useElementBounding } from '@vueuse/core'
import SalesPointScheduleData from 'pages/profile/SalesPointScheduleData.vue'
import {
  SalesPointDeliveryData,
  SalesPointPickupData,
} from 'pages/profile/types/types'
import { DeliveryAreaSettings } from 'src/models/deliveryAreas/deliveryAreaSettings/deliveryAreaSettings'

let map: CorexLeafletMap
const mapRef = ref<HTMLDivElement | null>(null)
const salesPointDataRef = ref<HTMLDivElement | null>(null)
const mapBounding = useElementBounding(mapRef)
const drawnItems = new L.FeatureGroup()
const salesPointInfoModelValue = ref(false)
const salesPointDeliveryData = ref<SalesPointDeliveryData | null>(null)
const salesPointPickupData = ref<SalesPointPickupData | null>(null)
const colorsForSalesPointsAreas = [
  '#532bba',
  '#ba2bb1',
  '#ba2b30',
  '#67ba2b',
  '#2bbaae',
  '#2b69ba',
  '#edbb32',
]

const colorBySalesPointId = ref<Record<string, string>>({})

onMounted(() => {
  void nextTick(async () => {
    map = new CorexLeafletMap('map-about-us')
    if (!map) return
    setColorsBySalesPointsIds()
    await deliveryAreaSettingsRepo.list(
      {
        company: companyRepo.companyForProfile?.id,
      },
      { pageSize: 'all' }
    )
    await deliveryAreaRepo.list({
      company: companyRepo.companyForProfile?.id,
    })
    map.lmap.addLayer(drawnItems)
    drawPoints()
  })
})

const setColorsBySalesPointsIds = () => {
  const salesPoints = companyRepo.companyForProfile?.salesPoints || []
  const colors = colorsForSalesPointsAreas
  while (salesPoints.length > colors.length) colors.push(...colors)

  for (const [index, item] of salesPoints.entries()) {
    if (!item.id) continue
    colorBySalesPointId.value[item.id] = colors[index]
  }
}

const recomputeSalesPointDataCoords = () => {
  if (!salesPointDataRef.value) return
  const left = mapBounding.left.value
  const top = mapBounding.top.value
  const height = mapBounding.height.value
  salesPointDataRef.value.style.top = top + 10 + 'px'
  salesPointDataRef.value.style.right = left + 10 + 'px'
  salesPointDataRef.value.style.maxHeight = height - 20 + 'px'
}

watch(
  computed(
    () =>
      `${mapBounding.top.value}${mapBounding.left.value}${salesPointInfoModelValue.value}`
  ),
  () => {
    setTimeout(() => recomputeSalesPointDataCoords(), 100)
  },
  { immediate: true }
)

const drawPoints = () => {
  if (
    !companyRepo.companyForProfile ||
    !companyRepo.companyForProfile.salesPoints
  )
    return
  drawnItems.clearLayers()
  const values: {
    id: number | string | undefined
    coords: {
      latitude: number | null
      longitude: number | null
    }
  }[] = []
  for (const el of companyRepo.companyForProfile.salesPoints) {
    if (el.coords && el.active) values.push({ id: el.id, coords: el.coords })
  }

  const collection = map.pointCollection(values)
  const layer = map.pointLayer(
    collection,
    (el) => {
      drawnItems.getLayers().forEach((v) => v.closeTooltip())
      const currentSalesPoint =
        companyRepo.companyForProfile?.salesPoints?.find((v) => v.id === el.id)
      if (currentSalesPoint) {
        setSalesPointPickupData(currentSalesPoint)
        if (
          currentSalesPoint.coords.latitude &&
          currentSalesPoint.coords.longitude
        )
          map.lmap.flyTo(
            {
              lat: currentSalesPoint.coords.latitude,
              lng: currentSalesPoint.coords.longitude,
            },
            13
          )
      }
    },
    `#${uiSettingsRepo.item?.primaryColor.color}`,
    'circle',
    companyRepo.cartCompany?.image?.thumbnail || store.images.empty
  )
  for (const el of collection.features) drawDeliveryAreas(el)

  map.lmap.addLayer(layer)
  if (companyRepo.companyForProfile.salesPoints.length)
    map.lmap.fitBounds(layer.getBounds(), { maxZoom: 11 })
}

const setSalesPointPickupData = (salesPoint: SalesPoint) => {
  salesPointPickupData.value = {
    salesPoint: salesPoint,
  }
  salesPointDeliveryData.value = null
  salesPointInfoModelValue.value = true
}

const drawDeliveryAreas = async (el: Feature) => {
  const salesPointId = el.id
  const items = deliveryAreaRepo.items.filter(
    (v) => v.salesPoint === salesPointId
  )
  const salesPoints = companyRepo.companyForProfile?.salesPoints

  const salesPointColor = colorBySalesPointId.value[String(salesPointId)]
  for (const item of items.filter((v) => v.active)) {
    const layer = L.polygon(L.GeoJSON.coordsToLatLngs(item.coords), {
      color: salesPointColor,
    }).addTo(drawnItems)
    drawnItems.getLayers().forEach((v) => v.closeTooltip())
    layer.on('click', () => {
      drawnItems.getLayers().forEach((v) => v.closeTooltip())
      layer.bindTooltip('Выбранная зона', {
        direction: 'top',
        permanent: true,
      })
      layer.openTooltip()
      const salesPoint = salesPoints?.find((v) => v.id === el.id)
      if (!salesPoint)
        throw Error(
          `Sales point with id ${el.id} was not found, available sales points: ${salesPoints}`
        )
      salesPointInfoModelValue.value = true
      const filterSettings = (
        v: DeliveryAreaSettings // filter fn
      ) => v.salesPoint === salesPointId && v.deliveryArea === item.id
      salesPointDeliveryData.value = {
        deliveryArea: item,
        salesPoint: salesPoint as SalesPoint,
        deliveryAreaSettings: deliveryAreaSettingsRepo.items.filter(
          (v) => v.deliveryType === 'delivery' && filterSettings(v)
        ),
        defaultDeliveryAreaSettings: deliveryAreaSettingsRepo.items.filter(
          (v) => v.deliveryType === 'default' && filterSettings(v) // todo надо ли проверять по deliveryArea
        ),
      }
      map.lmap.fitBounds(layer.getBounds(), { maxZoom: 13 })
    })
    item.leafletId = drawnItems.getLayerId(layer)
  }
}
</script>

<style lang="scss" scoped>
.map :deep(.leaflet-draw.leaflet-control) {
  display: none;
}

.map :deep(.leaflet-top.leaflet-right) {
  display: none;
}

.sales-points-info {
  position: fixed;
  background: white;
  z-index: 1001;
}

:deep(.leaflet-interactive:focus) {
  outline: unset !important;
}
</style>

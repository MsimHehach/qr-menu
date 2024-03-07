<template>
  <div
    :class="{ col: $q.screen.lt.md }"
    :style="$q.screen.gt.sm ? 'width: 53%; height: inherit' : 'width: 100%'"
  >
    <div
      id="map"
      :style="`border-radius: ${getBorderRadius}`"
      class="marker-shadow"
      style="width: 100%; height: 100%; z-index: 9"
    ></div>
  </div>
</template>
<script lang="ts" setup>
import { CorexLeafletMap } from 'src/models/corexLeafletMap/corexLeafletMap'
import L, { Layer } from 'leaflet'
import { computed, onMounted, watch } from 'vue'
import { companyRepo } from 'src/models/company/companyRepo'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import { SalesPoint } from 'src/models/salesPoint/salesPoint'
import { useQuasar } from 'quasar'
import { store } from 'src/models/store'

const props = defineProps<{
  selectedPoint: SalesPoint | null
  addresses: SalesPoint[]
}>()

const emit = defineEmits(['select'])

let map: CorexLeafletMap
const drawnItems = new L.FeatureGroup()
const q = useQuasar()

watch(
  () => props.addresses,
  () => {
    map.lmap.eachLayer((layer: Layer) => {
      if (layer instanceof map.L.Marker) layer.remove()
    })
    drawPoints()
    map.lmap.addControl(initDraw())
  }
)

watch(
  () => props.selectedPoint,
  (v) => {
    if (v && v.coords.latitude && v.coords.longitude) {
      map.lmap.flyTo(
        {
          lat: v.coords.latitude,
          lng: v.coords.longitude,
        },
        14
      )
    }
  }
)

const getBorderRadius = computed(() => {
  return q.screen.lt.md
    ? 'unsert'
    : `0px ${uiSettingsRepo.item?.borderRadius}px ${uiSettingsRepo.item?.borderRadius}px 0`
})

const drawPoints = () => {
  if (!companyRepo.item || !props.addresses) return
  drawnItems.clearLayers()
  const values: {
    id: number | string | undefined
    coords: {
      latitude: number | null
      longitude: number | null
    }
  }[] = []
  for (const el of props.addresses) {
    if (el.coords && el.active)
      values.push({
        id: el.id,
        coords: el.coords,
      })
  }

  const collection = map.pointCollection(values)
  const layer = map.pointLayer(
    collection,
    (el) => {
      if (el.id) {
        const found = props.addresses.find((v) => v.id === el.id)
        if (found) emit('select', found)
      }
    },
    undefined,
    undefined,
    companyRepo.cartCompany?.image?.thumbnail || store.images.empty
  )

  map.lmap.addLayer(layer)
  if (props.addresses.length)
    map.lmap.fitBounds(layer.getBounds(), { maxZoom: 11 })
}

const initDraw = () => {
  return new map.L.Control.Draw({
    edit: {
      featureGroup: drawnItems,
      edit: false,
      remove: false,
    },
    draw: {
      marker: false,
      circlemarker: false,
      polyline: false,
      circle: false,
      rectangle: false,
      polygon: false,
    },
  })
}

onMounted(() => {
  setTimeout(() => {
    map = new CorexLeafletMap()
    if (!map) return
    map.lmap.addLayer(drawnItems)
    drawPoints()
    map.lmap.addControl(initDraw())
    map.lmap.invalidateSize()
  }, 200)
})
</script>

<style lang="scss" scoped></style>

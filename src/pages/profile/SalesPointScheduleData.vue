<template>
  <div
    class="px-5 pb-7 pt-10 relative-position bg-background-color text-on-background-color rounded-10"
    style="max-width: 333px"
  >
    <CIconButton
      class="absolute pa-0"
      color="transparent"
      icon-color="on-backing-color"
      icon="fal fa-times"
      no-padding
      size="20px"
      style="top: 3px; right: 3px"
      @click="$emit('close')"
    />
    <div class="column full-width px-md-5">
      <div class="subtitle-text mb-10">
        {{ salesPointName }}
      </div>
      <div class="row gap-4">
        <CButton
          v-for="item in deliverySchedule.length
            ? deliverySchedule
            : pickupSchedule"
          :key="item.day"
          :color="
            currentDay?.day === item.day
              ? 'selector-active-color'
              : 'selector-color'
          "
          :label="shortDaysNames[item.day]"
          :text-color="
            currentDay?.day === item.day
              ? 'on-selector-active-color'
              : 'on-selector-color'
          "
          height="35px"
          no-padding
          width="35px"
          @click="selectDay(item.day)"
        />
      </div>
      <div class="body mt-5">
        {{ deliverySchedule.length ? 'График доставки' : 'График работы' }}
      </div>
      <div class="column no-wrap mt-5 overflow-auto" style="max-height: 298px">
        <div
          v-if="!currentDay?.mainItem && !currentDay?.timesData.length"
          class="body"
        >
          Не заполнено
        </div>
        <template v-if="isDelivery">
          <div class="body">Расписание: {{ currentDay?.mainItem?.time }}</div>
          <div class="row items-center">
            <div class="body">
              Стоимость доставки: {{ currentDay?.mainItem?.deliveryPrice }} ₽
            </div>
            <q-icon
              v-if="currentDay?.children?.length"
              class="ml-3"
              name="fal fa-info-circle"
            >
              <q-tooltip>
                <div class="body mb-2">
                  Стоимость доставки зависит от суммы заказа
                </div>
                <div
                  v-for="(child, index) in currentDay.children"
                  :key="index"
                  class="body"
                >
                  {{ child.deliveryPrice }} ₽ при заказе от:
                  {{ child.minimalOrderSum }} ₽
                </div>
              </q-tooltip>
            </q-icon>
          </div>
          <div class="body">
            Время доставки: {{ currentDay?.mainItem?.deliveryDuration }} мин
          </div>
          <div class="body">
            Минимальная сумма заказа:
            {{ currentDay?.mainItem?.minimalOrderSum }} ₽
          </div>
        </template>
        <template v-else>
          <template v-for="(item, index) in currentDay?.timesData" :key="index">
            <q-separator v-if="index" class="my-4" />
            <div class="body">Расписание: {{ item.time }}</div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { daysNames, shortDaysNames } from 'src/services/daysEnum'
import { computed, ref, watch } from 'vue'
import moment from 'moment/moment'
import CButton from 'components/template/buttons/CButton.vue'
import CIconButton from 'components/template/buttons/CIconButton.vue'
import {
  SalesPointDeliveryData,
  SalesPointPickupData,
} from 'pages/profile/types/types'
import { SalesPointScheduleDataBuilder } from 'pages/profile/services/salesPointScheduleDataBuilder'

const props = defineProps<{
  deliveryData?: SalesPointDeliveryData
  pickupData?: SalesPointPickupData
}>()

const emit = defineEmits(['recomputePosition', 'close'])

type DefaultScheduleData = {
  day: number
  selected: boolean
}
type PickupScheduleData = DefaultScheduleData & {
  timesData: {
    time: string
  }[]
}

type DeliveryScheduleType = ReturnType<
  typeof SalesPointScheduleDataBuilder.prototype.init
>[number]

const deliverySchedule = ref<DeliveryScheduleType[]>([])
const pickupSchedule = ref<PickupScheduleData[]>([])
const isDelivery = computed(() => !!props.deliveryData)

const salesPointName = computed(() => {
  const salesPoint =
    props.deliveryData?.salesPoint || props.pickupData?.salesPoint
  return salesPoint?.customAddress || salesPoint?.address
})

watch(
  () => props.deliveryData,
  () => {
    const settings = props.deliveryData?.deliveryAreaSettings.length
      ? props.deliveryData?.deliveryAreaSettings
      : props.deliveryData?.defaultDeliveryAreaSettings || []
    if (settings?.length) {
      deliverySchedule.value = new SalesPointScheduleDataBuilder(
        settings,
        currentDay.value?.day
      ).init()
    }
  }
)

watch(
  () => props.pickupData,
  () => {
    pickupSchedule.value = processPickupAreaSettings()
  }
)

const currentDay = computed(() => {
  const settings = deliverySchedule.value.length
    ? deliverySchedule.value
    : pickupSchedule.value
  return settings.find((v) => v.selected)
})

const selectDay = (day: number) => {
  const settings = deliverySchedule.value.length
    ? deliverySchedule.value
    : pickupSchedule.value
  settings.forEach((v) => {
    v.selected = v.day === day
  })
  emit('recomputePosition')
}

const getIsDaySelected = (dayNumber: number) => {
  if (currentDay.value?.day === dayNumber) return true
  return moment().isoWeekday() === dayNumber
}

// const processDeliveryAreaSettings = (items: DeliveryAreaSettings[]) => {
//   const process = (settings: DeliveryAreaSettings) => {
//     return {
//       time:
//         settings.startTime === settings.endTime
//           ? 'Круглосуточно'
//           : `${settings.startTime} - ${settings.endTime}`,
//       deliveryDuration: settings.deliveryDuration,
//       deliveryPrice: settings.deliveryPrice,
//       minimalOrderSum: settings.minimalOrderSum,
//     }
//   }
//   const dataByTimes: Record<string, DeliveryScheduleData[]> = {}
//   const data: DeliveryScheduleData[] = []
//   for (const dayNumber of Object.keys(daysNames).map((v) => Number(v))) {
//     const currentItems = items.filter((v) =>
//       v.weekdays.some((day) => day === dayNumber)
//     )
//     const scheduleData: DeliveryScheduleData = {
//       day: dayNumber,
//       selected: getIsDaySelected(dayNumber),
//       timesData: [],
//     }
//     for (const settings of currentItems) {
//       const _data = {
//         time:
//           settings.startTime === settings.endTime
//             ? 'Круглосуточно'
//             : `${settings.startTime} - ${settings.endTime}`,
//         deliveryDuration: settings.deliveryDuration,
//         deliveryPrice: settings.deliveryPrice,
//         minimalOrderSum: settings.minimalOrderSum,
//       }
//
//       // if (!scheduleData.timesData.find((v) => v.time === _data.time))
//       scheduleData.timesData.push(_data)
//     }
//     data.push(scheduleData)
//   }
//   new SalesPointScheduleDataBuilder(items, currentDay).init()
//   return data
// }

const processPickupAreaSettings = () => {
  const data: PickupScheduleData[] = []
  const schedule = props.pickupData?.salesPoint?.schedule
  if (!schedule) return data
  for (const dayNumber of Object.keys(daysNames).map((v) => Number(v))) {
    const currentDay = schedule.days.find((v) => v.day === dayNumber)
    const scheduleData: PickupScheduleData = {
      day: dayNumber,
      selected: getIsDaySelected(dayNumber),
      timesData: [],
    }
    for (const times of currentDay?.times || []) {
      const _data = {
        time:
          times.start === times.end
            ? 'Круглосуточно'
            : `${times.start} - ${times.end}`,
      }

      // if (!scheduleData.timesData.find((v) => v.time === _data.time))
      scheduleData.timesData.push(_data)
    }
    data.push(scheduleData)
  }
  return data
}
</script>

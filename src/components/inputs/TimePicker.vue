<template>
  <CInput :model-value="date" :external-label="label" default :height="height">
    <q-menu
      v-model="menu"
      style="overflow: hidden"
      class="bg-background-color border-radius box-shadow"
    >
      <slot></slot>
      <div
        class="row py-4 gap-5 justify-between no-wrap full-width items-center relative-position text-on-background-color"
      >
        <div class="hour-highlighter"></div>
        <div class="minutes-highlighter"></div>

        <div
          class="column items-start gap-5 no-wrap hide-scroll-bar container"
          style="
            overflow-y: scroll;
            overflow-x: hidden;
            height: 100px;
            width: 100px;
          "
          @mousewheel="hourScrollHandler"
          ref="hourScrollElement"
        >
          <div
            v-for="(el, index) in hours"
            :hour-item="el"
            :key="index"
            class="child full-width pl-16"
            style="z-index: 1"
            :style="`${
              el === -1 || el === 24 ? 'visibility: hidden' : ''
            }; opacity: ${isHourAvailable(el) ? 'unset' : '0.2'}`"
            :class="currentHour === el ? 'header2 big-bold' : 'header2 light'"
          >
            {{ el }}
          </div>
        </div>
        <div
          @mousewheel="minutesScrollHandler"
          class="column gap-5 no-wrap items-end hide-scroll-bar container"
          style="
            overflow: scroll;
            overflow-x: hidden;
            height: 100px;
            width: 100px;
          "
          ref="minutesScrollElement"
        >
          <div
            v-for="(el, index) in minutes"
            :key="index"
            :mins-item="el"
            class="child full-width row justify-end pr-14"
            :class="
              currentMinutes === el ? 'header2 big-bold' : 'header2 light'
            "
            style="z-index: 1"
            :style="`${
              el === -10 || el === 60 ? 'visibility: hidden' : ''
            }; opacity: ${isMinuteAvailable(el) ? 'unset' : '0.2'}`"
          >
            {{ el }}
          </div>
        </div>
      </div>
    </q-menu>
  </CInput>
</template>
<script lang="ts" setup>
import { range } from 'lodash'
import CInput from '../template/inputs/CInput.vue'
import { ref, watch } from 'vue'
import moment from 'moment'

const props = defineProps<{
  date: string | null
  height?: string
  label?: string
  options?: { start: string; end: string }[]
  day?: string
}>()

const emit = defineEmits<{
  (evt: 'updateTime', val: string): void
}>()

// let timeout: NodeJS.Timeout | null = null

const currentHour = ref(0)
const currentMinutes = ref(0)

const menu = ref(false)

const hourScrollElement = ref<HTMLDivElement | null>(null)
const minutesScrollElement = ref<HTMLDivElement | null>(null)

const hours = range(-1, 25)
const minutes = range(-10, 70, 10)

watch(
  () => props.day,
  () => {
    updateTime()
  }
)

watch(
  () => menu.value,
  (v) => {
    if (v) {
      let hours = null
      let mins = null

      if (props.date) {
        hours = moment(props.date, 'DD.MM.YYYY HH:mm').format('HH')
        mins = moment(props.date, 'DD.MM.YYYY HH:mm').format('mm')
      }
      if (hours) currentHour.value = Number(hours)
      if (mins) currentMinutes.value = Number(mins)
      setTimeout(() => {
        const hourElement = hourScrollElement.value?.querySelector(
          `[hour-item="${currentHour.value}"]`
        )
        const minsElement = minutesScrollElement.value?.querySelector(
          `[mins-item="${currentMinutes.value}"]`
        )

        if (hourElement) {
          hourElement.scrollIntoView({
            behavior: 'instant',
            block: 'center',
            inline: 'start',
          })
        }
        if (minsElement) {
          minsElement.scrollIntoView({
            behavior: 'instant',
            block: 'center',
            inline: 'start',
          })
        }
      })
    }
  }
)

const isHourAvailable = (hour: number) => {
  if (!props.options) return true
  for (const v of props.options) {
    const startHour = Number(moment(v.start, 'HH:mm').format('HH'))
    const endHour = Number(moment(v.end, 'HH:mm').format('HH'))
    if (hour < startHour) return false
    if (hour > endHour) return false

    return true
  }
}

const isMinuteAvailable = (minute: number) => {
  if (!props.options) return true
  if (!isHourAvailable(currentHour.value)) return false
  else {
    for (const v of props.options) {
      const startHour = Number(moment(v.start, 'HH:mm').format('HH'))
      const endHour = Number(moment(v.end, 'HH:mm').format('HH'))

      if (currentHour.value === startHour) {
        const startMin = Number(moment(v.start, 'HH:mm').format('mm'))
        if (minute < startMin) return false
      } else if (currentHour.value === endHour) {
        const endMin = Number(moment(v.end, 'HH:mm').format('mm'))
        if (minute > endMin) return false
      }
      return true
    }
  }
}

const updateTime = () => {
  if (
    !isHourAvailable(currentHour.value) ||
    !isMinuteAvailable(currentMinutes.value)
  ) {
    emit('updateTime', 'error')
  } else {
    emit(
      'updateTime',
      [
        currentHour.value < 10 ? `0${currentHour.value}` : currentHour.value,
        currentMinutes.value ? currentMinutes.value : '00',
      ].join(':')
    )
  }
}

const hourScrollHandler = (event: any) => {
  const delta = event.deltaY
  if (Math.abs(delta) > 50) {
    event.preventDefault()
    const dir = delta > 0
    const scrollAmount = dir ? 50 : -50
    hourScrollElement.value?.scroll({
      top: hourScrollElement.value.scrollTop + scrollAmount,
    })
  }

  // setTimeout(() => {
  if (!hourScrollElement.value) return

  currentHour.value = Math.round(
    (26 * hourScrollElement.value?.scrollTop) /
      hourScrollElement.value.scrollHeight
  )
  updateTime()
  // })
}

const minutesScrollHandler = (event: any) => {
  const delta = event.deltaY
  if (Math.abs(delta) > 50) {
    event.preventDefault()
    const dir = delta > 0
    const scrollAmount = dir ? 50 : -50
    minutesScrollElement.value?.scroll({
      top: minutesScrollElement.value.scrollTop + scrollAmount,
    })
  }

  // setTimeout(() => {
  if (!minutesScrollElement.value) return

  currentMinutes.value =
    minutes[
      Math.round(
        (8 * minutesScrollElement.value?.scrollTop) /
          minutesScrollElement.value.scrollHeight
      ) + 1
    ]
  updateTime()
  // })
}
</script>

<style lang="scss" scoped>
.hide-scroll-bar {
  &::-webkit-scrollbar-track,
  *::-webkit-scrollbar-track {
    background-color: transparent;
  }

  &::-webkit-scrollbar,
  *::-webkit-scrollbar {
    width: 4px;
    height: 4px;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb,
  *::-webkit-scrollbar-thumb {
    background-color: var(--bg-background-color);
  }
  &::-webkit-scrollbar-corner {
    background-color: transparent;
  }
}

.container {
  scroll-snap-type: y mandatory;
}

.child {
  scroll-snap-align: center;
}

.selected-time {
  font-size: 22px;
  font-weight: 600;
}

.unselected-time {
  font-size: 22px;
  font-weight: 400;
}

.hour-highlighter {
  width: 70px;
  height: 35px;
  border-radius: 0px 10px 10px 0;
  background-color: var(--selector-color);
  position: absolute;
  left: 0px;
}

.minutes-highlighter {
  width: 70px;
  height: 35px;
  border-radius: 10px 0 0 10px;
  background-color: var(--selector-color);
  position: absolute;
  right: 0px;
}
</style>

<template>
  <div class="column full-width gap-8 pl-1">
    <div class="subtitle-text">Время</div>

    <div class="row full-width gap-md-8 gap-xs-6 body">
      <div
        v-for="(el, index) in availableTimes?.slice(0, 3)"
        :key="index"
        @click="$emit('updated', el)"
        :style="`height: ${$q.screen.lt.md ? '40px' : '48px'}`"
        :class="{ 'time-element-selected': el === time }"
        class="px-9 border-radius cursor-pointer row items-center time-element"
      >
        {{ el }}
      </div>
      <div
        class="time-element row items-center border-radius px-9 gap-3 cursor-pointer"
        :style="`height: ${$q.screen.lt.md ? '40px' : '48px'}`"
        :class="{
          'time-element-selected':
            time && availableTimes?.slice(3).includes(time),
        }"
      >
        <template v-if="$q.screen.gt.sm">
          Другое время
          <CIcon size="20px" name="fa-regular fa-angle-down" />
        </template>
        <CIcon
          v-else
          name="fa-regular fa-ellipsis"
          color="on-background-color"
          size="20px"
          hover-color="primary"
        ></CIcon>

        <q-menu
          v-model="menu"
          :fit="$q.screen.gt.sm"
          :style="
            $q.screen.lt.md ? 'width: 200px !important; overflow-x: hidden' : ''
          "
        >
          <div ref="menuRef" class="column no-wrap full-width px-4">
            <div
              v-for="(el, index) in totalDayTimes()"
              :class="[el, { 'selected-time border-radius bold': el === time }]"
              :key="index"
              @click="selectTime(el)"
              :style="
                !availableTimes?.includes(el)
                  ? 'opacity: 0.5; cursor: not-allowed !important'
                  : ''
              "
              class="full-width body cursor-pointer pa-6 time-row"
            >
              {{ el }}
            </div>
          </div>
        </q-menu>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { AvailableHours } from 'src/models/carts/cart'
import { computed, ref, watch } from 'vue'
import CIcon from '../template/helpers/CIcon.vue'
import { getTimesBetween, totalDayTimes } from 'src/models/store'

const props = defineProps<{
  availableHours: AvailableHours | null
  time: string | null
}>()

const emit = defineEmits<{
  (evt: 'updated', val: string): void
}>()

const menuRef = ref<HTMLElement | null>()

const menu = ref(false)

watch(
  () => menu.value,
  (v) => {
    if (v) {
      setTimeout(() => {
        if (!availableTimes.value || !menuRef.value) return
        const foundTimeElement = menuRef.value.getElementsByClassName(
          availableTimes.value[0]
        )
        if (foundTimeElement) {
          foundTimeElement[0].scrollIntoView()
        }
      }, 0)
    }
  }
)

const selectTime = (v: string) => {
  if (availableTimes.value?.includes(v)) {
    emit('updated', v)
    menu.value = false
  }
}

const availableTimes = computed(() => {
  if (!props.availableHours) return
  return props.availableHours.today.flatMap((v) => {
    return getTimesBetween(v.start.slice(11, 16), v.end.slice(11, 16))
  })
})
</script>

<style lang="scss" scoped>
.time-element {
  border: 1px var(--secondary) solid;
  transition: background-color 0.4s ease-out;
}

.time-element:hover {
  background-color: var(--secondary-button-color);
  color: var(--on-secondary-button-color);
  transition: background-color 0.4s ease-out;
}

.time-element-selected {
  outline: 2px var(--primary) solid;
}

.selected-time {
  border: 2px var(--primary) solid;
}
</style>

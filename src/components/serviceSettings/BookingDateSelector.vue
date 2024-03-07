<template>
  <div class="column full-width gap-8 pl-1">
    <div class="subtitle-text">Дата</div>
    <div class="row full-width gap-md-8 gap-xs-6 body">
      <div
        v-for="(el, index) in previewDates"
        :key="index"
        @click="$emit('updated', el)"
        :style="`height: ${$q.screen.lt.md ? '40px' : '48px'}`"
        class="date-element px-8 row items-center border-radius cursor-pointer"
        :class="{
          'text-on-secondary-burron-color date-element-selected': el === date,
        }"
      >
        {{ getDateName(el) }}
      </div>

      <div
        class="date-element border-radius px-9 pb-1 gap-4 cursor-pointer row items-center"
        :class="{ 'date-element-selected': isAdditionalDateSelected }"
      >
        <div v-if="isAdditionalDateSelected" class="mt-2">
          {{ getDateName(date) }}
        </div>
        <CIcon
          color="on-background-color"
          size="20px"
          name="fa-regular fa-calendar"
        >
        </CIcon>
        <q-menu auto-close
          ><q-date
            :model-value="date"
            @update:model-value="$emit('updated', $event)"
            mask="YYYY-MM-DD"
            minimal
            :options="getDateOptions"
        /></q-menu>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import moment from 'moment'
import { computed } from 'vue'
import CIcon from '../template/helpers/CIcon.vue'

const props = defineProps<{
  date: string | null
}>()

defineEmits<{
  (evt: 'updated', val: string): void
}>()

const previewDates = computed(() => {
  const res: string[] = []
  const arr = [0, 1]
  arr.forEach((el) => {
    const current = moment().add(el, 'day').format('YYYY-MM-DD')
    res.push(current)
  })

  return res
})

const isAdditionalDateSelected = computed(() => {
  return props.date && !previewDates.value.includes(props.date)
})

const getDateOptions = (date: string) => {
  return date >= moment().format('YYYY/MM/DD')
}

const getDateName = (date: string | null) => {
  if (date === moment().format('YYYY-MM-DD')) {
    return 'Сегодня'
  }
  if (date === moment().add(1, 'day').format('YYYY-MM-DD')) {
    return 'Завтра'
  }
  return moment(date, 'YYYY-MM-DD').locale('ru').format('DD MMMM')
}
</script>

<style lang="scss" scoped>
.date-element {
  border: 1px var(--secondary) solid;
  transition: background-color 0.4s ease-out;
}

.date-element:hover {
  background-color: var(--secondary-button-color);
  color: var(--on-secondary-button-color);
  transition: background-color 0.4s ease-out;
}

.date-element-selected {
  outline: 2px var(--primary) solid;
}
</style>

<template>
  <div
    style="max-width: 590px"
    class="bg-background-color text-on-background-color"
  >
    <SwiperContainer
      v-if="table.images.length"
      :slides-per-view="2"
      :items="table.images"
    >
      <template v-slot:item="{ item }">
        <div
          style="overflow: overlay; height: 167px"
          class="offer-block border-radius column no-wrap"
        >
          <q-img :src="item.image || $store.images.empty" fit="cover">
            <template v-slot:error>
              <q-img :src="$store.images.empty" fit="cover" />
            </template>
          </q-img>
        </div> </template
    ></SwiperContainer>
    <div class="subtitle-text mt-10 bold">Стол № {{ table.number }}</div>

    <div class="body mt-8" v-if="table.description">
      {{ table.description }}
    </div>
    <div class="mt-10 column body gap-5 full-width border-radius">
      <div
        v-for="(field, index) in infoFields"
        :key="index"
        class="row full-width items-center no-wrap justify-between"
      >
        <div class="row gap-8 no-wrap items-center">
          <div class="bg-primary border-radius px-5 py-4">
            <CIcon
              size="19px"
              :name="field.icon"
              :color="field.color || 'on-primary'"
            />
          </div>
          <div
            :class="
              field.color ? `text-${field.color}` : 'text-on-background-color'
            "
          >
            {{ field.label }}
          </div>
        </div>
        <div
          :class="
            field.color ? `text-${field.color}` : 'text-on-background-color'
          "
          style="opacity: 0.7"
        >
          {{ field.value }}
        </div>
      </div>
    </div>
    <div class="row mt-15 full-width justify-center">
      <CButton
        class="body"
        @click="$emit('confirmSelection')"
        label="Выбрать"
        width="280px"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import SwiperContainer from 'src/layouts/containers/SwiperContainer.vue'
import { TableRaw } from 'src/models/sections/tables/table'
import CIcon from '../template/helpers/CIcon.vue'
import CButton from '../template/buttons/CButton.vue'

const props = defineProps<{
  table: TableRaw
}>()

defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
  (evt: 'confirmSelection'): void
}>()

const infoFields = [
  {
    icon: 'fa-regular fa-user',
    label: 'Мин. вместимость',
    value: props.table.min_capacity + ' чел.',
    color: undefined,
  },
  {
    icon: 'fa-regular fa-users',
    label: 'Макс. вместимость',
    value: props.table.capacity + ' чел.',
    color: undefined,
  },
  // {
  //   icon: 'fa-light fa-wallet',
  //   label: 'Стоимость стола',
  //   value: '-',
  // },
  // {
  //   icon: 'fa-light fa-clock',
  //   label: 'Период бронирования',
  //   value: '-',
  // },
  // {
  //   icon: 'fa-light fa-lock',
  //   label: 'Стол забронирован',
  //   value: '-',
  //   color: 'red',
  // },
]
</script>

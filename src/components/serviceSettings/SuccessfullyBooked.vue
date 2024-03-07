<template>
  <div class="pt-1">
    <div class="column row items-center full-width bg-background-color gap-7">
      <CIcon name="fa-thin fa-check-circle" color="primary" size="50px" />
      <div class="header3 text-primary">Заявка на бронирование отправлена</div>
      <div class="row full-width justify-center">
        <div
          class="body text-on-background-color col-10"
          style="text-align: center"
        >
          Менеджер заведения свяжется с вами в ближайшее время для подтверждения
          брони
        </div>
      </div>
    </div>
    <div class="column full-width mt-12">
      <div class="column full-width gap-5 px-5 pb-6">
        <div
          v-for="(el, index) in infoFields"
          :key="index"
          class="row full-width items-center body justify-between"
        >
          <div class="row items-center gap-8 no-wrap">
            <div class="row px-4 py-3 border-radius bg-primary">
              <CIcon size="19px" color="on-primary" :name="el.icon" />
            </div>
            <div>{{ el.label }}</div>
          </div>
          <div>{{ el.value }}</div>
        </div>
      </div>
    </div>
    <div class="row full-width mt-15 justify-center">
      <CButton
        @click="$emit('close')"
        class="body"
        width="260px"
        label="Готово"
      />
    </div>
    <!-- <div class="column mt-15 items-center gap-13 full-width">
      <div class="header3">Хотите сделать предзаказ блюд?</div>
      <div class="row full-width gap-5 no-wrap">
        <CButton
          class="col"
          color="secondary-button-color"
          text-color="on-secondary-button-color"
          label="Нет"
        />
        <CButton class="col" label="Да" />
      </div>
    </div> -->
  </div>
</template>
<script lang="ts" setup>
import { bookingRequestRepo } from 'src/models/bookingRequest/bookingRequestRepo'
import CButton from '../template/buttons/CButton.vue'
import CIcon from '../template/helpers/CIcon.vue'

defineEmits(['close'])

const infoFields = [
  {
    icon: 'fa-light fa-calendar',
    label: 'Бронь',
    value: '-',
  },
  {
    icon: 'fa-light fa-clock',
    label: 'Дата и время',
    value: bookingRequestRepo.item?.date,
  },
  {
    icon: 'fa-light fa-user',
    label: 'Персоны',
    value: bookingRequestRepo.item?.guestsCount,
  },
  {
    icon: 'fa-light fa-table-picnic',
    label:
      bookingRequestRepo.item && bookingRequestRepo.item?.tables.length > 1
        ? 'Столы'
        : 'Стол',
    value: bookingRequestRepo.item?.tables.map((v) => v.number).join(', '),
  },
]
</script>

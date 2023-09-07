<template>
  <div
    :class="$q.screen.lt.lg ? 'column reverse' : 'row'"
    class="items-center no-wrap"
    v-if="lastPage > 1"
  >
    <div class="col-12 col-lg-7 flex justify-end">
      <div class="row justify-center">
        <CButton
          :loading="loading"
          v-if="page !== lastPage"
          @click="$emit('appendItems', page + 1)"
          width="120px"
          height="35px"
          >{{ 'Показать еще' }}</CButton
        >
      </div>
    </div>
    <div
      class="col-12 col-lg-5 flex"
      :class="`justify-${$q.screen.lt.md ? 'between' : 'end'} ${
        $q.screen.lt.lg ? 'mb-10' : ''
      } ${$q.screen.lt.md ? 'full-width' : ''}`"
    >
      <CIconButton
        v-if="$q.screen.lt.md"
        color="transparent"
        @click="$emit('update:modelValue', page == 1 ? 1 : page - 1)"
        size="30px"
        icon="fa-light fa-angle-left"
        no-padding
        icon-size="15px"
        icon-color="secondary"
      />
      <div
        class="row caption-text items-center"
        :class="`justify-${$q.screen.lt.md ? 'center' : 'end'}`"
      >
        <!-- <div class="text-secondary" v-if="!$q.screen.lg && $q.screen.gt.sm">
          {{ 'Страницы' }}
        </div> -->

        <q-pagination
          color="secondary"
          active-color="primary"
          class="ml-13 pagination"
          flat
          :modelValue="page"
          @update:modelValue="$emit('update:modelValue', $event)"
          :max="lastPage"
          :max-pages="5"
          :boundary-numbers="false"
        />

        <div class="row ml-15" v-if="$q.screen.gt.sm">
          <CIconButton
            color="transparent"
            v-if="page !== 1"
            @click="$emit('update:modelValue', 1)"
            size="30px"
            icon="fa-light fa-angles-left"
            no-padding
            icon-size="10px"
            icon-color="secondary"
          />
          <div class="row" style="gap: 18px">
            <CButton
              v-if="page !== 1"
              icon="fa-light fa-angle-left"
              icon-size="10px"
              :label="'Назад'"
              text-button
              no-padding
              text-color="secondary"
              icon-color="secondary"
              @click="$emit('update:modelValue', page - 1)"
            />
            <CButton
              v-if="page !== lastPage"
              icon-right="fa-light fa-angle-right"
              icon-size="10px"
              :label="'Вперед'"
              text-button
              no-padding
              text-color="secondary"
              icon-color="secondary"
              @click="$emit('update:modelValue', page + 1)"
            />
          </div>

          <CIconButton
            color="transparent"
            v-if="page !== lastPage"
            @click="$emit('update:modelValue', lastPage)"
            size="30px"
            icon="fa-light fa-angles-right"
            no-padding
            icon-size="10px"
            icon-color="secondary"
          />
        </div>
      </div>

      <CIconButton
        v-if="$q.screen.lt.md"
        color="transparent"
        @click="
          $emit('update:modelValue', page == lastPage ? lastPage : page + 1)
        "
        size="30px"
        icon="fa-light fa-angle-right"
        no-padding
        icon-size="15px"
        icon-color="secondary"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {} from 'vue'
import CButton from '../template/buttons/CButton.vue'
import CIconButton from '../template/buttons/CIconButton.vue'

defineEmits(['update:modelValue', 'appendItems'])

defineProps({
  page: {
    type: Number,
    default: 1,
  },
  lastPage: {
    type: Number,
    default: 1,
  },
  loading: Boolean,
})
</script>

<style lang="scss" scoped>
.pagination :deep(.q-btn--actionable.q-btn--standard:before) {
  box-shadow: none;
}
</style>

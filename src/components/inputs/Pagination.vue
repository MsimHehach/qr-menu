<template>
  <div
    :class="'column reverse'"
    class="items-center no-wrap"
    v-if="lastPage > 1"
  >
    <div class="col-12 flex justify-end mt-8">
      <div class="row justify-center">
        <CButton
          :loading="loading"
          v-if="page !== lastPage"
          @click="$emit('appendItems', page + 1)"
          width="155px"
          :height="$q.screen.lt.md ? '40px' : '44px'"
          class="body"
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
          class="pagination"
          size="16px"
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
            icon="fa-regular fa-angles-left"
            no-padding
            icon-size="16px"
            icon-color="secondary"
          />
          <div class="row" style="gap: 18px">
            <CIconButton
              color="transparent"
              v-if="page !== 1"
              @click="$emit('update:modelValue', page - 1)"
              size="30px"
              icon="fa-regular fa-angle-left"
              no-padding
              icon-size="16px"
              icon-color="secondary"
            />
            <!-- <CButton
              v-if="page !== 1"
              icon="fa-regular fa-angle-left"
              icon-size="16px"
              class="body"
              text-button
              no-padding
              text-color="secondary"
              icon-color="secondary"
              @click="$emit('update:modelValue', page - 1)"
            /> -->
            <!-- <CButton
              v-if="page !== lastPage"
              icon-right="fa-regular fa-angle-right"
              icon-size="18px"
              class="body"
              text-button
              no-padding
              text-color="secondary"
              icon-color="secondary"
              @click="$emit('update:modelValue', page + 1)"
            /> -->
            <CIconButton
              color="transparent"
              v-if="page !== lastPage"
              @click="$emit('update:modelValue', page + 1)"
              size="30px"
              icon="fa-regular fa-angle-right"
              no-padding
              icon-size="16px"
              icon-color="secondary"
            />
          </div>

          <CIconButton
            color="transparent"
            v-if="page !== lastPage"
            @click="$emit('update:modelValue', lastPage)"
            size="30px"
            icon="fa-regular fa-angles-right"
            no-padding
            icon-size="16px"
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

.pagination :deep(.q-btn--rectangle) {
  border-radius: var(--border-radius2) !important;
}
</style>

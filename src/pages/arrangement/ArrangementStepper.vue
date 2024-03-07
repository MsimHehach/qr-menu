<template>
  <div class="row justify-between items-center no-wrap">
    <div
      v-for="(el, index) in orderingSteps"
      :key="index"
      :style="index !== orderingSteps.length - 1 ? 'width: 50%' : ''"
    >
      <div
        class="row no-wrap full-height"
        :class="[
          index !== orderingSteps.length - 1 ? 'col' : '',
          { 'mb-10': $q.screen.sm && index !== currentStep },
          { 'ml-11': !index },
        ]"
      >
        <div
          class="bold 3 row justify-center items-center step"
          :class="[
            index <= currentStep
              ? 'bg-primary text-background-color'
              : 'bg-background-color text-on-background-color unselected-step',
            ,
          ]"
        >
          <div v-if="index >= currentStep" style="margin-top: 1px">
            {{ index + 1 }}
          </div>
          <CIcon
            v-else
            color="background-color"
            size="22"
            name="far fa-check"
          ></CIcon>
        </div>
        <div
          v-if="index !== orderingSteps.length - 1"
          class="devider col-grow bg-on-background-color"
          :style="`margin-top: ${
            $q.screen.sm ? (index === currentStep ? '12' : '10') : '23'
          }px`"
        ></div>
      </div>
      <div
        v-if="!$q.screen.sm || index === currentStep"
        class="mt-2 text-on-background-color"
        style="white-space: nowrap"
        :style="getTitleStyle(index)"
      >
        {{ el.title }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { CSSProperties, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// const currentStep = ref(0)

const currentStep = computed(() => {
  if (route.name === 'orderingPage') return 1
  else if (route.name === 'successOrderPage') return 2
  else return 0
})

const orderingSteps = computed(() => {
  return [
    {
      title: 'Корзина',
      to: '',
    },
    {
      title: 'Оформление заказа',
      to: '',
    },
    {
      title: 'Заказ принят',
      to: '',
    },
  ]
})

const getTitleStyle = (index: number): CSSProperties => {
  return {
    marginLeft: `${
      !index
        ? '15'
        : index === 1
        ? '-47'
        : index === 2
        ? '-23'
        : route.name === 'cart' || route.name === 'cartReview'
        ? '0'
        : '-40'
    }px`,
  }
}
</script>

<style lang="scss" scoped>
.step {
  width: 46px;
  height: 46px;
  border-radius: 50%;
}

.devider {
  // min-width: 119px;
  height: 0.5px !important;
}

.unselected-step {
  border: 1px var(--on-background-color) solid;
}
</style>

<template>
  <div class="row justify-between items-center no-wrap">
    <div
      v-for="(el, index) in steps"
      :key="index"
      :style="index !== steps.length - 1 ? 'width: 50%' : ''"
    >
      <div
        class="row no-wrap full-height"
        :class="[index !== steps.length - 1 ? 'col' : '', ,]"
      >
        <div
          class="bold header3 row justify-center items-center step"
          :class="[
            index <= currentStep
              ? 'bg-primary text-on-primary'
              : 'bg-background-color text-on-background-color unselected-step',
            ,
          ]"
          :style="
            index <= currentStep
              ? ''
              : `border: 1px #${$uiSettings.item?.secondaryColor.color} solid`
          "
        >
          <CIcon
            size="20px"
            :name="el.icon"
            :color="
              index <= currentStep ? 'background-color' : 'on-background-color'
            "
          />
        </div>
        <div
          v-if="index !== steps.length - 1"
          class="devider col-grow"
          :style="`margin-top: ${
            $q.screen.lt.md ? '22' : '25'
          }px; background-color: #${$uiSettings.item?.secondaryColor.color}`"
        ></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { OrderStatusType } from 'src/models/order/order'
import { orderRepo } from 'src/models/order/orderRepo'
import { computed } from 'vue'

const currentStep = computed(() => {
  if (
    orderRepo.item?.status === OrderStatusType.CREATED ||
    orderRepo.item?.status === OrderStatusType.VALIDATED ||
    orderRepo.item?.status === OrderStatusType.ACCEPTED
  )
    return 0
  else if (orderRepo.item?.status === OrderStatusType.COOKING) return 1
  else if (orderRepo.item?.status === OrderStatusType.ON_WAY) return 2
  else if (orderRepo.item?.status === OrderStatusType.READY) return 3
  else return 0
})

const steps = computed(() => {
  return [
    {
      icon: 'fa-regular fa-check',
    },
    {
      icon: 'fa-regular fa-hat-chef',
    },
    {
      icon: 'fa-regular fa-moped',
    },
    {
      icon: 'fa-regular fa-flag',
    },
  ]
})
</script>

<style lang="scss" scoped>
.step {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.devider {
  // min-width: 119px;
  height: 0.5px !important;
}

body.screen--xs,
body.screen--sm {
  .step {
    width: 44px;
    height: 44px;
    border-radius: 50%;
  }
}

// .unselected-step {
//   border: 1px var(--on-background-color) solid;
// }
</style>

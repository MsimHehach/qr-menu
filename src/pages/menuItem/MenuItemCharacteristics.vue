<template>
  <div v-if="actualNutritions?.length" class="column full-width gap-6">
    <div class="row full-width gap-6 justify-between items-center">
      <div class="subtitle-text bold">Пищевая ценность</div>
      <div
        style="overflow: hidden"
        class="row items-center bg-selector-color border-radius2 pa-1"
      >
        <div
          v-for="(el, index) in actualNutritions"
          :key="index"
          @click="currentNutrition = el"
          class="py-5 px-9 body border-radius2 cursor-pointer"
          :class="
            currentNutrition?.uuid === el.uuid
              ? 'bold bg-selector-active-color text-on-selector-active-color box-shadow'
              : 'text-on-selector-color'
          "
          :style="
            currentNutrition?.uuid === el.uuid
              ? 'transition: background-color 0.4s ease-out'
              : 'transition: background-color 0.3s ease-out'
          "
        >
          {{ nutritionsNames[el.type] }}
        </div>
      </div>
    </div>
    <div class="row gap-6 body">
      <div class="column gap-2">
        <div style="opacity: 0.5">Калорийность</div>
        <div>
          {{
            currentNutrition?.calories
              ? currentNutrition?.calories.toFixed() + ' ккал'
              : '-'
          }}
        </div>
      </div>
      <div class="column gap-2">
        <div style="opacity: 0.5">Белки</div>
        <div>
          {{
            currentNutrition?.proteins
              ? currentNutrition?.proteins.toFixed() + ' г'
              : '-'
          }}
        </div>
      </div>
      <div class="column gap-2">
        <div style="opacity: 0.5">Жиры</div>
        <div>
          {{
            currentNutrition?.fats
              ? currentNutrition?.fats.toFixed() + ' г'
              : '-'
          }}
        </div>
      </div>
      <div class="column gap-2">
        <div style="opacity: 0.5">Углеводы</div>
        <div>
          {{
            currentNutrition?.carbohydrates
              ? currentNutrition?.carbohydrates.toFixed() + ' г'
              : '-'
          }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ItemSize, nutritionsNames } from 'src/models/menu/menu'
import { NotritionRaw } from 'src/models/order/order'
import { onMounted, ref, computed } from 'vue'

const props = defineProps<{
  size: ItemSize
}>()

const currentNutrition = ref<NotritionRaw | null>(null)

const actualNutritions = computed(() => {
  return props.size?.nutritions.filter((v) => {
    return !!v.calories || !!v.carbohydrates || !!v.fats || !!v.proteins
  })
})

onMounted(() => {
  setTimeout(() => {
    if (actualNutritions.value.length)
      currentNutrition.value = actualNutritions.value[0]
  }, 300)
})
</script>

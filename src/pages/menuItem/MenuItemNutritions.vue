<template>
  <div>
    <CIcon
      size="24px"
      color="text-on-background-color"
      name="fa-light fa-info-circle"
      class="cursor-pointer"
    >
      <q-menu
        class="column body text-on-backing-color bg-backing-color border-radius py-10 px-6"
      >
        <div
          v-for="(nutrition, index) in currentSize?.nutritions"
          :key="index"
          class="full-width"
        >
          <q-separator v-if="index" class="my-5" />
          <div class="row no-wrap gap-2 bold mb-8">
            <div style="white-space: nowrap">Пищевая ценность</div>
            /
            <div style="white-space: nowrap">
              {{ `${nutritionsNames[nutrition.type]}` }}
            </div>
          </div>
          <div class="column full-width gap-6">
            <div class="row full-width gap-3">
              <div class="bold col-7">Калории:</div>
              <div v-if="nutrition.calories">{{ nutrition.calories }} г</div>
              <div v-else>Не указано</div>
            </div>
            <div class="row full-width gap-3">
              <div class="bold col-7">Жиры:</div>
              <div v-if="nutrition.fats">{{ nutrition.fats }} г</div>
              <div v-else>Не указано</div>
            </div>
            <div class="row full-width gap-3">
              <div class="bold col-7">Углеводы:</div>
              <div v-if="nutrition.carbohydrates">
                {{ nutrition.carbohydrates }} г
              </div>
              <div v-else>Не указано</div>
            </div>
            <div class="row full-width gap-3">
              <div class="bold col-7">Белки:</div>
              <div v-if="nutrition.proteins">{{ nutrition.proteins }} г</div>
              <div v-else>Не указано</div>
            </div>
          </div>
        </div>
      </q-menu>
    </CIcon>
  </div>
</template>
<script lang="ts" setup>
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { ItemSize, nutritionsNames } from 'src/models/menu/menu'

defineProps<{
  currentSize: ItemSize | null
}>()
</script>

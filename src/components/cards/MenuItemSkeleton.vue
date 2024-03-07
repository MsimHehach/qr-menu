<template>
  <div>
    <q-card
      style="height: 460px"
      class="no-box-shadow border-radius bg-backing-color"
      bordered
    >
      <q-item class="justify-center pa-0">
        <q-skeleton
          :style="`border-radius: ${getBorderRadius}`"
          :width="'100%'"
          class="bg-backing-color"
          :height="imageSize"
          square
        />
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>
            <div class="flex mt-2" style="justify-content: space-between">
              <q-skeleton
                type="text"
                width="100%"
                height="30px"
                class="mb-2 mb-md-3 bg-backing-color"
              />
            </div>
            <q-skeleton type="text" height="30px" width="80px" class="mt-8" />
          </q-item-label>
          <!-- <q-item-label>
            <q-skeleton type="text" width="80%" class="mb-2 mb-md-10" />
          </q-item-label> -->
        </q-item-section>
      </q-item>
    </q-card>
  </div>
</template>
<style scoped></style>
<script setup lang="ts">
import { computed } from 'vue'
import { Screen } from 'quasar'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'

const imageSize = computed(() => {
  if (Screen.gt.md) return '250px'
  if (Screen.gt.sm) return '250px'
  return '210px'
})

const getBorderRadius = computed(() => {
  return `${uiSettingsRepo.item?.borderRadius}px ${uiSettingsRepo.item?.borderRadius}px 0 0`
})
</script>

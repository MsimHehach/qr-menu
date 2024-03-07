<template>
  <div
    class="mt-8 border-radius full-width pa-5 bg-backing-color text-on-backing-color body"
  >
    <div class="bold mb-6">Будет добавлено к заказу</div>
    <div class="column full-width gap-3">
      <template v-for="(el, index) in items" :key="index">
        <q-separator v-if="index" color="divider-color" />
        <div class="row items-center full-wisth no-wrap justify-between">
          <div class="items-center no-wrap row gap-5">
            <q-img
              :src="el.addedMenuItem?.image?.thumbnail"
              style="max-width: 40px; min-width: 40px; height: 40px"
              class="border-radius2"
              fit="cover"
            >
              <template v-slot:error>
                <span>
                  <q-img
                    fit="cover"
                    style="max-width: 40px; min-width: 40px; height: 40px"
                    :src="$store.images.empty"
                  ></q-img>
                </span> </template
            ></q-img>
            <div>
              {{ el.addedMenuItem?.name }}
            </div>
          </div>
          <div>
            {{ el.quantity }} x
            {{ beautifyNumber(el.addedMenuItem?.sizes[0].price || 0, true) }}₽
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { MenuRulesForAdding } from 'src/models/menu/menuItem/menuRulesForAdding/menuRulesForAdding'
import { beautifyNumber } from 'src/models/store'

defineProps<{
  items: MenuRulesForAdding[]
}>()
</script>

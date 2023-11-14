<template>
  <div
    style="height: 320px; overflow: overlay"
    class="bg-product-tile-color box-shadow border-radius column no-wrap cursor-pointer"
    @click="
      $router.push({ name: 'menuItemPage', params: { menuItemId: item.id } })
    "
  >
    <q-img
      :src="item.image?.thumbnail || $store.images.empty"
      height="210px"
      fit="cover"
    >
      <template v-slot:error>
        <span>
          <q-img
            class="user-image"
            fit="cover"
            height="210px"
            :src="$store.images.empty"
          ></q-img>
        </span>
      </template>
    </q-img>
    <div
      class="px-6 py-8 column justify-between col-grow text-on-product-tile-color"
    >
      <div class="body mb-5 ellipsis-2-lines">
        {{ item.name }}
      </div>

      <div class="header3 text-on-product-tile-color">
        {{ item.sizes[0].price }}
        ₽
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { MenuItem } from 'src/models/menu/menuItem/menuItem'

defineProps<{
  item: MenuItem
}>()
</script>

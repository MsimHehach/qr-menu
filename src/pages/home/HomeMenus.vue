<template>
  <div>
    <template v-if="!$salesPoint.menuLoading && $menu.item?.groups">
      <div
        v-for="(el, index) in $menu.item.groups.filter((v) => v.items.length)"
        :key="index"
        class="full-width pt-md-20 pt-xs-10"
        :id="el.id"
      >
        <div class="header bold mb-lg-15 mb-md-15 mb-xs-8">
          {{ el.name }}
        </div>
        <div v-if="el.items.length" class="row full-width">
          <GridContainer
            :items="el.items"
            :lg="4"
            :xl="4"
            :md="3"
            :sm="2"
            :xs="2"
            :gap="$q.screen.gt.md ? '20px' : $q.screen.md ? '16px' : '8px'"
          >
            <template v-slot:item="{ item }">
              <MenuItemCard :item="(item as MenuItem)" />
            </template>
          </GridContainer>
        </div>
        <div v-else>Пусто</div>
      </div>
    </template>
    <div v-else class="full-width">
      <q-skeleton type="text" width="210px" height="45px" class="mb-10 mt-18" />
      <GridContainer
        :items="[1, 2, 3, 4, 5, 6, 7, 8]"
        :lg="4"
        :xl="4"
        :md="3"
        :sm="2"
        :xs="2"
        :gap="$q.screen.gt.md ? '30px' : $q.screen.md ? '16px' : '8px'"
      >
        <template v-slot:item="{ item }">
          <MenuItemSkeleton :id="item" />
        </template>
      </GridContainer>
    </div>
  </div>
</template>
<script lang="ts" setup>
import MenuItemCard from 'src/components/cards/MenuItemCard.vue'
import MenuItemSkeleton from 'src/components/cards/MenuItemSkeleton.vue'
import GridContainer from 'src/components/containers/GridContainer.vue'
import { MenuItem } from 'src/models/menu/menuItem/menuItem'
</script>

<style lang="scss" scoped>
.inactive-company {
  border: 1px var(--on-background-color) solid;
}

.active-company {
  width: fit-content;
  border: 2px var(--primary) solid;
}
</style>

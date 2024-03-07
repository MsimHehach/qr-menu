<template>
  <div class="row full-width no-wrap justify-between items-center">
    <div class="row items-center gap-6">
      <div
        class="mark-block bg-secondary border-radius2 row items-center justify-center"
      >
        <CIcon
          name="fa-regular fa-location-dot"
          size="24px"
          color="on-secondary"
        />
      </div>
      <div class="body">
        {{ item.name }}
      </div>
    </div>
    <MenuActions :structure="structure" icon-only />
  </div>
</template>
<script lang="ts" setup>
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { DeliveryAddress } from 'src/models/customer/deliveryAddress/deliveryAddress'
import MenuActions from 'src/components/template/menuActions/MenuActions.vue'
import { MenuActionItems } from 'src/components/template/menuActions/menuActionsServices'
import { computed } from 'vue'

const props = defineProps<{
  item: DeliveryAddress
}>()

const emit = defineEmits<{
  (evt: 'edit', val: DeliveryAddress): void
  (evt: 'delete', val: DeliveryAddress): void
}>()

const structure = computed<MenuActionItems[]>(() => {
  const items: MenuActionItems[] = [
    {
      items: [
        {
          title: 'Изменить адрес',
          icon: 'fa-light fa-pencil',
          click: () => {
            emit('edit', props.item)
          },
        },
      ],
    },
    {
      items: [
        {
          title: 'Удалить',
          icon: 'fa-light fa-trash',
          click: () => {
            emit('delete', props.item)
          },
        },
      ],
    },
  ]

  return items
})
</script>

<style lang="scss" scoped>
.mark-block {
  height: 44px;
  min-height: 44px;
  width: 44px;
  min-width: 44px;
}

body.screen--xs,
body.screen--sm {
  .mark-block {
    height: 40px;
    min-height: 40px;
    width: 40px;
    min-width: 40px;
  }
}
</style>

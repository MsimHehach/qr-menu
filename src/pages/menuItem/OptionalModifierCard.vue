<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div
    @click="cardClickHandler()"
    class="column cursor-pointer no-wrap justify-between box-shadow bg-backing-color text-on-backing-color border-radius px-7 pb-5 items-center body full-height relative-position"
    :class="
      modifier.quantity
        ? 'bordered-card-active'
        : $companyGroup.item?.externalId === 'corex_demo'
          ? 'bordered-card'
          : ''
    "
  >
    <div v-if="modifier.quantity" class="check-block">
      <q-icon
        name="fa-regular fa-check"
        size="13px"
        color="backing-color"
        style="transform: translate(35%, 0%)"
      />
    </div>
    <div class="column full-width items-center">
      <q-img
        style="height: 80px; width: 80px"
        :src="modifier.image?.thumbnail || 'assets/emptyMod.svg'"
      >
        <template v-slot:error>
          <span>
            <q-img
              class="border-radius"
              style="height: 80px; width: 80px"
              src="assets/emptyMod.svg"
            ></q-img>
          </span>
        </template>
      </q-img>
      <!-- {{ modifier.image?.thumbnail }} -->
      <template v-if="modifier.quantity === 0">
        <div
          class="mt-4 ellipsis-2-lines"
          style="text-align: center; width: inherit"
        >
          {{ modifier.name }}
        </div>
      </template>
    </div>
    <template v-if="modifier.quantity === 0">
      <div style="text-align: center" class="bold">{{ modifier.price }} ₽</div>
    </template>
    <ChangeAmount
      v-else
      background-class="bg-secondary-button-color"
      buttons-color="secondary-button-color"
      :model-value="modifier.quantity"
      text-color="on-secondary-button-color"
      class="mt-7"
      small
      @update:model-value="updateQuantity"
      :disable-adding="
        (group.restrictions && isGroupLimitReached) ||
        modifier.quantity >= modifier.restrictions.max_quantity ||
        modifier.reserve !== null
          ? modifier.reserve! <= modifier.quantity
          : false
      "
    />
  </div>
</template>
<script lang="ts" setup>
import { sum } from 'lodash'
import ChangeAmount from 'src/components/inputs/ChangeAmount.vue'
import {
  MenuModifierGroup,
  MenuModifierGroupItem,
} from 'src/models/menu/menuModifierGroup/menuModifierGroup'
import { computed } from 'vue'

const props = defineProps<{
  modifier: MenuModifierGroupItem
  group: MenuModifierGroup
}>()

const isGroupLimitReached = computed(() => {
  return props.group.restrictions
    ? sum(props.group.items.map((v) => v.quantity)) >=
        props.group.restrictions?.max_quantity
    : false
})

const cardClickHandler = () => {
  if (!!props.modifier.quantity || isGroupLimitReached.value) return
  // eslint-disable-next-line vue/no-mutating-props
  props.modifier.quantity = 1
}

const updateQuantity = (v: number) => {
  // eslint-disable-next-line vue/no-mutating-props
  props.modifier.quantity = v
}
</script>

<style lang="scss" scoped>
.bordered-card {
  border: 1px #f5f5f5 solid;
}

.bordered-card-active {
  border: 1px var(--primary) solid;
}

.check-block {
  border-radius: 50%;
  height: 22px;
  width: 22px;
  background-color: var(--primary);
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 1;
}
</style>

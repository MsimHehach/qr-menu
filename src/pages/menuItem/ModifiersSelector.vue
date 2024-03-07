<template>
  <div class="row">
    <div
      style="min-height: 36px"
      class="row no-wrap justify-between full-width mb-4"
    >
      <div class="header3 bold col-8 ellipsis-2-lines">
        {{ group.name
        }}<span
          v-if="
            group.restrictions?.min_quantity &&
            !sum(group.items.map((el) => el.quantity))
          "
          class="text-primary"
        >
          *</span
        >
      </div>
      <q-chip
        v-if="
          group.restrictions?.min_quantity &&
          !sum(group.items.map((el) => el.quantity))
        "
        class="text-on-secondary-button-color"
        color="secondary-button-color"
      >
        {{ 'Обязательно' }}
      </q-chip>
    </div>

    <div class="column full-width no-wrap">
      <div
        v-if="group.restrictions && group.restrictions.max_quantity > 1"
        class="row justify-between mb-10"
      >
        <div style="opacity: 0.5" class="bold">
          Добавлено: {{ sum(group.items.map((v) => v.quantity)) }} /{{
            group.restrictions?.max_quantity
          }}
        </div>

        <CIcon
          v-if="group.items.some((v) => v.quantity)"
          @click="clearSelection()"
          class="cursor-pointer"
          color="on-background-color"
          hover-color="primary"
          name="fa-light fa-trash"
        />
      </div>
      <div class="column">
        <template v-if="modifierViewType === 'radio'">
          <ModifierRadioSelectorRow
            v-for="(el, index) in currentModifiers"
            :key="index"
            @select="radioClickHandler($event)"
            :item="el"
          />
        </template>

        <template v-if="modifierViewType === 'check'">
          <ModifierCheckSelectorRow
            v-for="(el, index) in currentModifiers"
            :key="index"
            @select="checkboxClickHandler($event)"
            :item="el"
          />
        </template>
        <template v-if="modifierViewType === 'row'">
          <ModifierSelectorRow
            v-for="(el, index) in currentModifiers"
            :key="index"
            :item="el"
            :group="group"
          />
        </template>

        <div v-if="modifierViewType === 'card'" class="row full-width">
          <GridContainer
            :items="currentModifiers"
            :lg="3"
            :xl="3"
            :md="3"
            :sm="2"
            :xs="2"
            gap="20px"
          >
            <template v-slot:item="{ item }: { item: MenuModifierGroupItem }">
              <OptionalModifierCard :group="group" :modifier="item" />
            </template>
          </GridContainer>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CIcon from 'src/components/template/helpers/CIcon.vue'
import {
  MenuModifierGroup,
  MenuModifierGroupItem,
} from 'src/models/menu/menuModifierGroup//menuModifierGroup'
import GridContainer from 'src/components/containers/GridContainer.vue'
import OptionalModifierCard from './OptionalModifierCard.vue'
import { computed } from 'vue'
import ModifierRadioSelectorRow from './ModifierRadioSelectorRow.vue'
import ModifierCheckSelectorRow from './ModifierCheckSelectorRow.vue'
import ModifierSelectorRow from './ModifierSelectorRow.vue'
import { sum } from 'lodash'

const props = defineProps<{
  group: MenuModifierGroup
}>()

const currentModifiers = computed(() => {
  return props.group.items.filter(
    (v) => !v.is_hidden && (v.reserve === null || v.reserve > 0)
  )
})

const modifierViewType = computed(() => {
  if (props.group.restrictions) {
    if (props.group.restrictions?.max_quantity < 2) {
      return 'radio'
    } else {
      if (props.group.items.every((v) => v.restrictions.max_quantity === 1)) {
        return 'check'
      } else {
        if (props.group.items.some((v) => v.image)) return 'card'
        else return 'row'
      }
    }
  } else return undefined
})

const radioClickHandler = (item: MenuModifierGroupItem) => {
  props.group.items.forEach((el) => (el.quantity = 0))
  item.quantity = 1
}

const checkboxClickHandler = (item: MenuModifierGroupItem) => {
  if (!item.quantity) {
    if (
      props.group.restrictions &&
      sum(props.group.items.map((v) => v.quantity)) <
        props.group.restrictions?.max_quantity
    )
      item.quantity = 1
    else return
  } else {
    item.quantity = 0
  }
}

const clearSelection = () => {
  props.group.items.forEach((el) => (el.quantity = 0))
}
</script>

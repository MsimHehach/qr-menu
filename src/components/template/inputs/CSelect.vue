<template>
  <div>
    <div v-if="externalLabel" :class="'mb-4 helper-text bold'">
      {{ externalLabel }}
    </div>
    <q-select
      :class="{
        'select-border-rounded': rounded,
        'cselect-row': row,
        'no-icon': noIcon,
      }"
      :options="items"
      :option-value="itemValue"
      :option-label="itemLabel"
      :options-dense="itemsDense"
      :option-disable="optionDisable"
      :label="label"
      :multiple="multiple"
      :readonly="readonly"
      :auto-complete="autoComplete"
      :loading="loading"
      :rules="rules"
      :name="name"
      :input-style="inputStyle"
      :input-class="inputClass"
      :dense="dense"
      :use-input="useInput"
      :rounded="rounded"
      :standout="standout"
      :borderless="borderless || $uiSettings.item?.inputType === 'filled'"
      :input-debounce="inputDebounce || 300"
      :filled="filled"
      :dark="dark"
      @change="$emit('change')"
      @filter="filterFn"
      @update:modelValue="$emit('update:modelValue', $event)"
      :modelValue="modelValue"
      :bg-color="_bgColor"
      :color="color"
      :label-color="labelColor"
      :hide-selected="!multiple && useInput"
      :fill-input="!multiple && useInput"
      :map-options="emitValue"
      :emit-value="emitValue"
      :style="`height: ${height || '42px'}; ${width ? `width: ${width};` : ''}`"
      behavior="menu"
      :stack-label="stackLabel"
      :outlined="_outlined"
      @virtual-scroll="$emit('virtualScroll', $event)"
      :use-chips="useChips"
    >
      <template v-if="modelValue && clearable" v-slot:append>
        <CIconButton
          icon="fal fa-times"
          @click="$emit('update:modelValue', null)"
          no-padding
          size="30"
          icon-size="16px"
          color="transparent"
          class="cursor-pointer"
        />
      </template>

      <template v-if="useRadio" v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-radio
            style="margin-left: -6px"
            color="accent3"
            size="40px"
            @update:model-value="$emit('update:modelValue', scope.opt.value)"
            v-model="radioValue"
            :val="scope.opt.title"
            :label="scope.opt.title"
          ></q-radio>
        </q-item>
        <q-separator divider-color color="secondary1 mx-10"></q-separator>
      </template>
      <template v-slot:before-options v-if="!!$slots['before-options']">
        <slot name="before-options"></slot>
      </template>
      <template v-slot:no-option>
        <slot name="no-option"></slot>
      </template>
      <template v-slot:default>
        <slot name="default"></slot>
      </template>
      <template v-slot:selected-item="scope" v-if="$slots.selectedItem">
        <slot name="selectedItem" :scope="scope"></slot>
      </template>
      <template v-slot:selected v-if="!!$slots.selected">
        <slot name="selected"></slot>
      </template>
      <template v-slot:prepend v-if="!!$slots.prepend">
        <slot name="prepend"></slot>
      </template>
    </q-select>
  </div>
</template>

<script setup lang="ts">
import CIconButton from '../buttons/CIconButton.vue'
import { computed, ref } from 'vue'
import { QSelect } from 'quasar'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'

defineEmits(['update:modelValue', 'change', 'virtualScroll', 'click'])

const props = defineProps<{
  labelColor?: string
  modelValue?: any
  color?: string
  bgColor?: string
  dark?: boolean
  filled?: boolean
  borderless?: boolean
  standout?: boolean | string
  rounded?: boolean
  dense?: boolean
  inputClass?: object | string | any[]
  inputStyle?: object | string | any[]
  name?: string
  rules?: any[]
  loading?: boolean
  fillInput?: boolean
  autoComplete?: string
  multiple?: boolean
  items?: any[]
  itemLabel?: string | ((v: any) => any)
  itemValue?: string | ((v: any) => any)
  itemsDense?: boolean
  disabled?: boolean
  label?: string
  height?: string
  width?: string
  clearable?: boolean
  row?: boolean
  useInput?: boolean
  hideSelected?: boolean
  inputDebounce?: string | number
  emitValue?: boolean
  stackLabel?: boolean
  outlined?: boolean
  default?: boolean
  optionDisable?: string
  noIcon?: boolean
  filter?: (value: string) => void
  readonly?: boolean
  useRadio?: boolean
  useChips?: boolean
  externalLabel?: string
}>()

const radioValue = ref<string>(props.modelValue as string)

const lastSearch = ref<string | null>(null)

const _outlined = computed(() => {
  return props.outlined || uiSettingsRepo.item?.inputType === 'outlined'
})

const _bgColor = computed(() => {
  if (props.bgColor) return props.bgColor
  else return 'input-color'
})

const filterFn = (
  search: string,
  update: (func: () => void, refFunc: (ref: QSelect) => void) => void
) => {
  update(
    () => {
      if (!props.filter) return
      if (search === lastSearch.value) return
      props.filter(search)
      lastSearch.value = search
    },
    (ref: QSelect) => {
      ref.setOptionIndex(-1)
      ref.moveOptionSelection(1, true)
    }
  )
}
</script>

<style lang="scss">
.q-select .q-field__native.row.items-center span {
  margin-top: 0 !important;
}

.q-select .q-field__control {
  border-radius: var(--border-radius);
}

.q-select .q-field__native {
  color: var(--on-input-color);
}

// .q-select .q-field__native {
//   padding-left: 10px;
// }

.q-select:not(.q-file).q-field--float .q-field__label {
  transform: translate(0, -50%) scale(0.85) !important;
  top: 0px !important;
  padding: 0 5px;
  z-index: 1;
  transition: all 0.3s;
  width: fit-content;
}

.q-field--float .q-field__label {
  transform: translateY(-60%) scale(0.75);
}

.cselect-row .q-field__control {
  padding: 0 0 0 7px !important;
}

.cselect-row .q-field__append {
  padding: 0 !important;
}

.q-select {
  @mixin ellipsis {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  &.ellipsis,
  &.ellipsis-2-lines,
  &.ellipsis-3-lines {
    overflow: unset !important;
    text-overflow: unset !important;
    white-space: unset !important;

    span {
      @include ellipsis;
    }
  }

  .ellipsis-2-lines {
    -webkit-line-clamp: 2;
  }

  .ellipsis-3-lines {
    -webkit-line-clamp: 3;
  }
}

.cselect-row .q-field__native {
  padding: 9px 0;
}

.rounded .q-field__control {
  border-radius: 4px;
}

.q-select .q-field__inner {
  height: inherit;
}

.no-icon .q-field__append .q-icon.text-negative.material-icons {
  display: none;
}
</style>

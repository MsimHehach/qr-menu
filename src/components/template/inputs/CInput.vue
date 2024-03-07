<template>
  <div
    :class="[
      { 'menu-mode': menuMode },
      { 'rounded-text-area': $props.default && textArea },
    ]"
    :style="$q.platform.is.safari ? `--input-height: ${_height}` : ''"
  >
    <div
      v-if="externalLabel"
      :class="[
        externalLabelClass
          ? externalLabelClass
          : _rounded
          ? 'mb-2 helper-text ml-6'
          : 'mb-2 helper-text',
      ]"
      class="bold"
    >
      {{ externalLabel }}
    </div>
    <q-input
      ref="inputRef"
      :autocomplete="autocomplete"
      :autogrow="autoGrow"
      :bg-color="_bgColor"
      :borderless="changeAmount || borderless"
      :class="{
        'label-top': _labelTop,
        'no-icon': _noIcon,
        'default-input': !changeAmount,
      }"
      :clearable="clearable"
      :color="_color"
      :dense="dense"
      :disable="_disabled"
      :disabled="_disabled"
      :fill-mask="fillMask"
      :filled="changeAmount ? false : $uiSettings.item?.inputType === 'filled'"
      :hint="hint"
      :input-class="inputClass ? inputClass : 'text-on-input-color body'"
      :input-style="inputStyle"
      :label="label"
      :label-color="labelColor"
      :loading="loading"
      :mask="mask"
      :modelValue="
        props.customFormattedValue !== undefined && !focused && mounted
          ? customFormattedValue
          : formattedValue
      "
      :outlined="
        changeAmount
          ? false
          : outlined || $uiSettings.item?.inputType === 'outlined'
      "
      :placeholder="placeholder"
      :readonly="readonly"
      :rounded="_rounded"
      :rules="rules"
      :square="square ? true : false"
      :standout="_standout"
      :style="`width:${width || 'unset'}; height:${_height};`"
      :type="_type"
      :unmasked-value="unmaskedValue"
      class="circlized"
      @blur="_blurInput"
      @focus="_focusInput"
      @update:model-value="updateModelValue"
      @keyup.enter.prevent="$emit('enter')"
      @keydown.right="emitDirectionKeys('right', $event)"
      @keydown.left="emitDirectionKeys('left', $event)"
      @keydown.up.prevent="$emit('up')"
      @keydown.down.prevent="$emit('down')"
    >
      <template v-if="$slots.prepend" v-slot:prepend>
        <slot name="prepend"></slot>
        <q-icon
          v-if="leftIcon"
          :name="leftIcon"
          :style="`font-size:${iconSize || '16px'} !important; color:${
            iconColor || 'white'
          }; opacity:${iconOpacity}; `"
          @click="$emit('iconClick')"
        />
      </template>
      <template v-slot:append>
        <slot name="append"></slot>
        <q-icon
          v-if="icon"
          :name="icon"
          :style="`font-size:${iconSize || '16px'} !important; color:${
            iconColor || 'white'
          }; opacity:${iconOpacity}; `"
          @click="$emit('iconClick')"
        />
      </template>
      <template v-slot:loading>
        <q-spinner :color="loadingColor" :thickness="3" />
      </template>
      <slot></slot>
    </q-input>
  </div>
</template>

<script lang="ts" setup>
import { QInput, QInputProps, ValidationRule } from 'quasar'
import { computed, onMounted, ref, watchEffect } from 'vue'
import {
  CurrencyDisplay,
  CurrencyInputOptions,
  useCurrencyInput,
} from 'vue-currency-input'

const emit = defineEmits([
  'update:modelValue',
  'enter',
  'iconClick',
  'focus',
  'blur',
  'right',
  'left',
  'up',
  'down',
])

const props = defineProps<{
  modelValue: string | number | null | undefined
  customFormattedValue?: string | number
  icon?: string
  leftIcon?: string
  label?: string
  disabled?: boolean
  disable?: boolean
  borderless?: boolean
  filled?: boolean
  outlined?: boolean
  labelColor?: string
  height?: string
  width?: string
  dense?: boolean
  clearable?: boolean
  standout?: string | boolean
  color?: string
  iconSize?: string
  type?: QInputProps['type']
  inputStyle?: object | [] | string
  iconColor?: string
  bgColor?: string
  inputClass?: string
  iconOpacity?: string
  labelTop?: boolean
  noIcon?: boolean
  placeholder?: string
  default?: boolean
  textArea?: boolean
  hint?: string
  readonly?: boolean
  mask?: string
  fillMask?: boolean
  loading?: boolean
  loadingColor?: string
  rules?: ValidationRule[]
  unmaskedValue?: boolean
  currency?: boolean
  currencyOptions?: CurrencyInputOptions
  precision?: number
  preventEmitDirection?: boolean
  square?: boolean
  externalLabel?: string
  externalLabelClass?: string
  changeAmount?: boolean
  autoGrow?: boolean
  autocomplete?: string
  rounded?: boolean
  menuMode?: boolean
}>()

const emitDirectionKeys = (
  direction: 'up' | 'down' | 'left' | 'right',
  event: KeyboardEvent
) => {
  if (props.preventEmitDirection) event.preventDefault()
  emit(direction)
}

const focused = ref(false)
const mounted = ref(false)
const _focusInput = () => {
  focused.value = true
  emit('focus')
}

const _blurInput = () => {
  focused.value = false
  emit('blur')
}

// const _outlined = computed(() => {
//   if (!props.outlined && (props.textArea || props.default)) {
//     return true;
//   }
//   return props.outlined;
// });

const _color = computed(() => {
  if (props.color) return props.color
  else return 'primary'
})

const _rounded = computed(() => {
  if (props.default && !props.textArea) {
    return true
  }
  return props.rounded
})

const _standout = computed(() => {
  return props.standout || true
})

const _bgColor = computed(() => {
  return props.bgColor ? props.bgColor : 'input-color'

  // if (!props.bgColor && (props.default || props.textArea)) {
  //   return 'secondary2';
  // } else if (!props.bgColor && !props.default) {
  //   return 'white';
  // }
  // return props.bgColor;
})

const _noIcon = computed(() => {
  if (!props.noIcon && props.textArea) {
    return true
  }
  return props.noIcon
})

const _labelTop = computed(() => {
  if (!props.labelTop && props.textArea) {
    return true
  }
  return props.labelTop
})

const _height = computed(() => {
  if (!props.height && props.textArea) {
    return 'unset'
  } else if (!props.height && !props.textArea) {
    return '40px'
  }
  return props.height
})

const _type = computed(() => {
  if (props.textArea) {
    return 'textarea'
  }
  return props.type
})

const _disabled = computed(() => props.disabled || props.disable)

const currencyOptions = computed(
  () =>
    props.currencyOptions || {
      currency: 'USD',
      currencyDisplay: CurrencyDisplay.hidden,
      precision: props.precision
        ? {
            min: 0,
            max: props.precision,
          }
        : undefined,
    }
)

let { formattedValue, inputRef, setValue } = props.currency
  ? useCurrencyInput(currencyOptions.value)
  : {
      setValue: undefined,
      formattedValue: computed(() => props.modelValue),
      inputRef: ref<QInput>(),
    }

const updateModelValue = (value: string | number | null) => {
  if (!props.currency) emit('update:modelValue', value)
}

onMounted(() => {
  mounted.value = true
})

watchEffect(() => {
  if (setValue && typeof props.modelValue == 'number')
    setValue(props.modelValue)
})
</script>

<style lang="scss">
// .readonly-label {
//   opacity: 0.5;
// }

body.screen--sm {
  .q-field {
    max-width: unset !important;
  }

  .q-field {
    textarea::placeholder {
      font-size: 14px !important;
    }
  }
}

body.screen--xs {
  .q-field {
    textarea::placeholder {
      font-size: 14px !important;
    }
  }
}

.q-input:not(.q-file).q-field--float .q-field__label {
  transform: translate(0, -50%) scale(0.85) !important;
  top: 0px !important;
  padding: 0 5px;
  z-index: 1;
  transition: all 0.3s;
  width: fit-content;
}

.q-input:not(.q-file).q-field--float.label-top .q-field__label {
  margin: 0 5px;
}

.q-field__label {
  transition: all 0.3s;
  top: 50%;
  display: flex;
  transform: translate(0, -50%);
}

textarea + .q-field__label {
  top: 15px;
  left: 7px;
}

.q-input:not(.q-file) .label-top .q-field__label {
  top: 10%;
  padding-left: 8px;
}

.q-input .q-field__bottom {
  padding: 4px 12px !important;
  font-size: 14px;
}

.q-input:not(.q-file).q-field--with-bottom {
  padding-bottom: 0px !important;
}

.q-input:not(.q-file).q-field__bottom.q-field__bottom--animated {
  margin: 4px;
}

.no-icon .q-field__append .q-icon.text-negative.material-icons {
  display: none;
}

.circlized .q-field__control {
  border-radius: var(--border-radius2) !important;
}

.default-input ::placeholder {
  font: var(--header3);
}

.q-field--outlined .bg-black2.q-field__control:before {
  border: 1px solid $black2 !important;
}

.q-textarea .q-field__control {
  min-height: unset !important;
}

.q-textarea .q-field__native {
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}

// .q-input :deep(.q-field__native .q-placeholder) {
//   padding-top: 10px !important;
// }

.q-field__native .q-placeholder {
  padding: 10px;
}

.q-input .q-field__label {
  color: var(--on-input-color) !important;
}

// .default-input .q-field__control {
//   padding: 0 5px 0 10px;
// }

.rounded-text-area .q-field__control {
  border-radius: 15px !important;
}

.q-field--filled .q-field__control:after {
  display: none;
}

.q-field--filled .q-field__control:before {
  display: none;
}

body.safari {
  .q-field--outlined .q-field__control:after {
    height: var(--input-height) !important;
  }
}
</style>

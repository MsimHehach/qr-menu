<template>
  <div
    class="row items-center no-wrap border-radius2"
    :class="[
      { 'full-width justify-between': fullWidth },
      backgroundClass ||
        (outlined ? 'outlined-element' : 'bg-secondary-button-color  px-1'),
    ]"
    :style="`height: ${_height}`"
  >
    <CIconButton
      icon="fal fa-minus"
      icon-color="on-secondary-button-color"
      :color="buttonsColor || (outlined ? '' : 'secondary-button-color')"
      :size="_height"
      :hover-icon-color="minValue >= modelValue ? 'secondary' : 'primary'"
      @click.capture.stop="minus"
      :disabled="disabled || noEdit"
      no-padding
    ></CIconButton>
    <div
      :style="widthInput"
      style="min-width: 20px"
      class="transition-1"
      :class="
        fullWidth
          ? ''
          : small
          ? 'mx-6'
          : extraSmall
          ? 'mx-3'
          : noPadding
          ? 'mx-6'
          : 'mx-6'
      "
    >
      <div ref="inputWrapper">
        <!-- <q-input
          :model-value="modelValue"
          @update:modelValue="setInputValue"
          @focus=";(inputValue = modelValue), (focused = true)"
          @blur="changeOnBlur"
          :height="inputHeight ? inputHeight : extraSmall ? 'unset' : '42px'"
        /> -->
        <CInput
          currency
          :filled="false"
          color="transparent"
          change-amount
          :key="inputKey"
          :prevent-emit-direction="inputPreventEmitDirection"
          :height="inputHeight ? inputHeight : extraSmall ? 'unset' : '42px'"
          :model-value="modelValue"
          :custom-formatted-value="customFormattedValue"
          @update:modelValue="setInputValue"
          :input-class="`text-${
            textColor || 'on-input-color'
          } subtitle-text bold text-center pt-3`"
          class="change-amount"
          :class="{ 'extra-small': extraSmall }"
          style="width: 100%"
          bg-color="transparent"
          @focus=";(inputValue = modelValue), (focused = true)"
          @blur="changeOnBlur"
          :readonly="noEdit"
          :disable="disabled"
          @right="$emit('right')"
          @left="$emit('left')"
          @up="$emit('up')"
          @down="$emit('down')"
          @enter="$emit('enter')"
        />
      </div>
    </div>
    <CIconButton
      icon="fal fa-plus"
      icon-color="on-secondary-button-color"
      :color="buttonsColor || (outlined ? '' : 'secondary-button-color')"
      :size="_height"
      :hover-icon-color="minValue >= modelValue ? 'secondary' : 'primary'"
      @click.capture.stop="plus"
      :disabled="disabled || disableAdding || noEdit"
      no-padding
    >
    </CIconButton>
    <q-tooltip
      v-if="tooltipText"
      anchor="top middle"
      self="bottom middle"
      :offset="[10, 10]"
    >
      {{ tooltipText }}
    </q-tooltip>
  </div>
</template>

<script setup lang="ts">
// import { ProductUnit } from 'src/models/productUnit/productUnit'
import { computed, ref, onBeforeUnmount, nextTick, onMounted } from 'vue'
import CIconButton from '../template/buttons/CIconButton.vue'
import CInput from '../template/inputs/CInput.vue'

const props = defineProps({
  fullWidth: Boolean,
  small: Boolean,
  extraSmall: Boolean,
  height: String,
  modelValue: {
    type: Number,
    default: 0,
  },
  minValue: {
    type: Number,
    default: 0,
  },
  maxValue: Number,
  selectedUnitQuantity: {
    type: Number,
  },
  inputHeight: String,
  disabled: Boolean,
  tooltipText: [String, Number],
  noPadding: Boolean,
  inputPreventEmitDirection: Boolean,
  noEdit: Boolean,
  textColor: String,
  denominator: String,
  disableAdding: Boolean,
  buttonsColor: String,
  backgroundClass: String,
  outlined: Boolean,
})

const inputValue = ref(0)
const focused = ref(false)
const inputWrapper = ref<HTMLDivElement>()
const inputRef = ref<HTMLInputElement>()
const inputKey = ref(1)

const emit = defineEmits([
  'update:modelValue',
  'left',
  'right',
  'up',
  'down',
  'enter',
])

const unitQuantity = computed(() => {
  if (typeof props.selectedUnitQuantity === 'number')
    return props.selectedUnitQuantity
  else return 1
})

const _height = computed(() => {
  return props.small ? '36px' : props.height || '40px'
})

const setInputRef = () => {
  const input = inputWrapper.value?.getElementsByTagName('input')
  if (input?.length) {
    inputRef.value = input[0]
  }
}

const customFormattedValue = computed(() =>
  !props.denominator
    ? props.modelValue
    : `${props.modelValue} / ${props.denominator}`
)

onMounted(() => {
  setInputRef()
})

const inputModelValue = computed(() => {
  if (props.denominator)
    return focused.value
      ? props.modelValue
      : `${props.modelValue}/${props.denominator}`
  else return props.modelValue
})

onBeforeUnmount(() => {
  if (focused.value) updateInput(inputValue.value)
})

const focusInput = () => {
  focused.value = true
  void nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus()
      inputRef.value.click()
    }
  })
}

const blurInput = () => {
  if (inputRef.value) {
    focused.value = false
    inputRef.value.blur()
  }
}

defineExpose({ inputRef, focused, focusInput, blurInput })

const changeOnBlur = () => {
  focused.value = false
  updateInput(inputValue.value)
}

const setInputValue = (val: string | number | null) => {
  if (!val) inputValue.value = 0
  else inputValue.value = typeof val === 'number' ? val : parseInt(val)
}

const updateInput = (val: number) => {
  if (val < props.minValue) val = props.minValue
  if (val == 0) {
    emit('update:modelValue', 0)
  } else if (val > 0 && val < unitQuantity.value) {
    emit('update:modelValue', unitQuantity.value)
    setInputValue(unitQuantity.value)
  } else {
    // if (props.availableUnits?.length) {
    //   const found = props.availableUnits.find((el) => val % el.quantity === 0)
    //   if (found) emit('update:modelValue', val)
    //   else {
    //     const remainder = Math.min(
    //       ...props.availableUnits.map((el) => val % el.quantity)
    //     )
    //     const unit = props.availableUnits.find(
    //       (el) => val % el.quantity === remainder
    //     )
    //     if (!unit) return
    //     emit('update:modelValue', val + (unit.quantity - (val % unit.quantity)))
    //     return
    //   }
    // }

    emit('update:modelValue', val)
  }
  inputKey.value += 1
  void nextTick(() => {
    setInputRef()
  })
}

const plus = () => {
  updateInput(props.modelValue + unitQuantity.value)
}
const minus = () => {
  let value = props.modelValue - unitQuantity.value
  if (props.modelValue - unitQuantity.value <= props.minValue)
    value = props.minValue
  updateInput(value)
}

const widthInput = computed(() => {
  const _value = customFormattedValue.value || inputModelValue.value
  return `width: ${String(_value).length * 10}px`
})
</script>

<style scoped lang="scss">
:deep(.change-amount) {
  // text-align: center;

  .q-field__control::before {
    // position: absolute;
    top: 0;
    right: 0;
    bottom: 8px;
    left: 0;
  }
  .q-field__control::after {
    top: 32px;
    right: 0;
    bottom: 0px;
    left: 0;
  }
}

:deep(.extra-small) {
  .q-field__control::after {
    top: 23px !important;
  }
}

.outlined-element {
  border: 1px var(--secondary) solid;
}
</style>

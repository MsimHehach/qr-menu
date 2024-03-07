<template>
  <div ref="block" class="row full-width justify-center no-wrap gap-10">
    <CInput
      :class="
        error
          ? $uiSettings.item?.inputType === 'filled'
            ? 'error-input-filled'
            : 'error-input-outlined'
          : ''
      "
      :height="$q.screen.lt.md ? '44px' : '50px'"
      :input-class="`${
        error ? 'text-danger' : 'text-on-input-color'
      } subtitle-text bold `"
      :model-value="props.code.first"
      :width="$q.screen.lt.md ? '44px' : '50px'"
      class="input firstInput"
      mask="#"
      outlined
      type="number"
      @keydown="kek($event, 1)"
      @paste="onPaste"
      @update:model-value="updateFirstDigit"
      autocomplete="one-time-code"
    />
    <CInput
      :class="
        error
          ? $uiSettings.item?.inputType === 'filled'
            ? 'error-input-filled'
            : 'error-input-outlined'
          : ''
      "
      :height="$q.screen.lt.md ? '44px' : '50px'"
      :input-class="`${
        error ? 'text-danger' : 'text-on-input-color'
      } subtitle-text bold`"
      :model-value="props.code.second"
      :width="$q.screen.lt.md ? '44px' : '50px'"
      class="input secondInput"
      mask="#"
      outlined
      type="number"
      @keydown="kek($event, 2)"
      @paste="onPaste"
      @update:model-value="updateSecondDigit"
      autocomplete="one-time-code"
    />
    <CInput
      :class="
        error
          ? $uiSettings.item?.inputType === 'filled'
            ? 'error-input-filled'
            : 'error-input-outlined'
          : ''
      "
      :height="$q.screen.lt.md ? '44px' : '50px'"
      :input-class="`${
        error ? 'text-danger' : 'text-on-input-color'
      } subtitle-text bold`"
      :model-value="props.code.third"
      :width="$q.screen.lt.md ? '44px' : '50px'"
      class="input thirdInput"
      mask="#"
      outlined
      type="number"
      @keydown="kek($event, 3)"
      @paste="onPaste"
      @update:model-value="updateThirdDigit"
      autocomplete="one-time-code"
    />
    <CInput
      :class="
        error
          ? $uiSettings.item?.inputType === 'filled'
            ? 'error-input-filled'
            : 'error-input-outlined'
          : ''
      "
      :height="$q.screen.lt.md ? '44px' : '50px'"
      :input-class="`${
        error ? 'text-danger' : 'text-on-input-color'
      } subtitle-text bold`"
      :model-value="props.code.fourth"
      :width="$q.screen.lt.md ? '44px' : '50px'"
      class="input fourthInput"
      mask="#"
      outlined
      type="number"
      @keydown="kek($event, 4)"
      @paste="onPaste"
      @update:model-value="updateFourthDigit"
      autocomplete="one-time-code"
    />
  </div>
</template>
<script lang="ts" setup>
import CInput from 'src/components/template/inputs/CInput.vue'
import { nextTick, onMounted, ref } from 'vue'

const props = defineProps<{
  code: {
    first: string | null
    second: string | null
    third: string | null
    fourth: string | null
  }
  error?: boolean
}>()

const emit = defineEmits<{
  (
    evt: 'update',
    val: {
      first: string | null
      second: string | null
      third: string | null
      fourth: string | null
    }
  ): void
  (evt: 'logIn', val: boolean): void
}>()

const block = ref<HTMLDivElement>()

const firstInputRef = ref<HTMLInputElement | null>(null)

const secondInputRef = ref<HTMLInputElement | null>(null)

const thirdInputRef = ref<HTMLInputElement | null>(null)

const fourthInputRef = ref<HTMLInputElement | null>(null)

const setInputRef = () => {
  const inputs = block.value?.getElementsByTagName('input')

  if (inputs?.length) {
    firstInputRef.value = inputs[0]
    secondInputRef.value = inputs[1]
    thirdInputRef.value = inputs[2]
    fourthInputRef.value = inputs[3]
  }
}

const onPaste = (e: ClipboardEvent) => {
  e.preventDefault()
  const value = e.clipboardData?.getData('text')
  if (!value) return
  const keysByIndex = {
    0: 'first',
    1: 'second',
    2: 'third',
    3: 'fourth',
  }
  for (const [i, v] of value.slice(0, 4).split('').entries()) {
    const index = i as keyof typeof keysByIndex
    Object.assign(props.code, { [keysByIndex[index]]: v })
  }
  let currentInput: HTMLInputElement | null = null
  if (!props.code.first) currentInput = firstInputRef.value
  else if (!props.code.second) currentInput = secondInputRef.value
  else if (!props.code.third) currentInput = thirdInputRef.value
  else currentInput = fourthInputRef.value
  if (props.code.fourth) emit('logIn', true)
  setTimeout(() => {
    currentInput?.focus()
    currentInput?.select()
  }, 0)
}

const kek = (v: KeyboardEvent, inputNumber: number) => {
  setTimeout(() => {
    if (v.key === 'Backspace' || v.key === 'ArrowLeft') {
      if (inputNumber === 4) {
        thirdInputRef.value?.focus()
        thirdInputRef.value?.select()
      } else if (inputNumber === 3) {
        secondInputRef.value?.focus()
        secondInputRef.value?.select()
      } else if (inputNumber === 2) {
        firstInputRef.value?.focus()
        firstInputRef.value?.select()
      }
    } else if (v.key === 'ArrowRight') {
      void nextTick(() => {
        inputNumber === 1
          ? (secondInputRef.value?.focus(), secondInputRef.value?.select())
          : inputNumber === 2
          ? (thirdInputRef.value?.focus(), thirdInputRef.value?.select())
          : inputNumber === 3
          ? (fourthInputRef.value?.focus(), fourthInputRef.value?.select())
          : void 0
      })
    }
  }, 0)
}

const updateFirstDigit = (v: string | null) => {
  emit('update', { ...props.code, first: v })
  if (v) {
    void nextTick(() => {
      secondInputRef.value?.focus()
      secondInputRef.value?.select()
    })
  }
}

const updateSecondDigit = (v: string | null) => {
  emit('update', { ...props.code, second: v })
  if (v) {
    void nextTick(() => {
      thirdInputRef.value?.focus()
      thirdInputRef.value?.select()
    })
  }
}

const updateThirdDigit = (v: string | null) => {
  emit('update', { ...props.code, third: v })
  if (v) {
    void nextTick(() => {
      fourthInputRef.value?.focus()
      fourthInputRef.value?.select()
    })
  }
}

const updateFourthDigit = (v: string | null) => {
  emit('update', { ...props.code, fourth: v })
  setTimeout(() => {
    if (Object.values(props.code).every((v) => !!v?.length)) {
      emit('logIn', true)
    }
  }, 200)
}

onMounted(() => {
  setInputRef()
  firstInputRef.value?.focus()
})
</script>

<style lang="scss" scoped>
.input :deep(.q-field__native) {
  text-align: center;
}

.error-input-outlined :deep(.q-field--outlined .q-field__control:before) {
  border: 2px $danger solid !important;
}

.error-input-filled :deep(.q-field__control) {
  outline: 2px $danger solid !important;
}

.input :deep(input::-webkit-outer-spin-button),
.input :deep(input::-webkit-inner-spin-button),
.input :deep(input[type='number']) {
  -moz-appearance: textfield;
  -webkit-appearance: none;
  margin: 0;
}
</style>

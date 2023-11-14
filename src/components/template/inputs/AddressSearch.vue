<template>
  <CInput
    :disabled="disabled"
    class="col-grow body"
    :external-label="label"
    :input-class="inputClass"
    :loading="loading"
    v-model="currentAddress"
    :loading-color="loadingColor"
    :icon="inputIcon"
    height="42px"
    :icon-color="iconColor"
    :icon-class="iconClass"
    @icon-click="$emit('iconClick')"
    @update:modelValue="$emit('update:modelValue', $event), (updated = true)"
    :rules="[() => validateAddress(currentFullAddress)]"
  >
    <q-menu
      v-model="menu"
      no-parent-event
      :offset="[0, -10]"
      style="box-shadow: 4px 4px 6px rgba(0, 0, 0, 0.04) !important"
      fit
      no-focus
    >
      <div class="col px-5 py-3">
        <CButton
          v-for="(el, index) in foundAddresses"
          :key="index"
          class="mb-4"
          text-button
          text-color="on-background-color"
          hover-text-color="primary"
          @click="selectAddress(el)"
        >
          {{ el.address }}
        </CButton>
      </div>
    </q-menu>
    <template></template>
  </CInput>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { Address } from 'src/models/types'
import CInput from './CInput.vue'
import CButton from '../buttons/CButton.vue'
import { utilsRepo } from 'src/models/utils/utilsRepo'

const props = withDefaults(
  defineProps<{
    label: string
    address: string
    inputColor?: string
    inputClass?: string
    disabled?: boolean
    type?: 'delivery' | 'pickup'
    inputIcon?: string
    iconClass?: string
    iconColor?: string
    loadingColor?: string
  }>(),
  { inputColor: 'secondary2', type: 'delivery' }
)

const currentAddress = ref('')
const updated = ref(false)
const currentFullAddress = ref<Address | null>(null)

onMounted(() => {
  currentAddress.value = props.address
  // if (props.address.length) {
  // void loadAddresses(props.address)
  // }
})

const propsAddress = computed(() => props.address)

const emit = defineEmits(['update:modelValue', 'update', 'iconClick'])

const loading = ref(false)
const menu = ref(false)
const foundAddresses = ref<Address[]>([])
let timeout: NodeJS.Timeout | null = null

const loadAddresses = async (address: string) => {
  if (address) {
    foundAddresses.value = await utilsRepo.suggestAddresses(address)
    if (foundAddresses.value.length) menu.value = true
  }
  loading.value = false
}

const selectAddress = (val: Address) => {
  currentFullAddress.value = val
  emit('update', val)
  menu.value = false
}

watch(currentAddress, (val) => {
  if (timeout) clearTimeout(timeout)
  if (!val || currentAddress.value == propsAddress.value) {
    return
  }
  loading.value = true
  timeout = setTimeout(() => {
    void loadAddresses(val)
  }, 500)
})

watch(propsAddress, (val) => {
  currentAddress.value = val
})

const validateAddress = (val: Address | null) => {
  if (!val && props.address && !updated.value) return true
  if (val && val.address) {
    if (val.street) {
      if (val.house) {
        return true
      } else return 'Укажите дом'
    } else return 'Укажите улицу'
  } else return 'Укажите адрес'
}
</script>

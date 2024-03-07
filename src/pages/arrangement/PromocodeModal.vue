<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="433px"
    class="text-on-background-color"
    :position="$q.screen.lt.md ? 'bottom' : undefined"
  >
    <!-- <template v-slot:header> Промокод </template> -->
    <div class="header3 bold mb-8">Промокод</div>

    <template v-if="$cart.item">
      <CInput
        height="48px"
        placeholder="Введите промокод"
        v-model="$cart.item.promoCode"
        @update:model-value="$cart.promocodeError = false"
        :rules="[
          () =>
            $cart.promocodeError
              ? 'Промокод не действителен. Попробуйте другой'
              : true,
        ]"
      />
      <CButton
        @click="apply()"
        label="Применить"
        height="48px"
        width="100%"
        :loading="$cart.loading"
        class="mt-14 subtitle-text"
        :class="$cart.promocodeError ? 'mt-20' : 'mt-14'"
      />
    </template>
  </CDialog>
</template>
<script lang="ts" setup>
import CButton from 'src/components/template/buttons/CButton.vue'
import CDialog from 'src/components/template/dialogs/CDialog.vue'
import CInput from 'src/components/template/inputs/CInput.vue'
import { cartRepo } from 'src/models/carts/cartRepo'
import { watch } from 'vue'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
}>()

watch(
  () => cartRepo.loading,
  (v) => {
    if (!v && !cartRepo.promocodeError) {
      emit('update:modelValue', false)
    }
  }
)

const apply = async () => {
  if (!cartRepo.item) return
  try {
    cartRepo.loading = true
    await cartRepo.setParams({
      promo_code: cartRepo.item.promoCode || undefined,
    })
  } catch {}
}
</script>

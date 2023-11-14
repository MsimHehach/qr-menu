<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="320px"
    height="359px"
  >
    <!-- <CButton label="выйти" @click="authentication.logout()" /> -->
    <div class="column text-on-background-color">
      <!-- <div class="row justify-end" :class="{ 'mb-12': currentStep === 1 }">
        <CIcon
          @click="$emit('update:modelValue', false)"
          name="fa-light fa-xmark"
          color="black"
          class="cursor-pointer"
          hover-color="primary"
          size="23px"
        />
      </div> -->
      <CIconButton
        v-if="currentStep === 2"
        @click="currentStep = 1"
        icon="fa-light fa-angle-left"
        color="white-opacity"
        icon-class="box-shadow"
        icon-color="on-secondary-button-color"
        hover-icon-color="primary"
        size="30px"
      />

      <div
        :class="{ 'mt-15': currentStep === 1 }"
        class="header3 row full-width justify-center mb-10"
      >
        {{ currentStep === 1 ? 'Войти в приложение' : 'Введите код из смс' }}
      </div>
      <div
        v-if="currentStep === 2"
        class="row full-width justify-center body mb-10"
      >
        <div class="col-9" style="text-align: center">
          Смс отправлено на номер <br />
          {{ `+7${data.phone}` }}
        </div>
      </div>
      <CInput
        v-if="currentStep === 1"
        input-class="header3 text-on-input-color input"
        height="50px"
        class="pb-11 px-5"
        outlined
        mask="+7 (###) ###-##-##"
        unmasked-value
        v-model="data.phone"
      />
      <div v-else class="row full-width justify-center">
        <CInput
          v-model="data.sms"
          input-class="header3 input text-on-input-color"
          height="50px"
          width="200px"
          style="overflow-x: hidden"
          :class="data.sms.length ? 'center-content' : ''"
          class="pb-11 px-10 sms-field"
          standout
          mask="####"
        />
      </div>
      <div
        v-if="currentStep === 2"
        @click="delay ? void 0 : sendSms()"
        class="row justify-center"
        style="text-decoration: underline"
        :class="{ 'cursor-pointer': !delay }"
      >
        {{ !!delay ? `Отправить еще раз (${delay} сек)` : 'Отправить еще раз' }}
      </div>
      <div v-if="currentStep === 1" class="row no-wrap items-center">
        <q-checkbox v-model="data.agreement" color="primary"> </q-checkbox>
        <div
          @click="data.agreement = !data.agreement"
          class="secondary-text cursor-pointer"
        >
          {{ 'Я согласен на обработку моих '
          }}<span
            @click.capture.stop="openPolicy()"
            style="text-decoration: underline"
            >персональных данных</span
          >
        </div>
      </div>
      <CButton
        @click="nextStepHandler()"
        height="50px"
        :disabled="!data.agreement || !data.phone || data.phone.length < 10"
        :label="currentStep === 1 ? 'Далее' : 'Войти'"
        class="body mt-10"
        color="primary"
        text-color="on-primary"
      />
    </div>
  </CDialog>
</template>
<script lang="ts" setup>
import { Notify } from 'quasar'
import CButton from 'src/components/template/buttons/CButton.vue'
import CIconButton from 'src/components/template/buttons/CIconButton.vue'
import CDialog from 'src/components/template/dialogs/CDialog.vue'
import CInput from 'src/components/template/inputs/CInput.vue'
import { authentication } from 'src/models/authentication/authentication'
import { cartRepo } from 'src/models/carts/cartRepo'

import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const delay = ref(30)
let interval: NodeJS.Timeout | null = null

const route = useRoute()

const data = ref({
  phone: '7',
  sms: '',
  agreement: false,
})

const currentStep = ref(1)

defineProps<{
  modelValue: boolean
}>()

const openPolicy = () => {
  window.open(
    `https://loyalhub.ru/${String(route.params.companyGroup)}/policy`,
    '_blank'
  )
}

const emit = defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
}>()

// watch(
//   () => props.modelValue,
//   (v) => {
//     if (v) {
//       data.value = {
//         phone: '',
//         sms: '',
//         agreement: false,
//       }
//     }
//   }
// )

watch(
  () => currentStep.value,
  (v) => {
    if (v === 1 && interval) {
      clearInterval(interval)
    }
  }
)

const nextStepHandler = async () => {
  if (currentStep.value === 1) {
    const res = await sendSms()
    if (res) {
      currentStep.value = 2
    }
  } else {
    await auth()
    await cartRepo.current()
  }
}

const auth = async () => {
  try {
    await authentication.login({
      phone: `7${data.value.phone}`,
      code: data.value.sms,
    })

    Notify.create({
      message: 'Вы успешно авторизованы',
    })
    currentStep.value = 1

    emit('update:modelValue', false)
  } catch (e) {
    Notify.create({
      message: 'Ошибка при авторизации',
      color: 'danger',
    })
  }
}

const sendSms = async () => {
  const res = await authentication.sendSms({
    phone: `7${data.value.phone}`,
  })
  if (res) {
    Notify.create({
      message: 'Сообщение с кодом успешно отправлено',
    })
    delay.value = 30
    interval = setInterval(() => {
      if (!delay.value) return
      delay.value--
    }, 1000)
  } else {
    Notify.create({
      message: 'Ошибка при отправке sms',
      color: 'danger',
    })
  }
  return res
}
</script>

<style lang="scss" scoped>
.input :deep(.q-field--standout.q-field-highlighted .q-field__control) {
  box-shadow: unset !important;
}

.sms-field :deep(.q-field__native) {
  letter-spacing: 20px;
  text-align: center;
}

.center-content :deep(.q-field__native) {
  padding-left: 15px;
}
</style>

<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="466px"
    :position="$q.screen.lt.md ? 'bottom' : undefined"
    :maximize="$q.screen.lt.md"
    :no-close="$q.screen.lt.md"
  >
    <div class="text-on-background-color">
      <div
        :style="$q.screen.lt.md ? 'text-align: center' : ''"
        class="header3 bold"
      >
        Вход на сайт
      </div>

      <div v-if="currentStep === 1" class="column mt-4">
        <div class="column full-width">
          <div
            :style="$q.screen.lt.md ? 'text-align: center' : ''"
            class="body"
          >
            Введите номер телефона, чтобы войти на сайт
          </div>
        </div>
        <div class="mt-md-10 mt-xs-8">
          <CInput
            input-class="subtitle-text text-on-input-color input "
            :height="$q.screen.lt.md ? '44px' : '50px'"
            outlined
            mask="+7 (###) ###-##-##"
            unmasked-value
            v-model="data.phone"
          />
          <div class="row no-wrap items-center mt-10 gap-6">
            <CCheckBox v-model="data.agreement" color="primary" size="48px" />
            <div
              @click="data.agreement = !data.agreement"
              class="secondary-text cursor-pointer"
              style="opacity: 0.7"
            >
              Продолжая, вы соглашаетесь c
              <span
                @click.capture.stop="openTermsOfService()"
                style="text-decoration: underline"
                >пользовательским соглашением</span
              >,
              <span
                @click.capture.stop="openPolicy()"
                style="text-decoration: underline"
                >политикой конфиденциальности</span
              >
            </div>
          </div>
        </div>
      </div>
      <div v-else class="mt-4">
        <div class="column body gap-1 full-width">
          <div
            :style="$q.screen.lt.md ? 'text-align: center' : ''"
            style="opacity: 0.7"
            class="body"
          >
            Код отправлен сообщением на
          </div>
          <div :class="{ 'justify-center': $q.screen.lt.md }" class="row gap-4">
            <div>+7{{ data.phone }}</div>
            <CButton
              @click="currentStep = 1"
              text-button
              label="Изменить"
              text-color="primary"
              class="body"
            />
          </div>
        </div>
        <div class="row full-width justify-center mt-12">
          <CodeComponent
            :code="data.sms"
            @update=";(data.sms = $event), (codeError = false)"
            @log-in="auth()"
            :error="codeError"
          />
          <div v-if="codeError" class="text-danger body mt-2">Неверный код</div>
        </div>
        <div
          @click="delay ? void 0 : sendSms()"
          class="row justify-center mt-md-4 mt-xs-30 body"
          style="text-decoration: underline"
          :class="{ 'cursor-pointer': !delay }"
        >
          {{
            !!delay ? `Отправить еще раз (${delay} сек)` : 'Отправить еще раз'
          }}
        </div>
      </div>

      <CButton
        @click="nextStepHandler()"
        height="50px"
        width="100%"
        :disabled="!data.agreement || !data.phone || data.phone.length < 10"
        :label="currentStep === 1 ? 'Выслать код' : 'Войти'"
        class="subtitle-text"
        :class="
          $q.screen.lt.md ? (currentStep === 2 ? 'mt-6' : 'mt-36') : 'mt-15'
        "
        color="primary"
        text-color="on-primary"
        :loading="loading"
      />
    </div>
  </CDialog>
</template>
<script lang="ts" setup>
import { Notify } from 'quasar'
import CCheckBox from 'src/components/helpers/CCheckBox.vue'
import CButton from 'src/components/template/buttons/CButton.vue'
import CDialog from 'src/components/template/dialogs/CDialog.vue'
import CInput from 'src/components/template/inputs/CInput.vue'
import { authentication } from 'src/models/authentication/authentication'
import { cartRepo } from 'src/models/carts/cartRepo'
import { ref, watch } from 'vue'
import CodeComponent from './CodeComponent.vue'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { store } from 'src/models/store'

const props = defineProps<{
  modelValue: boolean
}>()

const delay = ref(30)
let interval: NodeJS.Timeout | null = null

const codeError = ref(false)

const loading = ref(false)

const data = ref<{
  phone: string
  sms: {
    first: string | null
    second: string | null
    third: string | null
    fourth: string | null
  }
  agreement: boolean
}>({
  phone: '7',
  sms: {
    first: null,
    second: null,
    third: null,
    fourth: null,
  },
  agreement: false,
})

const currentStep = ref(1)

const openPolicy = () => {
  window.open(
    `https://loyalhub.ru/${String(companyGroupRepo.item?.externalId)}/policy`,
    '_blank'
  )
}

const openTermsOfService = () => {
  window.open(
    `https://loyalhub.ru/${String(
      companyGroupRepo.item?.externalId
    )}/terms_of_service`,
    '_blank'
  )
}

const emit = defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
}>()

watch(
  () => currentStep.value,
  (v) => {
    if (v === 1 && interval) {
      clearInterval(interval)
    }
  }
)

watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      data.value.sms = {
        first: null,
        fourth: null,
        second: null,
        third: null,
      }
      codeError.value = false
    }
  }
)

const nextStepHandler = async () => {
  loading.value = true
  if (currentStep.value === 1) {
    const res = await sendSms()
    if (res) {
      currentStep.value = 2
    }
    loading.value = false
  } else {
    await auth()
    if (authentication.user) void cartRepo.current()

    loading.value = false
  }
}

const auth = async () => {
  try {
    loading.value = true
    await authentication.login({
      phone: `7${data.value.phone}`,
      code: `${data.value.sms.first}${data.value.sms.second}${data.value.sms.third}${data.value.sms.fourth}`,
    })
    await authentication.me()
    if (authentication.user) void cartRepo.current()

    currentStep.value = 1
    emit('update:modelValue', false)
    if (authentication.user?.registeredAt === null) {
      store.registrationModal = true
    }
  } catch {
    codeError.value = true
  } finally {
    loading.value = false
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
    if (interval) {
      clearInterval(interval)
    }
    interval = setInterval(() => {
      if (!delay.value) return
      delay.value--
    }, 1000)
    if (currentStep.value === 2) {
      codeError.value = false
      data.value.sms = {
        first: null,
        fourth: null,
        second: null,
        third: null,
      }
    }
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

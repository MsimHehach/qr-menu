<template>
  <div
    v-if="ready"
    style="height: 100vh"
    class="column full-width items-center justify-center bg-background-color text-on-background-color"
  >
    <PrepareUiSettings />

    <div
      v-if="!deleted"
      style="max-width: 400px; width: 100%"
      class="column justify-center"
    >
      <q-img
        class="mb-12"
        :src="$uiSettings.item?.logo?.thumbnail"
        height="50px"
        fit="contain"
      />
      <div class="row mb-12 gap-5 items-center full-width justify-center">
        <div class="header3">Удаление аккаунта</div>
        <CIcon size="20px" name="fa-light fa-info-circle">
          <q-tooltip>
            <div>
              Введите Ваш номер телефона и подтвердите код из СМС для удаления
              аккаунта
            </div>
          </q-tooltip>
        </CIcon>
      </div>
      <div class="row full-width justify-center">
        <CInput
          v-if="step === 1"
          mask="+7 (###) ###-##-##"
          v-model="data.phone"
          external-label="Телефон"
          width="220px"
          class="mb-12"
          input-class="header3 text-on-input-color"
          height="46px"
          unmasked-value
          outlined
          color="primary"
        />
        <CInput
          v-else
          v-model="data.code"
          input-class="header3 input text-on-input-color"
          height="46px"
          external-label="Код из СМС"
          width="220px"
          style="overflow-x: hidden"
          :class="data.code?.length ? 'center-content' : ''"
          class="pb-12 px-10 sms-field"
          color="primary"
          standout
          mask="####"
          outlined
        />
      </div>
      <div style="text-align: center" class="subtitle-text-light mb-12">
        Ваши персональные данные будут удалены, история заказов и система
        лояльности будут анонимизированы
      </div>
      <div class="row full-width justify-center">
        <CButton
          :loading="loading"
          @click="nextStepHandler()"
          height="46px"
          width="220px"
          >Далее</CButton
        >
      </div>

      <!-- <img
        v-if="$uiSettings.item?.logo?.thumbnail"
        height="42"
        style="object-fit: contain"
        :src="$uiSettings.item?.logo?.thumbnail"
      /> -->
    </div>
    <div v-else class="header">Ваш аккаунт был успешно удален</div>
  </div>
  <div
    v-else
    style="height: 100vh"
    class="absolute-full flex items-center justify-center"
  >
    <q-spinner-puff color="primary" size="13%" />
  </div>
</template>
<script lang="ts" setup>
import { Notify } from 'quasar'
import PrepareUiSettings from 'src/components/template/PrepareUiSettings.vue'
import CButton from 'src/components/template/buttons/CButton.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import CInput from 'src/components/template/inputs/CInput.vue'
import { authentication } from 'src/models/authentication/authentication'
import { store } from 'src/models/store'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { customerRepo } from 'src/models/customer/customerRepo'

const route = useRoute()

const ready = ref(false)

const step = ref(1)

const deleted = ref(false)

const loading = ref(false)

const data = ref<{
  phone: string | null
  code: string | null
}>({
  code: null,
  phone: null,
})

const nextStepHandler = async () => {
  if (step.value === 1) {
    const res = await sendSms()
    if (res) step.value = 2
  } else {
    try {
      await auth()
      await customerRepo.deleteCustomer()
      deleted.value = true
      Notify.create({
        message: 'Аккаунт успешно удален',
      })
    } catch {
      Notify.create({
        message: 'Ошибка при удалении аккаунта',
        color: 'danger',
      })
    }
  }
}

const auth = async () => {
  try {
    loading.value = true
    await authentication.login({
      phone: `7${data.value.phone}`,
      code: data.value.code,
    })
  } catch (e) {
    Notify.create({
      message: 'Ошибка',
      color: 'danger',
    })
  } finally {
    loading.value = false
  }
}

const sendSms = async () => {
  try {
    loading.value = true
    const res = await authentication.sendSms({
      phone: `7${data.value.phone}`,
    })
    if (res) {
      Notify.create({
        message: 'Сообщение с кодом успешно отправлено',
      })
    } else {
      Notify.create({
        message: 'Ошибка при отправке sms',
        color: 'danger',
      })
    }
    return res
  } catch {
    Notify.create({
      message: 'Ошибка при отправке SMS',
      color: 'danger',
    })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  store.getCompanyGroup(String(route.params.companyGroup))
  await uiSettingsRepo.fetchSettings()
  ready.value = true
})
</script>

<style lang="scss" scoped>
.input :deep(.q-field--standout.q-field-highlighted .q-field__control) {
  box-shadow: unset !important;
}

.sms-field :deep(.q-field__native) {
  letter-spacing: 20px;
  text-align: center;
}
</style>

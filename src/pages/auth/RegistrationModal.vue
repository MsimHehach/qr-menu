<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="466px"
    persistent
    class="text-on-background-color"
    no-close
    :position="$q.screen.lt.md ? 'bottom' : undefined"
    :maximize="$q.screen.lt.md"
  >
    <div class="huge3 bold">Регистрация</div>
    <div
      class="column text-on-background-color bg-background-color full-width gap-10"
    >
      <div class="mt-4 body">Пожалуйста заполните следующие поля</div>

      <CInput
        v-if="!$companyGroup.requiredFields?.first_name.hidden"
        external-label="Ваше имя"
        height="48px"
        v-model="data.firstName"
      />
      <CInput
        v-if="!$companyGroup.requiredFields?.last_name.hidden"
        external-label="Ваша фамилия"
        input-class="body"
        height="48px"
        v-model="data.lastName"
      />
      <!-- <CInput
        external-label="Ваш телефон"
        input-class="body"
        height="48px"
        mask="+7 (###) ###-##-##"
        :rules="[(v: string | null) => getPhone(v) && getPhone(v)!.length < 11 ? 'Введите корректный телефон' : true]"
        v-model="data.phone"
      /> -->
      <CInput
        v-if="!$companyGroup.requiredFields?.email.hidden"
        external-label="Ваш email"
        height="48px"
        :rules="[rules.email]"
        v-model="data.email"
      />
      <div
        v-if="
          !$companyGroup.requiredFields?.sex.hidden ||
          !$companyGroup.requiredFields?.birthday.hidden
        "
        class="row no-wrap full-width gap-6"
      >
        <TabPicker
          v-if="!$companyGroup.requiredFields?.sex.hidden"
          @update-tab="data.sex = $event"
          :model-value="data.sex"
          class="col-5"
          height="48px"
          :tabs="sexTabs"
          external-label="Пол"
        />
        <CInput
          v-if="!$companyGroup.requiredFields?.birthday.hidden"
          external-label="Дата рождения"
          height="48px"
          class="col"
          :model-value="data.birthday"
        >
          <q-menu
            ><q-date
              v-model="data.birthday"
              :options="getDateOptions"
              mask="DD.MM.YYYY"
          /></q-menu>
        </CInput>
      </div>
    </div>
    <CButton
      @click="register()"
      width="100%"
      :disabled="!isSendingAvailable"
      height="48px"
      label="Зарегистрироваться"
      :loading="loading"
      class="body mt-20"
    />
  </CDialog>
</template>
<script lang="ts" setup>
import { Notify } from 'quasar'
import CButton from 'src/components/template/buttons/CButton.vue'
import TabPicker from 'src/components/template/buttons/TabPicker.vue'
import CDialog from 'src/components/template/dialogs/CDialog.vue'
import CInput from 'src/components/template/inputs/CInput.vue'
import rules from 'src/corexModels/rules'
import { ref, computed } from 'vue'
import { authRepo } from 'src/models/authentication/authRepo'
import { SexType } from 'src/models/customer/customer'
import moment from 'moment'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { authentication } from 'src/models/authentication/authentication'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
}>()

const loading = ref(false)

const data = ref<{
  firstName: string | null
  lastName: string | null
  email: string | null
  sex: string
  birthday: string | null
}>({
  firstName: null,
  lastName: null,
  email: null,
  sex: 'М',
  birthday: null,
})

const sexTabs = ['М', 'Ж']

const isSendingAvailable = computed(() => {
  return (
    (companyGroupRepo.requiredFields?.first_name.required
      ? !!data.value.firstName?.length
      : true) &&
    (companyGroupRepo.requiredFields?.last_name.required
      ? !!data.value.lastName?.length
      : true) &&
    (companyGroupRepo.requiredFields?.email.required
      ? !!data.value.email?.length &&
        typeof rules.email(data.value.email) !== 'string'
      : !!data.value.email?.length
      ? typeof rules.email(data.value.email) !== 'string'
      : true) &&
    (companyGroupRepo.requiredFields?.birthday.required
      ? !!data.value.birthday
      : true)
  )
})

const getDateOptions = (date: string) => {
  return date < moment().format('YYYY/MM/DD')
}

// const getPhone = (v: string | null) => {
//   if (!v) return
//   const data = []
//   for (const el of v) {
//     if (!Number.isNaN(Number(el)) && el !== ' ') data.push(el)
//   }
//   return data.join('')
// }

const register = async () => {
  try {
    loading.value = true
    const user = await authRepo.register({
      birthday: data.value.birthday
        ? moment(data.value.birthday, 'DD.MM.YYYY').format('YYYY-MM-DD')
        : undefined,
      email: data.value.email || undefined,
      first_name: data.value.firstName || undefined,
      last_name: data.value.lastName || undefined,
      sex: data.value.sex === 'Ж' ? SexType.FEMALE : SexType.MALE,
      company_group: companyGroupRepo.item?.id || undefined,
    })
    authentication.user = user
    Notify.create({
      message: 'Вы успешно авторизировались',
    })
    emit('update:modelValue', false)
  } catch {
    Notify.create({
      message: 'Ошибка',
      color: 'danger',
    })
  } finally {
    loading.value = false
  }
}
</script>

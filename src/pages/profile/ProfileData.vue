<template>
  <div
    :style="`max-width: ${$q.screen.lt.lg ? '' : '520px'}; width: 100%`"
    class="text-on-background-color column mb-xs-40 mb-lg-0"
  >
    <div
      v-if="$q.screen.lt.lg"
      class="row full-width items-center justify-between mb-md-15 mb-xs-8"
    >
      <div class="huge3 bold">Мои данные</div>
      <CButton
        @click="acceptModal = true"
        icon-right="fa-regular fa-arrow-right-from-bracket"
        text-button
        text-color="primary"
        ><div class="body bold">Выйти</div></CButton
      >
    </div>
    <ProfileUserCard @edit-profile="editProfileModal = true" />
    <div class="row full-width gap-md-10 gap-xs-6 mt-md-12 mt-xs-10">
      <div
        style="max-width: 50%"
        class="border-radius pa-10 col column gap-6 bordered-element"
      >
        <div class="body">Всего заказов</div>
        <div class="subtitle-text bold">{{ $order.pagination.total }}</div>
      </div>
      <div
        v-if="authentication.user?.wallets.length"
        class="border-radius pa-10 col column gap-6 bordered-element"
      >
        <div class="body">Бонусы</div>
        <div class="subtitle-text bold">
          {{ authentication.user?.wallets[0].balance }}
        </div>
      </div>
    </div>

    <CButton
      v-if="$q.screen.gt.md"
      style="width: 100%; max-width: 200px"
      @click="acceptModal = true"
      label="Выйти"
      height="48px"
      class="mt-20 body"
    />
    <!-- <div v-if="_item" class="column full-width gap-sm-12 gap-xs-10">
      <CInput v-model="_item.firstName" height="40px" external-label="Имя" />
      <CInput v-model="_item.lastName" height="40px" external-label="Фамилия" />
      <CInput
        :model-value="parsedPhone"
        height="40px"
        readonly
        mask="+7 (###) ###-##-##"
        external-label="Телефон"
      />
      <CInput
        v-model="_item.birthday"
        height="40px"
        readonly
        external-label="Дата рождения"
      />
      <TabPicker
        width="100%"
        small
        class="full-width"
        :model-value="sexNames[_item.sex]"
        @update-tab="updateSex($event)"
        :tabs="sexValues"
      />
      <CInput
        v-model="_item.email"
        :rules="[rules.email]"
        height="40px"
        external-label="Email"
      />
      <div class="row full-width justify-center mt-6">
        <CButton
          @click="updateProfileData()"
          :disabled="!isSaveAvailable"
          height="40px"
          :loading="$customer.loadings.update"
          width="280px"
          >Сохранить</CButton
        >
      </div>
    </div> -->
  </div>
  <!-- <CButton
      @click="acceptModal = true"
      class="pr-3"
      text-button
      icon="fa-light fa-trash"
      height="40px"
      color="secondary-button-color"
      :style="$q.screen.lt.md ? 'position: absolute; top: 0; right: 0' : ''"
      text-color="on-background-color"
      >{{ 'Удалить аккаунт' }}
    </CButton> -->
  <EditProfileModal v-model="editProfileModal" />
  <AcceptModal
    text="Вы точно хотите выйти из аккаунта?"
    v-model="acceptModal"
    @accept="logOut()"
  />
</template>
<script lang="ts" setup>
import { cloneDeep } from 'lodash'
import CButton from 'src/components/template/buttons/CButton.vue'
import { authentication } from 'src/models/authentication/authentication'
import { Customer } from 'src/models/customer/customer'
import { ref, computed, onMounted } from 'vue'
import ProfileUserCard from './ProfileUserCard.vue'
import EditProfileModal from './EditProfileModal.vue'
// import CCheckBox from 'src/components/helpers/CCheckBox.vue'
import AcceptModal from 'src/components/dialogs/AcceptModal.vue'
import { cartRepo } from 'src/models/carts/cartRepo'
import { useRouter } from 'vue-router'
import { orderRepo } from 'src/models/order/orderRepo'
// import { cartRepo } from 'src/models/carts/cartRepo'

const router = useRouter()

const editProfileModal = ref(false)

// const receiveSpecialOffers = ref(false)

const acceptModal = ref(false)

const item = computed(() => {
  return authentication.user
})

const _item = ref<Customer | null>(null)

// const parsedPhone = computed(() => {
//   const phone = String(_item.value?.phone)
//   if (phone.startsWith('7')) {
//     return phone.slice(1)
//   } else return phone
// })

// const isSaveAvailable = computed(() => {
//   return (
//     _item.value?.firstName.length &&
//     !isEqual(item.value, _item.value) &&
//     (_item.value.email
//       ? typeof rules.email(_item.value.email) !== 'string'
//       : true)
//   )
// })

// const updateSex = (v: string) => {
//   if (!_item.value) return
//   const foundSex = sexValues.find((el) => el.label === v)
//   if (foundSex) {
//     _item.value.sex = foundSex.value
//   }
// }

// const updateProfileData = async () => {
//   try {
//     const res = await customerRepo.update(_item.value)
//     authentication.user = cloneDeep(res)
//     Notify.create({
//       message: 'Данные профиля обновлены',
//     })
//   } catch {
//     customerRepo.loadings.update = false
//     Notify.create({
//       message: 'Ошибка при обновлении профиля',
//       color: 'danger',
//     })
//   }
// }

const logOut = () => {
  cartRepo.item = null
  void authentication.logout()

  void router.push({
    name: 'home',
  })
  acceptModal.value = false
}

onMounted(() => {
  _item.value = cloneDeep(item.value)
  void orderRepo.list()
})

// const deleteAccount = async () => {
//   try {
//     if (!item.value) return
//     await customerRepo.delete(item.value)
//     Notify.create({
//       message: 'Аккаунт успешно удален',
//     })
//   } catch {
//     Notify.create({
//       message: 'Ошибка при удалении аккаунта',
//       color: 'danger',
//     })
//   }
// }
</script>

<style lang="scss" scoped>
.bordered-element {
  border: 1px var(--secondary) solid;
}
</style>

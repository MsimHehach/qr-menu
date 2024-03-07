<template>
  <div
    v-if="!!info && !loading"
    class="px-xl-35 px-sm-20 px-xs-5 px-md-25 px-lg-30 pb-20"
  >
    <PrepareUiSettings />
    <div class="row mb-sm-4">
      <div class="col">
        <h4>
          <strong>Условия использования</strong>
        </h4>
      </div>
    </div>
    <div class="column gap-15">
      <div class="row">
        <div class="column gap-5">
          <h6 class="mt-0 mb-0 bold">Условия предзаказа товара:</h6>
          <ol class="column pl-8 gap-5">
            <li>Услугой предзаказа можно воспользоваться на сайте заведения</li>
            <li>
              Вы можете выбрать любое блюдо доступное для заказа в меню на
              сайте.
            </li>
            <li>
              Количество продукции ограничено (все блюда готовятся только из
              свежих продуктов, поэтому количество некоторых блюд может быть
              ограничено). При отсутствии возможности приготовить заказанное
              блюдо, гостю предоставляется альтернативный продукт или
              возвращаются деньги.
            </li>
          </ol>
        </div>
      </div>

      <div class="row">
        <div class="column gap-5">
          <h6 class="mt-0 mb-0 bold">
            Перечень Кафе, предоставляющих услугу предзаказов:
          </h6>
          <ol class="gap-5 column pl-8">
            <li v-for="(el, index) in info.sales_points" :key="index">
              {{ el.custom_address || el.address }} ({{
                getLegalEntity(el)?.name || '-'
              }})
            </li>
          </ol>
        </div>
      </div>
      <div class="row">
        <div class="column gap-5">
          <h6 class="mt-0 mb-0 bold">Возврат товара</h6>
          <div>
            Возврат переведенных средств, производится на Ваш банковский счет в
            течение 5—30 рабочих дней (срок зависит от Банка, который выдал Вашу
            банковскую карту).
          </div>
        </div>
      </div>

      <div>
        <h6 class="my-0 bold">Документы:</h6>
        <div class="col no-wrap items-center gap-5 mt-10">
          <!-- <q-icon size="26px" name="fal fa-file-powerpoint" /> -->
          <div>
            <a
              :href="linkToPolicy"
              class="my-0"
              style="font-size: 14px"
              target="_blank"
              >Политика в отношении обработки персональных данных</a
            >
          </div>
          <div class="mt-8">
            <a
              :href="linkToTermsOfUse"
              class="mt-8"
              style="font-size: 14px"
              target="_blank"
              >Пользовательское соглашение</a
            >
            <a
              :href="linkToOffer"
              class="mt-8"
              style="font-size: 14px"
              target="_blank"
              >Публичная оферта</a
            >
          </div>
        </div>
      </div>

      <div class="row">
        <div class="column gap-5">
          <h6 class="mt-0 mb-10 bold">Политика безопастности платежей</h6>
          <!-- v-if="!isBest2Pay" -->
          <template v-if="false">
            <div>Банковской картой</div>
            <div>
              Для выбора оплаты товара с помощью банковской карты на
              соответствующей странице необходимо выбрать способ оплаты "онлайн"
              и нажать кнопку
              <span class="bold"> Перейти к оплате</span>. Оплата происходит
              через "{{ info?.bank?.bank }}" с использованием банковских карт
              следующих платёжных систем:
            </div>
            <div class="row full-width justify-evenly my-15">
              <img
                src="assets/psMir.png"
                style="object-fit: contain"
                width="150px"
              />
              <img
                src="assets/psVisa.png"
                style="object-fit: contain"
                width="150px"
              />

              <img
                src="assets/psMasterCard.png"
                style="object-fit: contain"
                width="150px "
              />

              <img
                src="assets/psJCB.svg"
                style="object-fit: contain"
                width="150px "
              />
            </div>
            <div>
              Для оплаты (ввода реквизитов Вашей карты) Вы будете перенаправлены
              на платёжный шлюз "{{ info?.bank?.bank }}". Соединение с платёжным
              шлюзом и передача информации осуществляется в защищённом режиме с
              использованием протокола шифрования SSL. В случае если Ваш банк
              поддерживает технологию безопасного проведения интернет-платежей
              Verified By Visa, MasterCard SecureCode, MIR Accept, J-Secure, для
              проведения платежа также может потребоваться ввод специального
              пароля.
            </div>
            <!-- ООО "ПЭЙСЕЛЕКШН" -->
            <div class="mb-10">
              Настоящий сайт поддерживает 256-битное шифрование.
              Конфиденциальность сообщаемой персональной информации
              обеспечивается "{{ info?.bank?.bank }}". Введённая информация не
              будет предоставлена третьим лицам за исключением случаев,
              предусмотренных законодательством РФ. Проведение платежей по
              банковским картам осуществляется в строгом соответствии с
              требованиями платёжных систем МИР, Visa Int., MasterCard Europe
              Sprl, JCB.
            </div>
            <div>
              Если заказ был отменен или не принят по другим причинам, то
              денежные средства возвращаются на счет покупателя.Возврат
              переведённых средств, производится на ваш банковский счёт в
              течение 5-30 рабочих дней (срок зависит от банка, который выдал
              вашу банковскую карту).
            </div>
          </template>
          <BestToPay v-else />
        </div>
      </div>

      <div class="row">
        <div class="row full-width">
          <h6 class="mt-0 mb-10 bold">Реквизиты:</h6>
          <div class="row full-width gap-1">
            <div
              v-for="(el, index) in info.legal_entities"
              :key="index"
              class="column col-xs-12 col-sm-9 col-md-6 gap-5 mb-10"
            >
              <q-separator v-if="index" class="divider-color" />
              <div>{{ el.name || ' -' }}</div>
              <div>ИНН: {{ el.code || ' -' }}</div>
              <div>КПП: {{ el.registration_code || ' -' }}</div>
              <div>Юридический адрес: {{ el.legal_address || ' -' }}</div>
              <div>Тел.: {{ el.contact_phone || ' -' }}</div>
              <div>Email: {{ el.contact_email || ' -' }}</div>
            </div>
          </div>
        </div>
        <div
          v-if="!loading"
          class="row full-width"
          :key="$company.companyForProfile?.id"
        >
          <ProfileAddressesOnMap class="full-width">
            <template v-slot:title>
              <div class="row items-center mt-0 mb-10 gap-10">
                <h6 class="bold ma-0">Карта с нашими заведениями:</h6>
                <div
                  v-if="
                    $companyGroup.item &&
                    $companyGroup.item.companies.length > 1
                  "
                >
                  <CButton
                    class="body"
                    :label="$company.companyForProfile?.name || undefined"
                    text-button
                    icon-right="fal fa-chevron-down"
                    @click="selectCompanyModalModelValue = true"
                    text-color="on-background-color"
                    icon-color="on-background-color"
                    hover-text-color="primary"
                  />
                </div>
              </div>
            </template>
          </ProfileAddressesOnMap>
        </div>
      </div>
    </div>
  </div>
  <div v-if="loading" class="absolute-center items-center justify-center flex">
    <q-spinner-puff color="accent1" size="20%" />
  </div>
  <SelectCompanyModal
    v-model="selectCompanyModalModelValue"
    :selected-company="$company.companyForProfile || undefined"
    @select="$company.companyForProfile = $event"
    close-on-select
  />
</template>
<script lang="ts" setup>
import { TermsOfServiceInfo } from 'src/models/companyGroup/companyGroup'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import BestToPay from './BestToPay.vue'
import { SalesPointRaw } from 'src/models/salesPoint/salesPoint'
import ProfileAddressesOnMap from 'pages/profile/ProfileAddressesOnMap.vue'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { AppManager } from 'src/models/utils/appManager'
import { companyRepo } from 'src/models/company/companyRepo'
import SelectCompanyModal from 'components/dialogs/SelectCompanyModal.vue'
import CButton from 'components/template/buttons/CButton.vue'
import PrepareUiSettings from 'components/template/PrepareUiSettings.vue'

const info = ref<TermsOfServiceInfo | null>(null)
const loading = ref(false)
const route = useRoute()
const selectCompanyModalModelValue = ref(false)

const linkToPolicy = computed(() => {
  return `https://${window.location.host}/${String(
    route.params.externalId,
  )}/policy`
})

const linkToTermsOfUse = computed(() => {
  return `https://${window.location.host}/${String(
    route.params.externalId,
  )}/terms_of_use`
})

const linkToOffer = computed(() => {
  return `https://${window.location.host}/${String(
    route.params.externalId,
  )}/offer`
})

// const isBest2Pay = computed(() => {
//   if (info.value?.bank) {
//     return info.value.bank.bank ? info.value.bank.bank === 'best2pay' : true
//   } else return true
// })

const getLegalEntity = (v: SalesPointRaw) => {
  return info.value?.legal_entities.find((val) =>
    val.sales_points.map((el) => el.uuid).includes(v.uuid),
  )
}

onMounted(async () => {
  if (!route.params.externalId) return
  loading.value = true
  await new AppManager({
    companyGroupId: String(route.params.externalId),
  }).initApp()
  companyRepo.companyForProfile = companyRepo.item
  if (
    !companyRepo.companyForProfile &&
    companyGroupRepo.item?.companies.length
  ) {
    companyRepo.companyForProfile = companyGroupRepo.item.companies[0]
  }
  info.value = await companyGroupRepo.getTermsOfServiceInfo(
    String(route.params.externalId),
  )
  // const headers = {
  //   'Company-Group': route.params.externalId,
  // }
  //
  // await companyGroupRepo.current(headers)
  // if (companyGroupRepo.item && companyGroupRepo.item?.companies.length < 2) {
  //   companyRepo.companyForProfile = companyGroupRepo.item.companies[0]
  // }

  loading.value = false
})
</script>

<style lang="scss" scoped>
body.screen--xs {
  h4 {
    font-size: 26px !important;
    line-height: 32px;
  }
}
</style>

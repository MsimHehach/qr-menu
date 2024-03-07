<template>
  <div ref="header" style="position: sticky; top: 0; z-index: 10">
    <q-header
      v-if="!isArrangementPage"
      class="text-on-background-color transition bg-background-color"
      :class="{ 'box-shadow': $store.verticalScroll > 70 }"
    >
      <div class="column c-container">
        <div
          :style="`height: ${$q.screen.lt.md ? '66' : '72'}px`"
          class="row justify-between gap-lg-8 gap-xs-6 items-center no-wrap full-width"
        >
          <div
            class="row gap-6 no-wrap items-center"
            :class="
              $companyGroup.item && $companyGroup.item.companies.length < 2
                ? $q.screen.lt.lg
                  ? 'col-shrink'
                  : 'col'
                : 'col-shrink'
            "
          >
            <CIcon
              v-if="$q.screen.lt.lg"
              @click="$store.leftDrawer = true"
              name="fa-regular fa-bars"
              color="on-background-color"
              size="24px"
              class="mr-5 cursor-pointer"
              hover-color="primary"
            />
            <img
              v-if="
                $company.item?.logo?.thumbnail ||
                $company.item?.image?.thumbnail
              "
              @click="
                $router.push({
                  name: 'home',
                })
              "
              :height="$q.screen.gt.md ? '52' : '48'"
              class="border-radius cursor-pointer"
              style="object-fit: contain; max-width: 230px"
              :src="
                $q.screen.lt.lg
                  ? $company.item?.image?.thumbnail
                  : $company.item?.logo?.thumbnail ||
                    $company.item?.image?.thumbnail
              "
            />
            <CButton
              v-if="
                $companyGroup.item &&
                $companyGroup.item.companies.length > 1 &&
                !$store.tableMode
              "
              @click="$store.selectCompanyModal = true"
              text-button
              text-color="secondary-text"
            >
              <div
                v-if="$q.screen.gt.lg"
                class="row no-wrap gap-2 items-center"
              >
                <CIcon
                  color="secondary-text"
                  size="21px"
                  name="fa-regular fa-angle-left"
                />

                <div class="body bold mt-1">Все заведения</div>
              </div>
              <CIcon v-else name="fa-regular fa-angle-down" size="24px" />
            </CButton>
            <div
              v-if="
                $companyGroup.item &&
                $companyGroup.item.companies.length < 2 &&
                $q.screen.gt.md
              "
              ref="multipleCompaniesSpot"
              class="ml-xl-15 ml-lg-10 ml-xs-0 ml-md-5 col"
            ></div>
          </div>
          <teleport
            :disabled="
              !multipleCompaniesSpot ||
              ($companyGroup.item && $companyGroup.item.companies.length > 1) ||
              $q.screen.lt.lg
            "
            :to="multipleCompaniesSpot"
          >
            <div
              style="width: inherit"
              :class="$q.screen.lt.lg ? 'justify-end' : $companyGroup.item"
              class="row no-wrap items-center col gap-lg-8 gap-xs-6"
            >
              <CButton
                v-if="$q.screen.gt.md"
                @click="openCitySelectorModal()"
                style="border-radius: 100px !important"
                height="44px"
                outlined
                color="product-tile-color"
              >
                <div class="row gap-4 no-wrap body text-on-product-tile-color">
                  <!-- <CustomIcon width="22px" height="22px" name="city.svg" /> -->
                  <CIcon
                    size="22px"
                    color="on-product-tile-color"
                    name="fa-regular fa-city"
                  />

                  <div class="mt-1 bold">
                    {{
                      $companyGroup.item?.cityData.current?.name ||
                      'Калининград'
                    }}
                  </div>
                </div>
              </CButton>
              <ServiceSettingsBlock />
            </div>
          </teleport>

          <div
            v-if="authentication.user"
            class="row no-wrap items-center gap-lg-8 gap-xs-6 mt-md-2 mt-xs-8 secondary-text"
            style="height: 48px; width: fit-content"
          >
            <template v-if="$q.screen.gt.md">
              <div
                @click="
                  $cart.loading
                    ? void 0
                    : ($store.cartDrawer = !$store.cartDrawer)
                "
                class="column full-height justify-between cursor-pointer items-center no-wrap relative-position"
              >
                <template v-if="!$cart.loading">
                  <q-badge
                    v-if="$cart.item?.cartItemsQuantitySum"
                    color="primary"
                    class="cart-badge row justify-center"
                    >{{ $cart.item?.cartItemsQuantitySum }}</q-badge
                  >
                  <CIcon
                    size="23px"
                    color="on-background-color"
                    name="fa-regular fa-basket-shopping"
                  />
                  <!-- <CustomIcon
                    width="28px"
                    height="28px"
                    name="shoppingBasket.svg"
                  /> -->
                </template>
                <q-spinner v-else color="on-background-color" size="23px" />
                <div class="bold">Корзина</div>
              </div>
              <div
                @click="$store.bonusesModal = true"
                class="column full-height justify-between cursor-pointer items-center no-wrap relative-position"
              >
                <q-badge
                  v-if="previewBalance"
                  color="primary"
                  class="balance-badge row justify-center"
                  >{{ previewBalance }}</q-badge
                >
                <CIcon
                  color="on-background-color"
                  size="23px"
                  name="fa-regular fa-gift"
                />
                <!-- <CustomIcon width="28px" height="28px" name="gift.svg" /> -->
                <div class="bold">Бонусы</div>
              </div>
            </template>
            <div
              v-if="$q.screen.gt.md"
              @click="
                $router.push({
                  name: 'profilePage',
                })
              "
              class="column full-height justify-between cursor-pointer items-center no-wrap"
            >
              <CIcon
                color="on-background-color"
                :size="$q.screen.gt.sm ? '23px' : '32px'"
                name="fa-regular fa-face-smile"
              />
              <!-- <CustomIcon
                :width="$q.screen.gt.sm ? '28px' : '38px'"
                :height="$q.screen.gt.sm ? '28px' : '38px'"
                name="squareFace.svg"
              /> -->

              <div v-if="$q.screen.gt.sm" class="bold">Профиль</div>
            </div>
          </div>
          <div
            v-else
            @click="$store.authModal = true"
            :style="`height: ${$q.screen.gt.sm ? '44' : '40'}px`"
            class="auth-button cursor-pointer text-primary body bold row items-center px-sm-15 px-xs-10"
          >
            Войти
          </div>
        </div>
        <!-- <q-separator color="divider-color" style="z-index: 10" /> -->
        <BottomHeader v-if="$route.name === 'home'" />
      </div>
      <!-- <div class="c-container full-height column">
        <div
          v-if="$q.screen.gt.sm"
          class="row no-wrap justify-between items-center pt-10 gap-xs-6 gap-lg-14"
        >
          <div
            class="no-wrap row cursor-pointer items-center gap-xs-6 gap-lg-14 items-center"
            @click="$router.push({ name: 'home' })"
          >
            <img
              v-if="
                $q.screen.gt.sm &&
                ($company.item?.logo?.thumbnail ||
                  $company.item?.image?.thumbnail)
              "
              :height="$q.screen.gt.md ? '48' : '44'"
              class="border-radius"
              style="object-fit: contain"
              :src="
                $company.item?.logo?.thumbnail ||
                $company.item?.image?.thumbnail
              "
            />

            <CButton
              v-if="
                $companyGroup.item &&
                $companyGroup.item.companies.length > 1 &&
                !$store.tableMode
              "
              @click="$store.selectCompanyModal = true"
              :height="$q.screen.gt.md ? '48px' : '44px'"
              :width="$q.screen.gt.md ? undefined : '44px'"
              color="secondary-button-color"
              text-color="on-secondary-button-color"
            >
              <div
                v-if="$q.screen.gt.lg"
                class="row no-wrap gap-3 items-center"
              >
                <div class="body">Изменить заведение</div>
                <CIcon size="21px" name="fa-regular fa-angle-right" />
              </div>
              <CIcon v-else name="fa-regular fa-angle-down" size="20px" />
            </CButton>
          </div>
          <div class="row gap-xs-6 gap-lg-14 no-wrap">
            <div class="body">
              <ServiceSettingsBlock v-if="authentication.user" />
              <ServiceSettingsSkeleton v-if="authentication.loading" />
            </div>
            <CButton
              v-if="!authentication.loading && !$store.tableMode"
              @click="profileButtonClickHandler()"
              :height="$q.screen.gt.md ? '48px' : '44px'"
              :width="$q.screen.gt.md ? '160px' : '44px'"
              color="secondary-button-color"
              text-color="on-secondary-button-color"
            >
              <div
                v-if="$q.screen.gt.md"
                class="row items-center gap-3 no-wrap"
              >
                <CIcon size="19px" name="fa-regular fa-user" />
                <div class="body">
                  {{ authentication.user ? 'Профиль' : 'Войти' }}
                </div>
              </div>
              <CIcon v-else name="fa-regular fa-user" size="19px" />
            </CButton>
          </div>
        </div>
        <MainHeaderMobile v-else />
      </div> -->
    </q-header>
    <ArrangementHeader v-else-if="$q.screen.gt.sm" />
    <BonusesInDevModal v-model="$store.bonusesModal" />
    <CitySelectorModal v-model="$store.citySelectorModal" />
  </div>
</template>

<script setup lang="ts">
import CButton from 'src/components/template/buttons/CButton.vue'
import { authentication } from 'src/models/authentication/authentication'
import ServiceSettingsBlock from 'src/components/serviceSettings/ServiceSettingsBlock.vue'
import { store } from 'src/models/store'
import { useRoute } from 'vue-router'
// import ServiceSettingsSkeleton from 'src/components/serviceSettings/ServiceSettingsSkeleton.vue'
import { ref } from 'vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { computed, onMounted } from 'vue'
import ArrangementHeader from 'src/pages/arrangement/ArrangementHeader.vue'
// import MainHeaderMobile from './MainHeaderMobile.vue'
import BottomHeader from './BottomHeader.vue'
// import CustomIcon from 'src/components/template/helpers/CustomIcon.vue'
import BonusesInDevModal from 'src/components/template/dialogs/BonusesInDevModal.vue'
import CitySelectorModal from 'src/components/template/dialogs/CitySelectorModal.vue'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'

// const router = useRouter()

const route = useRoute()

const header = ref<HTMLDivElement>()

const multipleCompaniesSpot = ref<HTMLDivElement>()

const isArrangementPage = computed(() => {
  return route.path.includes('arrangement')
})

const previewBalance = computed(() => {
  if (!authentication.user || !authentication.user.wallets.length) return
  return authentication.user.wallets[0].balance > 999
    ? '999+'
    : authentication.user.wallets[0].balance
})

// const profileButtonClickHandler = () => {
//   if (authentication.user) {
//     void router.push({ name: 'profilePage' })
//   } else {
//     store.authModal = true
//   }
// }

// const selectCompany = async (v: Company) => {
//   selectCompanyModal.value = false
//   companyRepo.cartCompany = v
//   serviceModal.value = true
// }

const openCitySelectorModal = () => {
  if (!companyGroupRepo.item) return
  if (companyGroupRepo.item?.cityData.results.length > 1) {
    store.citySelectorModal = true
  }
}

onMounted(() => {
  store.headerHeight = header.value?.clientHeight || 0

  setTimeout(() => {
    document.addEventListener('resize', () => {
      store.headerHeight = header.value?.clientHeight || 0
    })
  }, 50)
})
</script>

<style scoped lang="scss">
.q-header {
  position: relative;
}
.auth-button {
  border: 2px solid var(--primary);
  border-radius: 100px;
}

.cart-badge {
  position: absolute;
  top: -10px;
  right: 5px;
  border-radius: 100px;
  font-size: 12px;
  height: 18px;
  min-width: 18px;
  z-index: 1;
}

.balance-badge {
  position: absolute;
  top: -10px;
  left: 31px;
  border-radius: 100px;
  font-size: 12px;
  height: 18px;
  min-width: 18px;
  z-index: 1;
}
</style>

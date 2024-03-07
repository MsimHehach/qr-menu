<template>
  <div :class="{ 'c-container': !$q.screen.xs }">
    <q-breadcrumbs
      v-if="!$q.screen.xs"
      separator=""
      class="mb-sm-15 mb-xs-10 mt-10"
    >
      <CHover v-slot="{ hover }">
        <q-breadcrumbs-el
          :label="
            $menu.item?.groups?.find((el) => el.id === $menuItem.item?.group)
              ?.name
          "
          class="caption-text pb-2"
          :class="hover ? 'text-primary' : 'text-on-background-color'"
          :to="{ name: 'home' }"
        />
      </CHover>
      <q-icon
        class="px-3 text-on-background-color"
        name="fal fa-chevron-right"
        style="font-size: 10px !important"
      />
      <q-breadcrumbs-el
        :label="$menuItem.item?.name || ''"
        class="caption-text text-on-background-color"
      />
    </q-breadcrumbs>
    <div
      :style="$q.screen.lt.md ? '' : 'min-height: 640px'"
      :class="$q.screen.xs ? 'column' : 'no-wrap row justify-between'"
      class="full-width relative-position items-start text-on-background-color"
    >
      <q-img
        v-if="!$menuItem.loadings.retrieve"
        :style="`${
          $q.screen.xs
            ? 'width: 100%; '
            : $q.screen.sm
            ? 'width: 45%'
            : 'width: 40%; min-height: 600px; max-height: 600px'
        }`"
        fit="cover"
        :class="{ 'main-image border-radius': !$q.screen.xs }"
        :src="$menuItem.item?.image?.thumbnail || $store.images.empty"
      >
        <template v-slot:error>
          <span>
            <q-img
              :height="$q.screen.xs ? '350px' : ''"
              fit="cover"
              class="border-radius"
              :src="$store.images.empty"
            ></q-img>
          </span>
        </template>
      </q-img>
      <q-skeleton
        v-else
        :width="$q.screen.xs ? '100%' : '40%'"
        :height="$q.screen.xs ? '350px' : '450px'"
        class="border-radius"
      />
      <div
        v-if="$q.screen.xs"
        @click="$router.go(-1)"
        style="position: absolute; top: 15px; left: 15px"
        class="bg-white-opacity cursor-pointer box-shadow py-4 px-5 border-radius"
      >
        <CIcon
          hover-color="primary"
          color="on-secondary-button-color"
          name="fa-light fa-angle-left"
        />
      </div>
      <!-- <div
        v-if="$q.screen.xs"
        style="position: absolute; top: 300px"
        class="row full-width justify-center"
      >
        <div
          style="width: max-content"
          class="px-6 py-3 row border-radius bg-background-color box-shadow gap-5 no-wrap items-center text-primary"
        >
          <template v-if="!$menuItem.loadings.retrieve">
            <div v-if="currentSize?.price" class="header">
              {{ currentSize?.price + ' ₽' }}
            </div>
            <div v-else class="header">Цена не указана</div>
          </template>
          <q-skeleton
            v-else
            width="90px"
            height="32px"
            class="border-radius my-2"
          ></q-skeleton>
        </div>
      </div> -->

      <div
        :class="{ 'full-width c-container': $q.screen.xs }"
        class="column col-sm-6 gap-sm-15 gap-xs-7 mt-xs-10 mt-sm-0"
      >
        <div ref="xsPriceSpot"></div>

        <div class="header row justify-between no-wrap relative-position">
          <template v-if="!$menuItem.loadings.retrieve">
            {{ $menuItem.item?.name }}
          </template>
          <q-skeleton
            v-else
            :height="$q.screen.xs ? '26px' : '35px'"
            class="border-radius"
            width="200px"
          />
          <MenuItemNutritions
            v-if="currentSize?.nutritions.length"
            :current-size="currentSize"
          />
        </div>
        <div v-if="$menuItem.item?.description" class="body">
          {{ $menuItem.item.description }}
        </div>
        <teleport :to="xsPriceSpot" :disabled="!xsPriceSpot || !$q.screen.xs">
          <div
            style="width: max-content"
            class="px-6 py-3 row border-radius bg-background-color box-shadow gap-5 no-wrap items-center text-primary"
          >
            <template v-if="!$menuItem.loadings.retrieve">
              <div
                v-if="currentSize?.price"
                :class="$q.screen.xs ? 'header3' : 'header'"
              >
                {{ currentSize?.price + ' ₽' }}
              </div>
              <div v-else class="header">Цена не указана</div>
            </template>
            <q-skeleton
              v-else
              width="90px"
              height="32px"
              class="border-radius my-2"
            ></q-skeleton>
          </div>
        </teleport>
        <div class="column gap-10">
          <div
            v-if="currentSize && currentSize.characteristics"
            class="body text-primary"
          >
            <template v-if="!$menuItem.loadings.retrieve">
              {{ currentSize?.characteristics.weight.toFixed(2) }} г
            </template>
            <q-skeleton v-else width="100px" />
          </div>
          <div
            v-if="$menuItem.item && $menuItem.item.sizes.length > 1"
            class="relative-position"
          >
            <ItemSizeSelector
              :sizes="$menuItem.item.sizes"
              :model-value="currentSize || undefined"
              @update-tab="currentSize = $event"
            />
          </div>
        </div>
        <div :style="$q.screen.xs ? '' : 'max-width: 456px'">
          <div v-for="(el, index) in currentSize?.modifierGroups" :key="index">
            <ModifiersSelector :class="{ 'mt-10': index }" :item="el" />
          </div>

          <div
            class="row items-center gap-sm-15 gap-xs-5"
            :class="[
              { 'mt-15': currentSize?.modifierGroups?.length },
              {
                'no-wrap full-width box-shadow pa-5 bg-backing-color':
                  $q.screen.xs,
              },
            ]"
            :style="$q.screen.xs ? 'position: fixed; bottom: 0px; left: 0' : ''"
          >
            <ChangeAmount
              :small="$q.screen.xs"
              background-color="white"
              v-model="quantity"
            />
            <div
              v-if="$store.tableMode && !$pad.item?.settings.orders_enabled"
              class="full-width text-danger"
            >
              Оформление заказов временно недоступно
            </div>
            <CButton
              @click="addToCart()"
              class="col-grow"
              :height="$q.screen.xs ? '42px' : '50px'"
              :loading="loading"
              :disabled="isAddToCardDisabled"
              :icon="$q.screen.xs ? '' : 'fa-light fa-shopping-cart'"
              :label="$q.screen.xs ? 'В корзину' : 'Добавить в корзину'"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <ServiceSettingsModal
    :model-value="cartConfigureModal"
    @update:model-value="cartModalCloseHandler()"
  />
  <ItemNotFoundModal
    :model-value="itemNotFoundModal"
    @update:model-value="notFoundModalCloseHandler()"
  />
</template>
<script lang="ts" setup>
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { menuItemRepo } from 'src/models/menu/menuItem/menuItemRepo'
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChangeAmount from 'src/components/inputs/ChangeAmount.vue'
import CButton from 'src/components/template/buttons/CButton.vue'
import CHover from 'src/components/template/helpers/CHover.vue'
import { Notify, useQuasar } from 'quasar'
import { cartItemRepo } from 'src/models/carts/cartItem/cartItemRepo'
import { cartRepo } from 'src/models/carts/cartRepo'
import ModifiersSelector from './ModifiersSelector.vue'
import { CartItemModifier } from 'src/models/carts/cartItem/cartItem'
import { ItemSize } from 'src/models/menu/menu'
import { sum } from 'lodash'
import ServiceSettingsModal from 'src/components/serviceSettings/ServiceSettingsModal.vue'
import { companyRepo } from 'src/models/company/companyRepo'
import { salesPointRepo } from 'src/models/salesPoint/salesPointRepo'
import { menuRepo } from 'src/models/menu/menuRepo'
import { authentication } from 'src/models/authentication/authentication'
import { store } from 'src/models/store'
import { padRepo } from 'src/models/pads/padRepo'
import ItemNotFoundModal from './ItemNotFoundModal.vue'
import ItemSizeSelector from './ItemSizeSelector.vue'
import MenuItemNutritions from './MenuItemNutritions.vue'

const route = useRoute()

const router = useRouter()

const cartConfigureModal = ref(false)

const quantity = ref(1)

const itemNotFoundModal = ref(false)

const loading = ref(false)

const currentSize = ref<ItemSize | null>(null)

const xsPriceSpot = ref<HTMLDivElement>()

const q = useQuasar()

onMounted(() => {
  void menuItemRepo.retrieve(String(route.params.menuItemId)).then(() => {
    currentSize.value = menuItemRepo.item?.sizes[0]
      ? menuItemRepo.item?.sizes[0]
      : null
  })
})

const notFoundModalCloseHandler = () => {
  itemNotFoundModal.value = false
  void router.replace({
    name: 'home',
  })
}

const cartModalCloseHandler = () => {
  cartConfigureModal.value = false
  const menuItemsIds = menuRepo.item?.groups?.flatMap((v) =>
    v.items.map((el) => el.id)
  )
  if (
    menuItemRepo.item &&
    menuItemsIds &&
    !menuItemsIds.includes(menuItemRepo.item?.id)
  ) {
    itemNotFoundModal.value = true
  }
}

const isAddToCardDisabled = computed(() => {
  return (
    (store.tableMode && !padRepo.item?.settings.orders_enabled) ||
    currentSize.value?.modifierGroups?.some(
      (v) =>
        v.restrictions?.min_quantity &&
        sum(v.items.map((el) => el.quantity)) < v.restrictions.min_quantity
    ) ||
    !quantity.value
  )
})

const addToCart = async () => {
  if (!authentication.user && !store.tableMode) {
    store.authModal = true
    return
  }
  if (!cartRepo.item && salesPointRepo.item) {
    await companyRepo.retrieve(
      typeof salesPointRepo.item.company === 'string'
        ? salesPointRepo.item.company
        : salesPointRepo.item.company?.id || ''
    )
    cartConfigureModal.value = true
  } else if (cartRepo.item && currentSize.value) {
    try {
      loading.value = true
      await cartItemRepo.createCartItem({
        cart: cartRepo.item?.id,
        quantity: quantity.value,
        size: currentSize.value?.id,
        cart_item_modifiers:
          currentSize.value.modifierGroups?.flatMap((v) =>
            v.items
              .map((el) => {
                return {
                  modifier: el.id,
                  quantity: el.quantity,
                  price: el.price || 0,
                  sum: String(Number(el.price) * el.quantity),
                } as CartItemModifier
              })
              .filter((e) => e.quantity)
          ) || [],
      })
      quantity.value = 1
      loading.value = false
    } catch (e) {
      loading.value = false

      Notify.create({
        message: 'Ошибка при добавлении в корзину',
        color: 'danger',
      })
    }
  }
  if (q.screen.xs) {
    void router.push({
      name: route.name === 'menuItemPage' ? 'home' : 'qrHome',
    })
  }
}
</script>

<style lang="scss" scoped>
.main-image :deep(.q-img__image) {
  height: unset !important;
}
</style>

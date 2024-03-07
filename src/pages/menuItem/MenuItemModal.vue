<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :width="$q.screen.gt.md ? '1150px' : '500px'"
    :height="$q.screen.gt.md ? '600px' : undefined"
    height-percent="100%"
    :no-overflow="$q.screen.gt.md"
    dialog-class="no-scrollbar"
    no-padding
    :position="$q.screen.lt.md ? 'bottom' : undefined"
    :maximize="$q.screen.lt.md"
    :no-close="$q.screen.lt.md"
  >
    <div
      :class="$q.screen.lt.lg ? 'column' : 'row full-height '"
      class="no-wrap full-width relative-position text-on-background-color"
    >
      <div
        v-if="$q.screen.lt.md"
        @click="$store.menuItemModal = false"
        class="close-button row box-shadow items-center justify-center cursor-pointer"
      >
        <CIcon
          color="on-background-color"
          hover-color="primary"
          class="mt-1"
          name="fa-regular fa-angle-down"
          size="24px"
        />
      </div>
      <q-img
        :ratio="1"
        :class="{ dimmed: $menuItem.item?.isDead }"
        class="col"
        :style="`border-radius: ${getImageBorderRadius}; max-width: ${
          $q.screen.gt.md ? '600px' : $q.screen.md ? '500px' : undefined
        }; min-width: ${
          $q.screen.gt.md ? '600px' : $q.screen.md ? '500px' : undefined
        }; margin-bottom: ${$q.screen.lt.md ? '-20px' : 'unset'}`"
        fit="cover"
        :height="$q.screen.lt.lg ? '450px' : '100%'"
        style="width: 100%"
        :src="$menuItem.item?.image?.image || $store.images.empty"
      >
        <template v-slot:error>
          <span>
            <q-img
              :ratio="1"
              fit="cover"
              height="100%"
              width="600px"
              :src="$store.images.empty"
            ></q-img>
          </span> </template
      ></q-img>
      <div
        v-if="!$menuItem.loadings.retrieve"
        style="overflow-x: auto; width: -webkit-fill-available"
        class="column no-wrap justify-between full-height px-md-15 px-xs-8 pt-md-15 pt-xs-8 pb-xs-50 pb-lg-0 relative-position bg-background-color"
        :style="`border-radius: ${
          $q.screen.lt.md ? getImageBorderRadius : 'unset'
        }`"
      >
        <div class="column full-width">
          <div class="huge3 bold mb-2">{{ $menuItem.item?.name }}</div>
          <div
            v-if="currentSize?.characteristics.weight"
            style="opacity: 0.5"
            class="body"
          >
            {{ currentSize?.characteristics.weight }}г
          </div>
          <div
            v-if="$menuItem.item?.description?.length"
            class="body mb-8 mt-2"
          >
            {{ $menuItem.item?.description }}
          </div>
          <MenuItemCharacteristics v-if="currentSize" :size="currentSize" />

          <MenuItemRelatedItems
            v-if="
              $cart.item &&
              currentMenuRulesForAdding?.length &&
              !$menuRulesForAdding.loadings.list
            "
            :items="currentMenuRulesForAdding"
          />

          <div
            v-if="$menuItem.item && $menuItem.item.sizes.length > 1"
            class="relative-position mt-8"
          >
            <ItemSizeSelector
              :sizes="$menuItem.item?.sizes"
              :model-value="currentSize || undefined"
              @update-tab="currentSize = $event"
            />
          </div>
          <div class="mt-10">
            <div v-for="(el, index) in currentModifierGroups" :key="index">
              <q-separator v-if="index" color="divider-color" class="my-8" />
              <ModifiersSelector :group="el" />
            </div>
          </div>
        </div>
        <teleport :to="touchSpot" :disabled="!touchSpot || !$q.screen.lt.lg">
          <div
            class="row items-center gap-sm-15 gap-xs-5 bg-background-color py-lg-12 py-xs-10 bottom-block"
            :class="[
              { 'mt-lg-15': currentSize?.modifierGroups?.length },
              {
                'px-md-15 px-xs-8 full-width': $q.screen.lt.lg,
              },
            ]"
            :style="`position: ${
              $q.screen.lt.lg ? 'absolute' : 'sticky'
            }; bottom: 0px; left: 0px; border-radius:${
              $q.screen.lt.md ? 'unset' : getBottomBlockBorderRadius
            }`"
          >
            <ChangeAmount
              :height="$q.screen.lt.lg ? '40px' : '48px'"
              background-color="white"
              v-model="quantity"
              text-color="on-secondary-button-color"
            />
            <div
              v-if="$store.tableMode && !$pad.item?.settings.orders_enabled"
              class="full-width text-danger"
            >
              Оформление заказов временно недоступно
            </div>
            <div class="col-grow">
              <CButton
                @click="addToCart()"
                class="full-width subtitle-text"
                :height="$q.screen.lt.lg ? '40px' : '48px'"
                :loading="loading"
                :disabled="isAddToCardDisabled"
                :label="`Добавить ${
                  currentPrice
                    ? `за ${beautifyNumber(currentPrice, true)} ₽`
                    : ''
                }`"
              >
              </CButton>
              <CTooltip v-if="$menuItem.item?.isDead"
                >Товар недоступен</CTooltip
              >
            </div>
          </div>
        </teleport>
      </div>
      <div
        v-else
        class="column justify-between full-width px-md-15 px-xs-8 pt-md-15 pt-xs-8 pb-xs-50 pb-lg-0"
      >
        <div>
          <q-skeleton height="30px" width="80%" class="mb-5" />
          <q-skeleton height="30px" width="40%" class="mb-5" />
          <q-skeleton height="20px" width="20%" class="mb-5" />
          <q-skeleton height="20px" width="100%" class="mb-3" />
          <q-skeleton height="20px" width="100%" class="mb-3" />
          <q-skeleton height="20px" width="40%" />
        </div>
        <div class="row full-width py-lg-12 py-xs-10 gap-sm-15 gap-xs-5">
          <q-skeleton :height="$q.screen.lt.lg ? '40px' : '48px'" width="30%" />
          <q-skeleton :height="$q.screen.lt.lg ? '40px' : '48px'" class="col" />
        </div>
      </div>
    </div>
    <div v-if="$q.screen.lt.lg" ref="touchSpot"></div>
  </CDialog>
</template>
<script lang="ts" setup>
import CDialog from 'src/components/template/dialogs/CDialog.vue'
import MenuItemCharacteristics from './MenuItemCharacteristics.vue'
import { ItemSize } from 'src/models/menu/menu'
import { ref, watch, computed } from 'vue'
import { menuItemRepo } from 'src/models/menu/menuItem/menuItemRepo'
import ItemSizeSelector from './ItemSizeSelector.vue'
import ModifiersSelector from './ModifiersSelector.vue'
import ChangeAmount from 'src/components/inputs/ChangeAmount.vue'
import CButton from 'src/components/template/buttons/CButton.vue'
import { store } from 'src/models/store'
import { padRepo } from 'src/models/pads/padRepo'
import { sum } from 'lodash'
import { authentication } from 'src/models/authentication/authentication'
import { cartRepo } from 'src/models/carts/cartRepo'
import { companyRepo } from 'src/models/company/companyRepo'
import { salesPointRepo } from 'src/models/salesPoint/salesPointRepo'
import { cartItemRepo } from 'src/models/carts/cartItem/cartItemRepo'
import { CartItemModifier } from 'src/models/carts/cartItem/cartItem'
import { Notify, useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { beautifyNumber } from 'src/models/store'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import CTooltip from 'src/components/helpers/CTooltip.vue'
import MenuItemRelatedItems from './MenuItemRelatedItems.vue'
import { menuRulesForAddingRepo } from 'src/models/menu/menuItem/menuRulesForAdding/menuRulesForAddingRepo'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
}>()

const touchSpot = ref<HTMLDivElement>()

const currentSize = ref<ItemSize | null>(null)

const quantity = ref(1)

const loading = ref(false)

const q = useQuasar()

const route = useRoute()

const router = useRouter()

const currentMenuRulesForAdding = computed(() => {
  if (!cartRepo.item) return
  return menuRulesForAddingRepo.items.filter((el) => {
    const availableTypes = el.availableDeliveryTypes as string[]
    const currentCartType = cartRepo.item?.type as string
    return availableTypes.includes(currentCartType)
  })
})

const getImageBorderRadius = computed(() => {
  return `${uiSettingsRepo.item?.borderRadius}px ${
    q.screen.lt.lg ? uiSettingsRepo.item?.borderRadius : '0'
  }px  0 ${q.screen.gt.md ? uiSettingsRepo.item?.borderRadius : '0'}px`
})

const getBottomBlockBorderRadius = computed(() => {
  return q.screen.lt.lg
    ? `0 0 ${uiSettingsRepo.item?.borderRadius}px ${uiSettingsRepo.item?.borderRadius}px`
    : 'unset'
})

const currentModifierGroups = computed(() => {
  return currentSize.value?.modifierGroups?.filter(
    (v) =>
      !v.isHidden && !!v.items.length && v.items.some((el) => !el.is_hidden),
  )
})

const currentPrice = computed(() => {
  return (
    ((currentSize.value?.price || 0) +
      sum(
        currentSize.value?.modifierGroups?.flatMap((v) =>
          v.items.map((el) => el.quantity * (el.price || 0)),
        ),
      )) *
    quantity.value
  )
})

watch(
  () => menuItemRepo.item,
  () => {
    if (props.modelValue) {
      quantity.value = 1
      currentSize.value = menuItemRepo.item?.sizes[0]
        ? menuItemRepo.item?.sizes[0]
        : null
    }
  },
)

const isAddToCardDisabled = computed(() => {
  if (menuItemRepo.item?.isDead) return true
  return (
    (store.tableMode && !padRepo.item?.settings.orders_enabled) ||
    currentSize.value?.modifierGroups?.some(
      (v) =>
        v.restrictions?.min_quantity &&
        sum(v.items.map((el) => el.quantity)) < v.restrictions.min_quantity,
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
    const foundCompany = companyGroupRepo.item?.companies.find(
      (v) =>
        v.id ===
        (typeof salesPointRepo.item?.company === 'string'
          ? salesPointRepo.item.company
          : salesPointRepo.item?.company?.id || ''),
    )
    if (foundCompany) companyRepo.item = foundCompany
    else
      await companyRepo.retrieve(
        typeof salesPointRepo.item.company === 'string'
          ? salesPointRepo.item.company
          : salesPointRepo.item.company?.id || '',
      )
    store.serviceSettingsModal = true
    store.storedMenuItem = menuItemRepo.item?.id || null
    emit('update:modelValue', false)
  } else if (cartRepo.item && currentSize.value) {
    try {
      cartRepo.loading = true
      loading.value = true
      await cartItemRepo.createCartItem({
        cart: cartRepo.item?.id,
        quantity: quantity.value,
        size: currentSize.value?.id || '',
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
              .filter((e) => e.quantity),
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
    } finally {
      emit('update:modelValue', false)
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
.bottom-block {
  border-top: 1px var(--divider-color) solid;
}

.close-button {
  position: sticky;
  margin-bottom: -40px;
  top: 10px;
  width: 40px;
  height: 40px;
  z-index: 10;
  border-radius: 50%;
  background-color: var(--background-color);
  left: 10px;
}

.dimmed {
  filter: grayscale(90%);
}
</style>

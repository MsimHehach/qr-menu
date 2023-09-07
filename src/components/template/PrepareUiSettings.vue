<template>
  <div></div>
</template>
<script lang="ts" setup>
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import { onMounted, ref } from 'vue'

const borderRadius = ref<string>('15px')
const primaryColor = ref<string>('#ed772f')
const onPrimaryColor = ref<string>('#000')

const accentColor = ref<string>('#fdffb7')
const onAccentColor = ref<string>('#000')

const backgroundColor = ref<string>('#f8f8f8')
const onBackgroundColor = ref<string>('#000')
const inputColor = ref<string>('#ed772f')
const onInputColor = ref<string>('#000')
const dividerColor = ref<string>('#000')
const bottomMenuColor = ref<string>('#f8f8f8')
const onBottomMenuColor = ref<string>('#000')
const backingColor = ref<string>('#f8f8f8')
const onBackingColor = ref<string>('#000')
const bonusColor = ref<string>('#ffddc9')
const onBonusColor = ref<string>('#000')

const saleColor = ref<string>('#fdffb7')
const onSaleColor = ref<string>('#000')

const giftColor = ref<string>('#dc1818')
const onGiftColor = ref<string>('#000')

const productTileColor = ref<string>('#fff')
const onProductTileColor = ref<string>('#000')

const selectorColor = ref<string>('#fff')
const onSelectorColor = ref<string>('#000')

const selectorActiveColor = ref<string>('#f5e24f3e')
const onSelectorActiveColor = ref<string>('#000')

const buttonColor = ref<string>('#ed772f')
const onButtonColor = ref<string>('#fff')

const secondaryButtonColor = ref<string>('#e9e9e9')
const onSecondaryButtonColor = ref<string>('#000')

const deliveryButtonColor = ref<string>('#fff')
const onDeliveryButtonColor = ref<string>('#000')

const pickupButtonColor = ref<string>('#fff')
const onPickupButtonColor = ref<string>('#000')

const bookingButtonColor = ref<string>('#fff')
const onBookingButtonColor = ref<string>('#000')

const modalHeaderColor = ref<string>('#e9e9e9')
const onModalHeaderColor = ref<string>('#000')

const boxShadow = ref<string>('0px 0px 13px 0px rgba(0, 0, 0, 0.06)')

const cashButtonColor = ref<string>('#fff')
const onCashButtonColor = ref<string>('#000')

const cardButtonColor = ref<string>('#fff')
const onCardButtonColor = ref<string>('#000')

const onlineButtonColor = ref<string>('#fff')
const onOnlineButtonColor = ref<string>('#000')

const qrColor = ref<string>('#fff')
const onQrColor = ref<string>('#000')

const loyaltyCardBackgroundColor = ref<string>('#e9e9e9')
const onLoyaltyCardBackgroundColor = ref<string>('#000')

onMounted(() => {
  if (uiSettingsRepo.item) {
    borderRadius.value = `${uiSettingsRepo.item.borderRadius}px`
    primaryColor.value = `#${uiSettingsRepo.item.primaryColor.color}`
    onPrimaryColor.value = `#${uiSettingsRepo.item.primaryColor.on_color}`
    accentColor.value = `#${uiSettingsRepo.item.accentColor.color}`
    onAccentColor.value = `#${uiSettingsRepo.item.accentColor.on_color}`
    backgroundColor.value = `#${uiSettingsRepo.item.backgroundColor.color}`
    onBackgroundColor.value = `#${uiSettingsRepo.item.backgroundColor.on_color}`
    inputColor.value = `#${uiSettingsRepo.item.inputColor.color}`
    onInputColor.value = `#${uiSettingsRepo.item.inputColor.on_color}`
    dividerColor.value = `#${uiSettingsRepo.item.dividerColor.color}`
    bottomMenuColor.value = `#${uiSettingsRepo.item.bottomMenuColor.color}`
    onBottomMenuColor.value = `#${uiSettingsRepo.item.bottomMenuColor.on_color}`
    backingColor.value = `#${uiSettingsRepo.item.backingColor.color}`
    onBackingColor.value = `#${uiSettingsRepo.item.backingColor.on_color}`
    bonusColor.value = `#${uiSettingsRepo.item.bonusColor.color}`
    onBonusColor.value = `#${uiSettingsRepo.item.bonusColor.on_color}`
    saleColor.value = `#${uiSettingsRepo.item.saleColor.color}`
    onSaleColor.value = `#${uiSettingsRepo.item.saleColor.on_color}`
    giftColor.value = `#${uiSettingsRepo.item.giftColor.color}`
    onGiftColor.value = `#${uiSettingsRepo.item.giftColor.on_color}`
    productTileColor.value = `#${uiSettingsRepo.item.productTileColor.color}`
    onProductTileColor.value = `#${uiSettingsRepo.item.productTileColor.on_color}`
    selectorColor.value = `#${uiSettingsRepo.item.selectorColor.color}`
    onSelectorColor.value = `#${uiSettingsRepo.item.selectorColor.on_color}`
    selectorActiveColor.value = `#${uiSettingsRepo.item.selectorActiveColor.color}`
    onSelectorActiveColor.value = `#${uiSettingsRepo.item.selectorActiveColor.on_color}`
    buttonColor.value = `#${uiSettingsRepo.item.buttonColor.color}`
    onButtonColor.value = `#${uiSettingsRepo.item.buttonColor.on_color}`
    secondaryButtonColor.value = `#${uiSettingsRepo.item.secondaryButtonColor.color}`
    onSecondaryButtonColor.value = `#${uiSettingsRepo.item.secondaryButtonColor.on_color}`
    deliveryButtonColor.value = `#${uiSettingsRepo.item.deliveryButtonColor.color}`
    onDeliveryButtonColor.value = `#${uiSettingsRepo.item.deliveryButtonColor.on_color}`
    pickupButtonColor.value = `#${uiSettingsRepo.item.pickupButtonColor.color}`
    onPickupButtonColor.value = `#${uiSettingsRepo.item.pickupButtonColor.on_color}`
    bookingButtonColor.value = `#${uiSettingsRepo.item.bookingButtonColor.color}`
    onBookingButtonColor.value = `#${uiSettingsRepo.item.bookingButtonColor.on_color}`
    modalHeaderColor.value = `#${uiSettingsRepo.item.modalHeaderColor.color}`
    onModalHeaderColor.value = `#${uiSettingsRepo.item.modalHeaderColor.on_color}`
    boxShadow.value = `${uiSettingsRepo.item.boxShadow.offset_x}px ${uiSettingsRepo.item.boxShadow.offset_y}px ${uiSettingsRepo.item.boxShadow.blur}px ${uiSettingsRepo.item.boxShadow.spread}px ${uiSettingsRepo.item.boxShadow.color}`
    cashButtonColor.value = `#${uiSettingsRepo.item.cashButtonColor.color}`
    onCashButtonColor.value = `#${uiSettingsRepo.item.cashButtonColor.on_color}`
    cardButtonColor.value = `#${uiSettingsRepo.item.cardButtonColor.color}`
    onCardButtonColor.value = `#${uiSettingsRepo.item.cardButtonColor.on_color}`
    onlineButtonColor.value = `#${uiSettingsRepo.item.onlinePaymentButtonColor.color}`
    onOnlineButtonColor.value = `#${uiSettingsRepo.item.onlinePaymentButtonColor.on_color}`
    qrColor.value = `#${uiSettingsRepo.item.qrColor.color}`
    onQrColor.value = `#${uiSettingsRepo.item.qrColor.on_color}`
    loyaltyCardBackgroundColor.value = `#${uiSettingsRepo.item.loyaltyCardBackgroundColor.color}`
    onLoyaltyCardBackgroundColor.value = `#${uiSettingsRepo.item.loyaltyCardBackgroundColor.on_color}`
  }
  document.body.style.setProperty('--primary', primaryColor.value)
  document.body.style.setProperty('--on-primary', onPrimaryColor.value)

  document.body.style.setProperty('--q-primary', primaryColor.value)

  document.body.style.setProperty('--accent', accentColor.value)
  document.body.style.setProperty('--on-accent', onAccentColor.value)

  document.body.style.setProperty('--background-color', backgroundColor.value)
  document.body.style.setProperty(
    '--on-background-color',
    onBackgroundColor.value
  )
  document.body.style.setProperty('--input-color', inputColor.value)
  document.body.style.setProperty('--on-input-color', onInputColor.value)

  document.body.style.setProperty('--divider-color', dividerColor.value)
  document.body.style.setProperty('--bottom-menu-color', bottomMenuColor.value)
  document.body.style.setProperty(
    '--on-bottom-menu-color',
    onBottomMenuColor.value
  )
  document.body.style.setProperty('--backing-color', backingColor.value)
  document.body.style.setProperty('--on-backing-color', onBackingColor.value)
  document.body.style.setProperty('--bonus-color', bonusColor.value)
  document.body.style.setProperty('--on-bonus-color', onBonusColor.value)
  document.body.style.setProperty('--sale-color', saleColor.value)
  document.body.style.setProperty('--on-sale-color', onSaleColor.value)
  document.body.style.setProperty('--gift-color', giftColor.value)
  document.body.style.setProperty('--on-gift-color', onGiftColor.value)
  document.body.style.setProperty(
    '--product-tile-color',
    productTileColor.value
  )
  document.body.style.setProperty(
    '--on-product-tile-color',
    onProductTileColor.value
  )
  document.body.style.setProperty('--selector-color', selectorColor.value)
  document.body.style.setProperty('--on-selector-color', onSelectorColor.value)
  document.body.style.setProperty(
    '--selector-active-color',
    selectorActiveColor.value
  )
  document.body.style.setProperty(
    '--on-selector-active-color',
    onSelectorActiveColor.value
  )

  document.body.style.setProperty('--button-color', buttonColor.value)

  document.body.style.setProperty('--on-button-color', onButtonColor.value)

  document.body.style.setProperty(
    '--secondary-button-color',
    secondaryButtonColor.value
  )
  document.body.style.setProperty(
    '--on-secondary-button-color',
    onSecondaryButtonColor.value
  )
  document.body.style.setProperty(
    '--delivery-button-color',
    deliveryButtonColor.value
  )
  document.body.style.setProperty(
    '--on-delivery-button-color',
    onDeliveryButtonColor.value
  )
  document.body.style.setProperty(
    '--pickup-button-color',
    pickupButtonColor.value
  )
  document.body.style.setProperty(
    '--on-pickup-button-color',
    onPickupButtonColor.value
  )
  document.body.style.setProperty(
    '--booking-button-color',
    bookingButtonColor.value
  )
  document.body.style.setProperty(
    '--on-booking-button-color',
    onBookingButtonColor.value
  )
  document.body.style.setProperty(
    '--modal-header-color',
    modalHeaderColor.value
  )
  document.body.style.setProperty(
    '--on-modal-header-color',
    onModalHeaderColor.value
  )
  document.body.style.setProperty('--border-radius', borderRadius.value)
  document.body.style.setProperty('--box-shadow', boxShadow.value)

  document.body.style.setProperty('--cash-button-color', cashButtonColor.value)
  document.body.style.setProperty(
    '--on-cash-button-color',
    onCashButtonColor.value
  )
  document.body.style.setProperty('--card-button-color', cardButtonColor.value)
  document.body.style.setProperty(
    '--on-card-button-color',
    onCardButtonColor.value
  )
  document.body.style.setProperty(
    '--online-button-color',
    onlineButtonColor.value
  )
  document.body.style.setProperty(
    '--on-online-button-color',
    onOnlineButtonColor.value
  )
  document.body.style.setProperty('--qr-color', qrColor.value)
  document.body.style.setProperty('--on-qr-color', onQrColor.value)
  document.body.style.setProperty(
    '--loyalty-card-background-color',
    loyaltyCardBackgroundColor.value
  )
  document.body.style.setProperty(
    '--on-loyalty-card-background-color',
    onLoyaltyCardBackgroundColor.value
  )
})
</script>

<style lang="scss">
$colors: (
  'primary': --primary,
  'on-primary': --on-primary,
  'accent': --accent,
  'on-accent': --on-accent,
  'background-color': --background-color,
  'on-background-color': --on-background-color,
  'input-color': --input-color,
  'on-input-color': --on-input-color,
  'divider-color': --divider-color,
  'bottom-menu-color': --bottom-menu-color,
  'on-bottom-menu-color': --on-bottom-menu-color,
  'backing-color': --backing-color,
  'on-backing-color': --on-backing-color,
  'bonus-color': --bonus-color,
  'on-bonus-color': --on-bonus-color,
  'sale-color': --sale-color,
  'on-sale-color': --on-sale-color,
  'gift-color': --gift-color,
  'on-gift-color': --on-gift-color,
  'product-tile-color': --product-tile-color,
  'on-product-tile-color': --on-product-tile-color,
  'selector-color': --selector-color,
  'on-selector-color': --on-selector-color,
  'selector-active-color': --selector-active-color,
  'on-selector-active-color': --on-selector-active-color,
  'button-color': --button-color,
  'on-button-color': --on-button-color,
  'secondary-button-color': --secondary-button-color,
  'on-secondary-button-color': --on-secondary-button-color,
  'delivery-button-color': --delivery-button-color,
  'on-delivery-button-color': --on-delivery-button-color,
  'pickup-button-color': --pickup-button-color,
  'on-pickup-button-color': --on-pickup-button-color,
  'booking-button-color': --booking-button-color,
  'on-booking-button-color': --on-booking-button-color,
  'modal-header-color': --modal-header-color,
  'on-modal-header-color': --on-modal-header-color,
  'cash-button-color': --cash-button-color,
  'on-cash-button-color': --on-cash-button-color,
  'card-button-color': --card-button-color,
  'on-card-button-color': --on-card-button-color,
  'online-button-color': --online-button-color,
  'on-online-button-color': --on-online-button-color,
  'qr-color': --qr-color,
  'on-qr-color': --on-qr-color,
  'loyalty-card-background-color': --loyalty-card-background-color,
  'on-loyalty-card-background-color': --on-loyalty-card-background-color,
);

.border-radius {
  border-radius: var(--border-radius) !important;
}

.box-shadow {
  box-shadow: var(--box-shadow) !important;
}

@each $index, $color in $colors {
  .bg-#{$index} {
    background: var($color) !important;
  }

  .text-#{$index} {
    color: var($color) !important;
    &.q-select .q-field__native span {
      color: var($color) !important;
    }
  }
  .q-btn.underline.text-#{$index}:after,
  .q-btn.underline-fixed.text-#{$index}:after {
    background: var($color) !important;
  }
  .bg-#{$index} .q-field__label {
    background: var($color) !important;
    border-radius: 4px;
  }
}

.q-drawer {
  border-radius: var(--border-radius) !important;
}
</style>

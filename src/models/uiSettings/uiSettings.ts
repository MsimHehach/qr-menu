import { ImageRaw, Image } from 'src/models/image/image'
import { BaseModel } from 'src/corexModels/apiModels/baseModel'
import { parseAlphaColorsFromCorrect } from '../store'

export type BottomBarElementType =
  | 'home'
  | 'arrange'
  | 'cart'
  | 'profile'
  | 'booking'
  | 'company_profile'
  | 'pdf_menu'

export type BottomBarElementRaw = {
  active: boolean
  semantic_label: BottomBarElementType
  sorting: number
  title: string
  uuid: string
}

export type ColorRaw = {
  color: string
  on_color: string
}

export class Color implements BaseModel {
  id: undefined
  color: string
  on_color: string
  constructor(raw: ColorRaw) {
    this.color = parseAlphaColorsFromCorrect(raw.color)
    this.on_color = parseAlphaColorsFromCorrect(raw.on_color)
  }

  toJson() {
    return
  }
}

export type UiSettingsRaw = {
  uuid: string
  primary_color: ColorRaw
  background_color: ColorRaw
  secondary_color: ColorRaw
  secondary_text_color: ColorRaw
  accent_color: ColorRaw
  input_type: string
  bottom_menu_color: ColorRaw
  input_color: ColorRaw
  button_color: ColorRaw
  backing_color: ColorRaw
  empty_bonuses_text: string | null
  gift_color: ColorRaw
  bonus_color: ColorRaw
  sale_color: ColorRaw
  qr_color: ColorRaw
  secondary_button_color: ColorRaw
  selection_color: ColorRaw
  card_color: ColorRaw
  loyalty_card_background_color: ColorRaw
  border_radius: number
  border_radius_small: number
  loader: string
  favicon: string | null
  logo: {
    uuid: string
    image: string
    thumbnail: string
    background_color: string
  } | null
  background_image: string | null
  loyalty_card_image: ImageRaw | null
  loyalty_card_logo: ImageRaw | null
  on_primary_color: string | null
  on_accent_color: string | null
  on_background_color: string | null
  box_shadow: BoxShadow
  company: string | null
  company_group: {
    uuid: string
    name: string
  }
  base_settings: UiSettingsRaw | null
  menu_color: string | null
  qr_code_description: string
  created_at: string
  updated_at: string | null
  divider_color: ColorRaw
  product_tile_color: ColorRaw
  selector_color: ColorRaw
  selector_active_color: ColorRaw
  delivery_button_color: ColorRaw
  pickup_button_color: ColorRaw
  booking_button_color: ColorRaw
  modal_header_color: ColorRaw
  social_button_image: ImageRaw | null
  cash_button_color: ColorRaw
  card_button_color: ColorRaw
  online_payment_button_color: ColorRaw
  bottom_bar_elements: BottomBarElementRaw[]
  become_franchisee: {
    title: string | null
    link: string | null
  } | null
}

export type BoxShadow = {
  uuid: string
  color: string
  blur: number
  spread: number
  offset_x: number
  offset_y: number
}

export class UiSetting implements BaseModel {
  id: string
  primaryColor: Color
  backgroundColor: Color
  secondaryColor: Color
  secondaryTextColor: Color
  accentColor: Color
  inputType: string
  bottomMenuColor: Color
  inputColor: Color
  buttonColor: Color
  backingColor: Color
  emptyBonusesText: string | null
  giftColor: Color
  bonusColor: Color
  saleColor: Color
  qrColor: Color
  secondaryButtonColor: Color
  selectionColor: Color
  cardColor: Color
  loyaltyCardBackgroundColor: Color
  borderRadius: number
  borderRadiusSmall: number
  loader: string
  favicon: string | null
  logo: {
    uuid: string
    image: string
    thumbnail: string
    background_color: string
  } | null
  backgrounImage: string | null
  loyaltyCardImage: Image | null
  loyaltyCardLogo: Image | null
  onPrimaryColor: string | null
  onAccentColor: string | null
  onBackgroundColor: string | null
  boxShadow: BoxShadow
  company: string | null
  companyGroup: {
    uuid: string
    name: string
  }
  baseSettings: UiSettingsRaw | null
  menuColor: string | null
  qrCodeDescription: string
  createdAt: string
  updatedAt: string | null
  dividerColor: Color
  productTileColor: Color
  selectorColor: Color
  selectorActiveColor: Color
  deliveryButtonColor: Color
  pickupButtonColor: Color
  bookingButtonColor: Color
  modalHeaderColor: Color
  socialButtonImage: Image | null
  cashButtonColor: Color
  cardButtonColor: Color
  onlinePaymentButtonColor: Color
  bottomBarElements: BottomBarElementRaw[]
  becomeFranchisee: {
    title: string | null
    link: string | null
  } | null

  constructor(raw: UiSettingsRaw) {
    this.id = raw.uuid
    this.primaryColor = new Color(raw.primary_color)
    this.backgroundColor = new Color(raw.background_color)
    this.secondaryColor = new Color(raw.secondary_color)
    this.secondaryTextColor = new Color(raw.secondary_text_color)
    this.accentColor = new Color(raw.accent_color)
    this.inputType = raw.input_type
    this.bottomMenuColor = new Color(raw.bottom_menu_color)
    this.inputColor = new Color(raw.input_color)
    this.buttonColor = new Color(raw.button_color)
    this.backingColor = new Color(raw.backing_color)
    this.emptyBonusesText = raw.empty_bonuses_text
    this.giftColor = new Color(raw.gift_color)
    this.bonusColor = new Color(raw.bonus_color)
    this.saleColor = new Color(raw.sale_color)
    this.qrColor = new Color(raw.qr_color)
    this.secondaryButtonColor = new Color(raw.secondary_button_color)
    this.selectionColor = new Color(raw.selection_color)
    this.cardColor = new Color(raw.card_color)
    this.loyaltyCardBackgroundColor = new Color(
      raw.loyalty_card_background_color
    )
    this.borderRadius = raw.border_radius
    this.borderRadiusSmall = raw.border_radius_small
    this.loader = raw.loader
    this.favicon = raw.favicon
    this.logo = raw.logo
    this.backgrounImage = raw.background_image
    this.loyaltyCardImage = raw.loyalty_card_image
      ? new Image(raw.loyalty_card_image)
      : null
    this.loyaltyCardLogo = raw.loyalty_card_logo
      ? new Image(raw.loyalty_card_logo)
      : null
    this.onPrimaryColor = raw.on_primary_color
    this.onAccentColor = raw.on_accent_color
    this.onBackgroundColor = raw.on_background_color
    this.boxShadow = {
      uuid: raw.box_shadow.uuid,
      color: parseAlphaColorsFromCorrect(raw.box_shadow.color),
      blur: raw.box_shadow.blur,
      spread: raw.box_shadow.spread,
      offset_x: raw.box_shadow.offset_x,
      offset_y: raw.box_shadow.offset_y,
    }
    this.company = raw.company
    this.companyGroup = raw.company_group
    this.baseSettings = raw.base_settings
    this.menuColor = raw.menu_color
    this.qrCodeDescription = raw.qr_code_description
    this.createdAt = raw.created_at
    this.updatedAt = raw.updated_at
    this.dividerColor = new Color(raw.divider_color)
    this.productTileColor = new Color(raw.product_tile_color)
    this.selectorColor = new Color(raw.selector_color)
    this.selectorActiveColor = new Color(raw.selector_active_color)
    this.deliveryButtonColor = new Color(raw.delivery_button_color)
    this.pickupButtonColor = new Color(raw.pickup_button_color)
    this.bookingButtonColor = new Color(raw.booking_button_color)
    this.modalHeaderColor = new Color(raw.modal_header_color)
    this.socialButtonImage = raw.social_button_image
      ? new Image(raw.social_button_image)
      : null
    this.cashButtonColor = new Color(raw.cash_button_color)
    this.cardButtonColor = new Color(raw.card_button_color)
    this.onlinePaymentButtonColor = new Color(raw.online_payment_button_color)
    this.bottomBarElements = raw.bottom_bar_elements
    this.becomeFranchisee = raw.become_franchisee
  }

  toJson() {
    return
  }
}

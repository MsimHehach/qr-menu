import { MenuModifierGroupItemRaw } from './../../menu/menuModifierGroup/menuModifierGroup'
import { ImageRaw } from 'src/models/image/image'
import { BaseModel } from 'src/corexModels/apiModels/baseModel'
import { PriceRaw } from 'src/models/order/order'

export type CartItemModifier = {
  uuid: string
  modifier: string | null
  quantity: number
  price: number | null
  sum: string
}

export type CartItemFullModifier = {
  uuid: string
  modifier: MenuModifierGroupItemRaw | null
  quantity: number
  price: string | null
  sum: string
}

export type CartItemSizeRaw = {
  uuid: string
  name: string | null
  menu_item: string | null
  sku: string | null
  image: ImageRaw | null
  sorting: number
  prices: PriceRaw[]
  code: string | null
  external_id: string | null
  price: number
}

export type CartItemRaw = {
  uuid: string
  size: CartItemSizeRaw
  quantity: number
  price: number
  cart: string | null
  discounted_total_sum: number
  sum: number
  total_sum: number
  cart_item_modifiers: CartItemFullModifier[]
  free_item: string | number | null
  available_quantity: number | null
  attached_to: string | null
}

export class CartItem implements BaseModel {
  id: string
  size: CartItemSizeRaw
  quantity: number
  price: number
  cart: string | null
  discountedTotalSum: number
  sum: number
  totalSum: number
  cartItemModifiers: CartItemFullModifier[]
  freeItem: string | number | null
  availableQuantity: number | null
  attachedTo: string | null

  constructor(raw: CartItemRaw) {
    this.id = raw.uuid
    this.size = raw.size
    this.quantity = raw.quantity
    this.price = raw.price
    this.cart = raw.cart
    this.discountedTotalSum = raw.discounted_total_sum
    this.sum = raw.sum
    this.totalSum = raw.total_sum
    this.cartItemModifiers = raw.cart_item_modifiers
    this.freeItem = raw.free_item
    this.availableQuantity = raw.available_quantity
    this.attachedTo = raw.attached_to
  }

  get isDead() {
    return this.availableQuantity ? this.availableQuantity <= 0 : false
  }

  toJson(): Record<string, any> {
    return {
      size: this.size.uuid,
      cart_item_modifiers: this.cartItemModifiers.map((v) => {
        return {
          modifier: v.modifier?.uuid,
          quantity: v.quantity,
        }
      }),
      cart: this.cart,
      quantity: this.quantity,
    }
  }
}

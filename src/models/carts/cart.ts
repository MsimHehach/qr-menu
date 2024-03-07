import {
  DeliveryAddressRaw,
  DeliveryAddress,
} from './../customer/deliveryAddress/deliveryAddress'
import { SalesPointRaw, SalesPoint } from './../salesPoint/salesPoint'
import { BaseModel } from 'src/corexModels/apiModels/baseModel'
import { CartItem, CartItemRaw } from './cartItem/cartItem'
import moment from 'moment'
import { WalletRaw } from '../customer/customer'
import { sum } from 'lodash'

export enum CartType {
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
  BOOKING = 'booking',
}

export type WalletPaymentRaw = {
  active: boolean
  applied_sum: number
  cart: string
  max_sum: number
  uuid: string
  wallet: WalletRaw
}

export type AvailableHours = {
  today: [
    {
      start: string
      end: string
    },
  ]
  tomorrow: [
    {
      start: string
      end: string
    },
  ]
}

export type CartParams = {
  sales_point?: string
  type?: string
  delivery_address?: string
  delivery_time?: string | null
  promo_code?: string
  applied_wallet_payments?: {
    wallet_payment: string
    applied_sum: number
  }[]
  comment?: string | null
}

export type CartRaw = {
  uuid: string
  customer: string
  company: string
  type: CartType
  sales_point: SalesPointRaw
  delivery_address: DeliveryAddressRaw | null
  sum: number
  total_sum: number
  total_discount: number
  created_at: string
  delivery_time: string | null
  discounted_total_sum: number
  discounted_sum: number
  applied_bonuses: number
  promo_code: string | null
  comment: string | null
  cart_items: CartItemRaw[]
  // free_items: [];
  // wallet_payments: [];
  // tables: [];
  calculation_status: string
  delivery_area: string | null
  current_delivery_settings: string | null
  delivery_price: number
  wallet_payments: WalletPaymentRaw[]
  errors: {
    description: string | null
    title: string | null
  }[]
}

export class Cart implements BaseModel {
  id: string
  customer: string
  company: string
  type: CartType
  salesPoint: SalesPoint
  deliveryAddress: DeliveryAddress | null
  sum: number
  totalSum: number
  totalDiscount: number
  createdAt: string
  deliveryTime: string | null
  discountedTotalSum: number
  discountedSum: number
  appliedBonuses: number
  promoCode: string | null
  comment: string | null
  cartItems: CartItem[]
  deliveryPrice: number
  walletPayments: WalletPaymentRaw[]
  errors: {
    description: string | null
    title: string | null
  }[]

  constructor(raw: CartRaw) {
    this.id = raw.uuid
    this.customer = raw.customer
    this.company = raw.company
    this.type = raw.type
    this.salesPoint = new SalesPoint(raw.sales_point)
    this.deliveryAddress = raw.delivery_address
      ? new DeliveryAddress(raw.delivery_address)
      : null
    this.sum = raw.sum
    this.totalSum = raw.total_sum
    this.totalDiscount = raw.total_discount
    this.createdAt = raw.created_at
    this.deliveryTime = raw.delivery_time
      ? moment
          .utc(raw.delivery_time, 'YYYY-MM-DD HH:mm:ss')
          .local()
          .format('DD.MM.YYYY HH:mm')
      : null
    this.discountedTotalSum = raw.discounted_total_sum
    this.discountedSum = raw.discounted_sum
    this.appliedBonuses = raw.applied_bonuses
    this.promoCode = raw.promo_code
    this.comment = raw.comment
    this.cartItems = raw.cart_items.map((item) => new CartItem(item))
    this.deliveryPrice = raw.delivery_price
    this.walletPayments = raw.wallet_payments
    this.errors = raw.errors
  }

  get cartItemsQuantitySum() {
    return sum(
      this.cartItems.filter((el) => !el.attachedTo).map((v) => v.quantity),
    )
  }

  get currentAddress() {
    return this.type === 'delivery'
      ? this.deliveryAddress?.name
      : this.salesPoint.customAddress || this.salesPoint.address
  }

  get currentDeliveryType() {
    return this.type === 'pickup'
      ? 'Самовывоз'
      : this.type === 'delivery'
        ? 'Доставка'
        : 'Бронь'
  }

  toJson(): Record<string, any> {
    return {
      // id: this.id,
    }
  }
}

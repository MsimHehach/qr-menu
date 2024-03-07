import { TableRaw } from './../sections/tables/table'
import { NutritionType } from './../menu/menu'
import { Customer, CustomerRaw } from './../customer/customer'
import { SalesPoint, SalesPointRaw } from './../salesPoint/salesPoint'
import { BaseModel } from 'src/corexModels/apiModels/baseModel'
import moment from 'moment'
import { ImageRaw } from '../image/image'
import { MenuModifierGroupRaw } from '../menu/menuModifierGroup/menuModifierGroup'

export type PaymentObjectType = {
  label: string
  type: PaymentType
  class: string
  icon: string
}

export enum OrderStatusType {
  CREATED = 'created',
  VALIDATED = 'validated',
  ACCEPTED = 'accepted',
  COOKING = 'cooking',
  READY = 'ready',
  ON_WAY = 'on_way',
  DECLINED = 'declined',
  CLOSED = 'closed',
}

export enum PaymentType {
  CASH = 'cash',
  CARD = 'card',
  ONLINE = 'online',
  PAY_LATER = 'pay_later',
  NET_MONET = 'net_monet',
}

export enum PaymentStatusType {
  NOT_PAID = 'not_paid',
  FULL_PAID = 'full_paid',
  PART_PAID = 'part_paid',
  REFUND = 'refund',
  WAITING = 'waiting',
}

export const paymentTypeNames = {
  [PaymentType.CASH]: 'Наличными',
  [PaymentType.CARD]: 'Картой',
  [PaymentType.ONLINE]: 'Онлайн',
  [PaymentType.PAY_LATER]: 'Внести в счет',
  [PaymentType.NET_MONET]: 'netmonet',
}

export const paymentTypes = Object.keys(paymentTypeNames).map((el) => {
  const key = el as PaymentType
  return { label: paymentTypeNames[key] as PaymentType, value: key }
})

export type ModifierRaw = {
  uuid: string
  name: string
  external_id: string
  sku: string
  prices: PriceRaw[]
  modifier_group: string
  min_quantity: number
  image: string | null
  max_quantity: number
  free_quantity: number
  default_amount: number
}

export class OrdersFilter {
  search?: string
  created_from?: string
  created_to?: string
  delivery_time_from?: string
  delivery_time_to?: string
  sales_point?: SalesPoint
  delivery_type?: { id: string; label: string }
  order_status?: { id: string; label: string }

  toJson() {
    return {
      search: this.search,
      created_from: this.created_from
        ? moment.utc(this.created_from).format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      created_to: this.created_to
        ? moment.utc(this.created_to).format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      delivery_time_from: this.delivery_time_from
        ? moment.utc(this.delivery_time_from).format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      delivery_time_to: this.delivery_time_to
        ? moment.utc(this.delivery_time_to).format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      sales_point: this.sales_point?.id,
      type: this.delivery_type?.id,
      status: this.order_status?.id,
    }
  }
}

export type ModifiersRaw = {
  uuid: string
  active: boolean
  quantity: number
  price: number
  sum: number
  modifier: ModifierRaw
}

export type PriceRaw = {
  uuid: string
  item_size: string
  sales_point: string
  modifier?: string
  price: number
  created_at: string
  updated_at: string
}

export type NotritionRaw = {
  uuid: string
  type: NutritionType
  fats: number
  carbohydrates: number
  proteins: number
  calories: number
  size: string
}

export type ItemSize = {
  uuid: string
  name: string
  menu_item: string
  sku: string
  image: ImageRaw | null
  sorting: number
  price?: number
  prices?: PriceRaw[]
  code: string | number | null
  external_id: string | number | null
  characteristics: { weight: number }
  nutritions: NotritionRaw[]
  created_at: string
  updated_at: string
  modifier_groups?: MenuModifierGroupRaw[]
  restrictions?: {
    max_quantity: number
    min_quantity: number
    free_quantity: number
    default_amount: number
  }
}

export type OrderItemRaw = {
  uuid: string
  active: boolean
  quantity: number
  price: number
  sum: number
  total_sum: number
  discounted_total_sum?: number | null
  size: ItemSize
  modifiers: ModifiersRaw[]
  created_at: string
  updated_at: string
}

export type OrderRaw = {
  uuid: string | undefined
  sales_point: SalesPointRaw
  type: string
  customer: CustomerRaw
  status: OrderStatusType
  external_status: string | null
  external_id: string | null
  payment_status: string
  payment_type: PaymentType
  active: boolean
  total_sum: number
  discounted_total_sum: number | null
  review: string | null
  number: string | number | null
  delivery_time: string | null
  delivery_price?: number
  sum: number | null
  tables: TableRaw[]
  created_at: string | null
  updated_at: string | null
  items?: OrderItemRaw[]
  applied_bonuses: number
  received_bonuses: number
  payment_url: string | null
}

export class Order implements BaseModel {
  id: string | undefined
  salesPoint: SalesPoint
  type: string
  customer: Customer
  status: OrderStatusType
  externalStatus: string | null
  externalId: string | null
  paymentStatus: string
  paymentType: PaymentType
  active: boolean
  totalSum: number
  discountedTotalSum: number
  review: string | null
  number: string | number | null
  deliveryTime: string | null
  sum: number | null
  createdAt: string | null
  updatedAt: string | null
  items?: OrderItemRaw[]
  deliveryPrice: number
  appliedBonuses: number
  receivedBonuses: number
  paymentUrl: string | null

  constructor(raw: OrderRaw) {
    this.id = raw.uuid
    this.salesPoint = new SalesPoint(raw.sales_point)
    this.type = raw.type
    this.customer = new Customer(raw.customer)
    this.status = raw.status
    this.externalStatus = raw.external_status
    this.externalId = raw.external_id
    this.paymentStatus = raw.payment_status
    this.paymentType = raw.payment_type
    this.active = raw.active
    this.totalSum = raw.total_sum
    this.discountedTotalSum = raw.discounted_total_sum || raw.total_sum
    this.review = raw.review
    this.number = raw.number
    this.deliveryTime = raw.delivery_time
      ? moment.utc(raw.delivery_time).local().format('DD.MM.YYYY HH:mm')
      : null
    this.sum = raw.sum
    this.createdAt = moment
      .utc(raw.created_at)
      .local()
      .format('DD.MM.YYYY HH:mm')
    this.updatedAt = raw.updated_at
    this.items = raw.items
    this.deliveryPrice = raw.delivery_price || 0
    this.appliedBonuses = raw.applied_bonuses
    this.receivedBonuses = raw.received_bonuses
    this.paymentUrl = raw.payment_url
  }

  get getPaymentStatus() {
    if (this.paymentStatus === PaymentStatusType.NOT_PAID)
      return {
        color: 'gray-light',
        label: 'Не оплачен',
        textColor: 'black',
      }
    if (this.paymentStatus === PaymentStatusType.FULL_PAID)
      return {
        color: 'green',
        label: 'Оплачен',
        textColor: 'white',
      }
    if (this.paymentStatus === PaymentStatusType.WAITING)
      return {
        color: 'yellow',
        label: 'В ожидании',
        textColor: 'black',
      }
    if (this.paymentStatus === PaymentStatusType.REFUND)
      return {
        color: 'red',
        label: 'Возвращен',
        textColor: 'white',
      }
    if (this.paymentStatus === PaymentStatusType.PART_PAID)
      return {
        color: 'primary',
        label: 'Частично оплачен',
        textColor: 'white',
      }
  }

  get getPaymentType() {
    const type = this.paymentType
    if (type === PaymentType.ONLINE)
      return {
        label: 'Онлайн',
        icon: 'fa-light fa-mobile',
        color: 'success',
      }
    if (type === PaymentType.CARD)
      return {
        label: 'Картой курьеру',
        icon: 'fa-light fa-credit-card',
        color: 'primary',
      }
    if (type === PaymentType.CASH)
      return {
        label: 'Наличными',
        icon: 'fa-light fa-coin',
        color: 'accent2',
      }
    if (type === PaymentType.NET_MONET)
      return {
        label: 'net monet',
        icon: 'fa-light fa-diagram-project',
        color: 'danger',
      }
    if (type === PaymentType.PAY_LATER)
      return {
        label: 'Оплата позже',
        icon: 'fa-light fa-timer',
        color: 'gray-dark',
      }
  }

  get orderStatus() {
    const status = this.status
    if (status === 'created') return { name: 'Создан', color: '#1ac30b' }
    else if (status === 'validated')
      return { name: 'Проверен', color: '#929292' }
    else if (status === 'accepted') return { name: 'Принят', color: '#929292' }
    else if (status === 'declined') return { name: 'Отменен', color: '#dc1818' }
    else if (status === 'closed') return { name: 'Завершен', color: '#1ac30b' }
    else if (status === 'on_way') return { name: 'В пути', color: '#f5841c' }
    else if (status === 'cooking')
      return { name: 'Готовится', color: '#e7f51c' }
    else return { name: 'Готов', color: '#5a39ac' }
  }

  get deliveryType() {
    if (this.type === 'delivery') return 'Доставка'
    else return 'Самовывоз'
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      // sales_point: this.sales_point,
      // type: this.type,
      // customer: this.customer,
      // status: this.status,
      // external_status: this.external_status,
      // external_id: this.external_id,
      // payment_status: this.payment_status,
      // payment_type: this.payment_type,
      // active: this.active,
      // total_sum: this.total_sum,
      // review: this.review,
      // number: this.number,
      // delivery_time: moment
      //   .utc(this.delivery_time)
      //   .format('YYYY-MM-DD HH:mm:ss'),
      // sum: this.sum,
      // created_at: this.created_at,
      // updated_at: this.updated_at,
    }
  }
}

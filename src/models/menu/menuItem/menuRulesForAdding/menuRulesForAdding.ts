import { BaseModel } from 'src/corexModels/apiModels/baseModel'
import { MenuItem, MenuItemRaw } from '../menuItem'

export enum OrderType {
  DELIVERY = 'delivery',
  PICKUP = 'pickup',
  TABLE = 'table',
  BOOKING = 'booking',
}

export const ordersTypeNames = {
  [OrderType.DELIVERY]: 'Доставка',
  [OrderType.PICKUP]: 'Самовывоз',
  [OrderType.TABLE]: 'До стола',
  [OrderType.BOOKING]: 'Бронирование',
}

export const OrderTypes = Object.keys(ordersTypeNames).map((el) => {
  const key = el as OrderType
  return { label: ordersTypeNames[key] as OrderType, value: key }
})

export type MenuRulesForAddingRaw = {
  uuid?: string
  menu: string
  quantity?: number
  created_at?: string
  updated_at?: string
  active: boolean
  available_delivery_types: OrderType[]
  menu_item: MenuItemRaw
  added_menu_item?: MenuItemRaw
  ratio?: number
}

export class MenuRulesForAdding implements BaseModel {
  id: string
  menu: string
  quantity: number
  createdAt: string | null
  updatedAt: string | null
  active: boolean
  availableDeliveryTypes: OrderType[]
  menuItem: MenuItem
  addedMenuItem: MenuItem | null
  updated: boolean
  created: boolean
  search: string | null
  ratio: number

  constructor(raw: MenuRulesForAddingRaw) {
    this.id = raw.uuid || ''
    this.menu = raw.menu
    this.quantity = raw.quantity || 0
    this.createdAt = raw.created_at || null
    this.updatedAt = raw.updated_at || null
    this.active = raw.active
    this.availableDeliveryTypes = raw.available_delivery_types
    this.menuItem = new MenuItem(raw.menu_item)
    this.addedMenuItem = raw.added_menu_item
      ? new MenuItem(raw.added_menu_item)
      : null
    this.updated = false
    this.created = false
    this.search = null
    this.ratio = raw.ratio || 1
  }

  toJson(): Record<string, any> {
    return {
      menu: this.menu,
      menu_item: this.menuItem.id,
      added_menu_item: this.addedMenuItem?.id,
      available_delivery_types: this.availableDeliveryTypes,
      quantity: this.quantity,
      active: this.active,
      ratio: this.ratio,
    }
  }
}

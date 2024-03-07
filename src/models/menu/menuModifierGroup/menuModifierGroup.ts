import { ImageRaw } from './../../image/image'
import { NotritionRaw } from './../../order/order'
import { BaseModel } from 'src/corexModels/apiModels/baseModel'
import { Image } from 'src/models/image/image'

export type MenuModifierGroupItemRaw = {
  uuid: string
  name: string | null
  external_id: string
  sku: string | null
  sorting: number
  modifier_group: string | null
  is_hidden: boolean
  price: number | null
  restrictions: {
    max_quantity: number
    min_quantity: number
    free_quantity: number
    default_amount: number
  }
  nutritions: NotritionRaw
  image?: ImageRaw | null
  reserve?: number | null
}

export type MenuModifierGroupRaw = {
  uuid: string | undefined
  name: string | null
  external_id: string | null
  sku: string | null
  is_hidden: boolean
  sorting: number
  active: boolean
  menu: string | null
  items: MenuModifierGroupItemRaw[]
  restrictions?: {
    max_quantity: number
    min_quantity: number
    free_quantity: number
    default_amount: number
  }
  show: boolean
}

export class MenuModifierGroupItem implements BaseModel {
  id: string
  name: string | null
  external_id: string
  sku: string | null
  sorting: number
  modifier_group: string | null
  is_hidden: boolean
  price: number | null
  restrictions: {
    max_quantity: number
    min_quantity: number
    free_quantity: number
    default_amount: number
  }

  nutritions: NotritionRaw
  quantity: number
  image: Image | null
  reserve: number | null

  constructor(raw: MenuModifierGroupItemRaw) {
    this.id = raw.uuid
    this.name = raw.name
    this.external_id = raw.external_id
    this.sku = raw.sku
    this.sorting = raw.sorting
    this.modifier_group = raw.modifier_group
    this.is_hidden = raw.is_hidden
    this.price = raw.price
    this.restrictions = raw.restrictions
    this.nutritions = raw.nutritions
    this.quantity = raw.restrictions.default_amount
    this.image = raw.image ? new Image(raw.image) : null
    this.reserve =
      raw.reserve === undefined || raw.reserve === null ? null : raw.reserve
  }

  toJson(): Record<string, any> {
    return {
      // id: this.id,
      // external_id: this.externalId,
      // menu: this.menu,
      // is_hidden: this.isHidden,
    }
  }
}

export class MenuModifierGroup implements BaseModel {
  id: string | undefined
  name: string | null
  externalId: string | null
  sku: string | null
  isHidden: boolean
  sorting: number
  active: boolean
  menu: string | null
  items: MenuModifierGroupItem[]
  restrictions?: {
    max_quantity: number
    min_quantity: number
    free_quantity: number
    default_amount: number
  }

  constructor(raw: MenuModifierGroupRaw) {
    this.id = raw.uuid
    this.name = raw.name
    this.externalId = raw.external_id
    this.sku = raw.sku
    this.isHidden = raw.is_hidden
    this.sorting = raw.sorting
    this.active = raw.active
    this.menu = raw.menu
    this.items = raw.items.map((v) => new MenuModifierGroupItem(v))
    this.restrictions = raw.restrictions
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      external_id: this.externalId,
      menu: this.menu,
      is_hidden: this.isHidden,
    }
  }
}

import moment from 'moment'
import { BaseModel } from 'src/corexModels/apiModels/baseModel'
import { Customer } from 'src/models/customer/customer'
import { Order, OrderRaw } from '../order'

export type OrderReviewRaw = {
  uuid?: string | null
  order?: OrderRaw | string | null
  rating?: number | null
  comment?: string | null
  created_at?: string | null
}

export class OrderReviewsFilter {
  guest?: Customer
  rating_from?: number | null
  rating_to?: number | null
  with_comment?: boolean

  toJson() {
    return {
      guest: this.guest ? this.guest.id : undefined,
      rating_from: this.rating_from,
      rating_to: this.rating_to,
      with_comment: this.with_comment,
    }
  }
}

export class OrderReview implements BaseModel {
  id: string | undefined
  order: Order | string | null
  rating: number
  comment: string | null
  createdAt: string | null
  constructor(raw: OrderReviewRaw) {
    this.id = raw.uuid || undefined
    this.order = raw.order
      ? typeof raw.order === 'string'
        ? raw.order
        : new Order(raw.order)
      : null
    this.rating = raw.rating || 0
    this.comment = raw.comment || null
    this.createdAt = moment
      .utc(raw.created_at, 'YYYY-MM-DD HH:mm:ss')
      .local()
      .format('DD.MM.YYYY HH:mm')
  }

  toJson(): Record<string, any> {
    return {
      order: typeof this.order === 'string' ? this.order : this.order?.id,
      rating: this.rating,
      comment: this.comment,
    }
  }
}

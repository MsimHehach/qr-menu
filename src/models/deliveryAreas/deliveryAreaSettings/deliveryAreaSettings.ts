import moment from 'moment'
import { BaseModel } from 'src/corexModels/apiModels/baseModel'

export type DeliveryAreaSettingsRaw = {
  uuid?: string
  sales_point: string | undefined
  type: string
  delivery_type: string
  delivery_area: string | null | undefined
  minimal_order_sum: number
  weekdays: number[]
  start_time: string
  end_time: string
  delivery_price: number
  delivery_duration: number
}

export class DeliveryAreaSettings implements BaseModel {
  id: string | undefined
  salesPoint: string | undefined
  type: string
  deliveryType: string
  deliveryArea: string | null | undefined
  minimalOrderSum: number
  weekdays: number[]
  startTime: string
  endTime: string
  deliveryPrice: number
  deliveryDuration: number
  created?: boolean
  updated?: boolean

  constructor(raw: DeliveryAreaSettingsRaw) {
    this.id = raw.uuid || undefined
    this.salesPoint = raw.sales_point
    this.type = raw.type
    this.deliveryType = raw.delivery_type
    this.deliveryArea = raw.delivery_area
    this.minimalOrderSum = raw.minimal_order_sum
    this.weekdays = raw.weekdays
    this.startTime = moment
      .utc(raw.start_time, 'HH:mm:ss')
      .local()
      .format('HH:mm')
    this.endTime = moment.utc(raw.end_time, 'HH:mm:ss').local().format('HH:mm')
    this.deliveryPrice = raw.delivery_price
    this.deliveryDuration = raw.delivery_duration
  }

  toJson(): Record<string, any> {
    return {
      uuid: this.id,
      sales_point: this.salesPoint,
      type: this.type,
      delivery_type: this.deliveryType,
      delivery_area: this.deliveryArea,
      minimal_order_sum: this.minimalOrderSum,
      weekdays: this.weekdays,
      start_time: moment(this.startTime, 'HH:mm').utc().format('HH:mm:ss'),
      end_time: moment(this.endTime, 'HH:mm').utc().format('HH:mm:ss'),
      delivery_price: this.deliveryPrice,
      delivery_duration: this.deliveryDuration,
    }
  }
}

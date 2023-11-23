import { Menu, MenuRaw } from './../menu/menu'
import { AvailablePaymentType, PaymentSettings, SalesPoint } from './salesPoint'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { salesPointApi } from './salesPointApi'
import { reactive } from 'vue'
import { Schedule, ScheduleDay, ScheduleRaw } from './schedule/schedule'
import { Image, ImageRaw } from '../image/image'

export class SalesPointRepo extends BaseRepo<SalesPoint> {
  api = salesPointApi
  menuLoading = false

  paymentTypes: AvailablePaymentType[] = []

  async status(sales_point?: string): Promise<boolean> {
    const res: {
      sales_point: {
        order_creation_available: boolean
      }
    } = await this.api.send({
      method: 'GET',
      action: 'status',
      id: sales_point,
    })

    return res.sales_point.order_creation_available
  }

  async getExternalPaymentTypes() {
    const res: {
      results: AvailablePaymentType[]
    } = await this.api.send({
      method: 'GET',
      action: 'external_payment_types',
      id: this.item?.id,
    })

    this.paymentTypes = res.results
    return res.results
  }

  async setPaymentSettings(data: PaymentSettings) {
    // const res =
    await this.api.send({
      method: 'POST',
      action: 'set_payment_settings',
      id: this.item?.id,
      data,
    })

    // this.paymentTypes = res.result
    // return res.result
  }
  async setSchedule(data: ScheduleDay[]): Promise<Schedule> {
    const res: ScheduleRaw = await this.api.send({
      method: 'POST',
      action: 'set_schedule',
      id: this.item?.id,
      data: {
        days: data.map((v) => v.toJson()),
      },
    })
    return new Schedule(res)
  }

  async addImage(image: File, isMain = false): Promise<ImageRaw> {
    const data = new FormData()
    data.append('image', image)
    data.append('main_image', String(isMain))

    return await this.api.send({
      method: 'POST',
      action: 'add_image',
      id: this.item?.id,
      data,
    })
  }

  async deleteImage(image: Image): Promise<ImageRaw> {
    return await this.api.send({
      method: 'POST',
      action: 'delete_image',
      id: this.item?.id,
      data: { image: image.id },
    })
  }

  async getMenu(id: string): Promise<Menu> {
    this.menuLoading = true
    const res: MenuRaw = await this.api.send({
      method: 'GET',
      action: 'menu',
      id,
    })
    this.menuLoading = false
    return new Menu(res)
  }
}

export const salesPointRepo = reactive(new SalesPointRepo())

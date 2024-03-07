import { Order, OrderRaw, OrdersFilter } from './order'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { orderApi } from './orderApi'
import { reactive } from 'vue'
import { Pad } from '../pads/pad'

export class OrderRepo extends BaseRepo<Order> {
  api = orderApi
  filters: OrdersFilter = new OrdersFilter()

  async current(pad: Pad): Promise<Order[]> {
    const res: {
      results: OrderRaw[]
    } = await this.api.send({
      method: 'GET',
      action: 'current',
      params: {
        sales_point: pad.salesPoint?.id,
        pad: pad.id,
      },
    })
    if (res.results[0]) this.item = new Order(res.results[0])
    return res.results.map((v) => new Order(v))
  }

  async applyPayments(data: Record<string, any>) {
    const res: OrderRaw = await this.api.send({
      method: 'POST',
      action: 'apply_payments',
      id: this.item?.id,
      data,
    })
    return new Order(res)
  }
}

export const orderRepo = reactive(new OrderRepo())

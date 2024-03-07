import { CartItem } from './cartItem/cartItem'
import { OrderRaw, Order } from './../order/order'
import { Cart, CartParams, CartRaw, AvailableHours } from './cart'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { cartApi } from './cartApi'
import { reactive } from 'vue'
import { Pad } from '../pads/pad'

export class CartRepo extends BaseRepo<Cart> {
  api = cartApi
  loading = false
  setParamsLoading = false
  arrangeLoading = false
  promocodeError = false

  isItemInCart(id: string): CartItem | undefined {
    return this.item
      ? this.item?.cartItems
          .filter((el) => !el.attachedTo)
          .find((v) => v.size.menu_item === id)
      : undefined
  }

  async setParams(data: CartParams) {
    this.setParamsLoading = true
    if (!data.sales_point && this.item?.salesPoint?.id) {
      data.sales_point = this.item.salesPoint.id
    }
    const res: CartRaw = await this.api.send({
      method: 'PUT',
      action: 'set_params',
      data: { ...data },
    })
    this.setParamsLoading = false
    this.item = new Cart(res)
    return this.item
  }

  getRelatedItems(v: CartItem) {
    return this.item?.cartItems.filter((el) => el.attachedTo === v.id)
  }

  isInCart(uuid?: string) {
    if (!uuid || !this.item) return false
    return this.item.cartItems.map((v) => v.size.uuid).includes(uuid)
  }

  async current(sales_point?: string, pad?: Pad) {
    this.loading = true
    const city = localStorage.getItem('city')
    try {
      const res: CartRaw = await this.api.send({
        method: 'GET',
        action: 'current',
        params: {
          sales_point,
          pad: pad?.id,
          city,
        },
      })
      this.item = new Cart(res)
    } catch {
      this.item = null
    }
    this.loading = false
    return this.item
  }

  async getAvailableHours(salesPointId?: string): Promise<AvailableHours> {
    const res: AvailableHours = await this.api.send({
      method: 'GET',
      action: 'get_available_hours',
      params: {
        sales_point: salesPointId,
      },
    })
    return res
  }

  async arrange(data: Record<string, any>): Promise<Order> {
    this.arrangeLoading = true
    const res: OrderRaw = await this.api.send({
      method: 'POST',
      action: 'arrange',
      data,
    })
    this.arrangeLoading = false
    return new Order(res)
  }

  async clear() {
    const res: CartRaw = await this.api.send({
      method: 'PUT',
      action: `${this.item?.id}/clear`,
    })
    return new Cart(res)
  }
}

export const cartRepo = reactive(new CartRepo())

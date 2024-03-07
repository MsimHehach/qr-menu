import { Notify } from 'quasar'
import { waiterCallRepo } from './../customer/waiterCall/waiterCallRepo'
import {
  WaiterCallRaw,
  WaiterCall,
} from 'src/models/customer/waiterCall/waiterCall'
import { orderRepo } from './../order/orderRepo'
import { Customer, CustomerRaw } from './../customer/customer'
import { authentication } from './../authentication/authentication'
import { cartRepo } from './../carts/cartRepo'
import { Cart, CartRaw } from 'src/models/carts/cart'
import { Order, OrderRaw } from '../order/order'
export type WebSocketMessage = {
  type:
    | 'cart.updated'
    | 'user.updated'
    | 'order.updated'
    | 'waiter_call.updated'
  data: any
}

export const handleMessage = (v: MessageEvent<string>) => {
  const response = JSON.parse(v.data) as WebSocketMessage
  if (response.type === 'cart.updated') {
    cartRepo.item = new Cart(response.data as CartRaw)
    cartRepo.item.errors.forEach((error) => {
      if (error.title === 'Промокод') {
        cartRepo.promocodeError = true
      } else
        Notify.create({
          message: error.description || undefined,
          color: 'danger',
        })
    })
    cartRepo.loading = false
  }
  if (response.type === 'user.updated') {
    authentication.user = new Customer(response.data as CustomerRaw)
  }
  if (response.type === 'order.updated') {
    orderRepo.item = new Order(response.data as OrderRaw)
  }
  if (response.type === 'waiter_call.updated') {
    waiterCallRepo.item = new WaiterCall(response.data as WaiterCallRaw)
  }

  return response
}

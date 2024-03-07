import { CustomerRaw, Customer } from './../customer/customer'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { reactive } from 'vue'
import { Authentication } from './auth'
import { authenticationApi } from './authApi'

export class AuthenticationRepo extends BaseRepo<Authentication> {
  api = authenticationApi
  // availableCustomers: Customer[] = []
  // currentUser: Customer = this.availableCustomers[0]

  async register(data?: Record<string, any>) {
    const result: CustomerRaw = await this.api.send({
      action: 'register',
      method: 'POST',
      data,
    })
    return new Customer(result)
  }
}

export const authRepo = reactive(new AuthenticationRepo())

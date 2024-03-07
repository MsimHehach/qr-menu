import { Customer, CustomersFilters, WalletRaw } from './customer'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { customerApi } from './customerApi'
import { reactive } from 'vue'

export class CustomerRepo extends BaseRepo<Customer> {
  api = customerApi
  filters: CustomersFilters = {}

  async updateBalance(
    walletUuid: string,
    quantity: number,
    comment?: string
  ): Promise<WalletRaw> {
    return await this.api.updateBalance(walletUuid, quantity, comment)
  }

  async deleteCustomer() {
    return await this.api.send({
      method: 'DELETE',
      action: 'delete_customer',
    })
  }

  async setDeviceMeta(
    customerId: string | undefined,
    data: Record<string, any>
  ) {
    return await this.api.send({
      method: 'POST',
      action: 'set_device_meta',
      id: customerId,
      data,
    })
  }

  async setOnline(mac: string) {
    return await this.api.send({
      method: 'POST',
      action: 'set_online',
      data: {
        mac,
      },
    })
  }
}

export const customerRepo = reactive(new CustomerRepo())

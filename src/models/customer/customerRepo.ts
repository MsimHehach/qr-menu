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
}

export const customerRepo = reactive(new CustomerRepo())

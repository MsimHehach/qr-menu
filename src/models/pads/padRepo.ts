import { Pad, PadRaw } from './pad'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { padApi } from './padApi'
import { reactive } from 'vue'
import { SalesPoint } from '../salesPoint/salesPoint'
import { Company } from '../company/company'

export class PadRepo extends BaseRepo<Pad> {
  api = padApi
  search: string | null = null
  filters: {
    sales_point: SalesPoint | null
    active: boolean | null
    company: Company | null
  } = {
    sales_point: null,
    active: null,
    company: null,
  }

  async detach(): Promise<Pad> {
    const res: PadRaw = await this.api.send({
      method: 'POST',
      action: 'detach',
      id: this.item?.id,
    })

    return new Pad(res)
  }

  async synchronizeData() {
    const res: boolean = await this.api.send({
      method: 'POST',
      action: 'synchronize_data',
    })

    return res
  }
}

export const padRepo = reactive(new PadRepo())

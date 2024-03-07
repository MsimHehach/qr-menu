import { WaiterCall, WaiterCallStatus } from './waiterCall'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { waiterCallApi } from './waiterCallApi'
import { reactive } from 'vue'

export class WaiterCallRepo extends BaseRepo<WaiterCall> {
  api = waiterCallApi

  async setStatus(id: string, status: WaiterCallStatus) {
    return await this.api.send({
      method: 'POST',
      action: 'set_status',
      id,
      data: {
        status,
      },
    })
  }
}

export const waiterCallRepo = reactive(new WaiterCallRepo())

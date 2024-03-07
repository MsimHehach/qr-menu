import { DeliveryArea, DeliveryAreaRaw } from './deliveryArea'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { deliveryAreaApi } from './deliveryAreaApi'
import { reactive } from 'vue'

export class DeliveryAreaRepo extends BaseRepo<DeliveryArea> {
  api = deliveryAreaApi

  async byCoords(coords: number[]) {
    const res: { delivery_area: DeliveryAreaRaw[] } = await this.api.send({
      method: 'POST',
      action: 'by_coords',
      data: { coords },
    })
    return res.delivery_area.map((v) => new DeliveryArea(v))
  }
}

export const deliveryAreaRepo = reactive(new DeliveryAreaRepo())

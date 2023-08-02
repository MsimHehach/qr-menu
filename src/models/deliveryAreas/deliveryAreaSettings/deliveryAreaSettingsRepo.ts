import { DeliveryAreaSettings } from './deliveryAreaSettings'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { deliveryAreaSettingsApi } from './deliveryAreaSettingsApi'
import { reactive } from 'vue'

export class DeliveryAreaSettingsRepo extends BaseRepo<DeliveryAreaSettings> {
  api = deliveryAreaSettingsApi
  // pickupSettings: DeliveryAreaSettings[] = []
  // defaultSettings: DeliveryAreaSettings[] = []
}

export const deliveryAreaSettingsRepo = reactive(new DeliveryAreaSettingsRepo())

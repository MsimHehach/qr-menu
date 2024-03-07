import { SalesPoint } from 'src/models/salesPoint/salesPoint'
import { DeliveryAreaSettings } from 'src/models/deliveryAreas/deliveryAreaSettings/deliveryAreaSettings'
import { DeliveryArea } from 'src/models/deliveryAreas/deliveryArea'
import { Schedule } from 'src/models/salesPoint/schedule/schedule'

export type SalesPointDeliveryData = {
  salesPoint: SalesPoint
  deliveryAreaSettings: DeliveryAreaSettings[]
  defaultDeliveryAreaSettings: DeliveryAreaSettings[]
  deliveryArea: DeliveryArea
  pickupSchedule?: Schedule
}

export type SalesPointPickupData = {
  salesPoint: SalesPoint
}

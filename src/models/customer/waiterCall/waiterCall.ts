import { BaseModel } from 'src/corexModels/apiModels/baseModel'
import { SalesPointRaw } from 'src/models/salesPoint/salesPoint'
import { TableRaw } from 'src/models/sections/tables/table'
import { CustomerRaw } from '../customer'

export enum WaiterCallStatus {
  CREATED = 'created',
  ACCEPTED = 'accepted',
  WAITING = 'waiting',
  DECLINED = 'declined',
  CLOSED = 'closed',
}

export const waiterCallStatusTypeNames = {
  [WaiterCallStatus.CREATED]: 'Создан',
  [WaiterCallStatus.ACCEPTED]: 'Принят',
  [WaiterCallStatus.WAITING]: 'Ожидает',
  [WaiterCallStatus.DECLINED]: 'Отменен',
  [WaiterCallStatus.CLOSED]: 'Закрыт',
}

export type WaiterCallRaw = {
  uuid?: string
  status?: WaiterCallStatus
  waiters?: CustomerRaw[]
  sales_point: SalesPointRaw | string | null
  pad: string | null
  tables?: TableRaw[]
  accepted_at?: string | null
  closed_at?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export class WaiterCall implements BaseModel {
  id: string | undefined
  status: WaiterCallStatus
  waiters: CustomerRaw[]
  salesPoint: SalesPointRaw | string | null
  pad: string | null
  tables: TableRaw[]
  acceptedAt: string | null
  closedAt: string | null
  createdAt: string | null
  updatedAt: string | null
  constructor(raw: WaiterCallRaw) {
    this.id = raw.uuid
    this.status = raw.status || WaiterCallStatus.CREATED
    this.waiters = raw.waiters || []
    this.salesPoint = raw.sales_point
    this.pad = raw.pad
    this.tables = raw.tables || []
    this.acceptedAt = raw.accepted_at || null
    this.closedAt = raw.closed_at || null
    this.createdAt = raw.created_at || null
    this.updatedAt = raw.updated_at || null
  }

  toJson(): Record<string, any> {
    return {
      sales_point:
        typeof this.salesPoint === 'string'
          ? this.salesPoint
          : this.salesPoint?.uuid,
      pad: this.pad,
    }
  }
}

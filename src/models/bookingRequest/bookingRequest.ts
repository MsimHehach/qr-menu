import moment from 'moment'
import { BaseModel } from 'src/corexModels/apiModels/baseModel'
import { Table, TableRaw } from '../sections/tables/table'

export type BookingRequestFilters = {
  search: string | null
  status: string | null
}

export enum BookingStatus {
  CREATED = 'created',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  GUEST_IN = 'guest_in',
  GUEST_OUT = 'guest_out',
  CLOSED = 'closed',
}

export type BookingRequestRaw = {
  uuid?: string
  active: boolean
  customer: string | null
  customer_phone?: string | null
  customer_name: string | null
  sales_point: string | null
  tables: TableRaw[]
  comment?: string | null
  service_comment?: string | null
  status?: BookingStatus
  guests_count?: string | null
  date?: string | null
  start_date?: string | null
  end_date?: string | null
}

export class BookingRequest implements BaseModel {
  id: string
  active: boolean
  customer: string | null
  customerPhone: string | null
  customerName: string | null
  salesPoint: string | null
  tables: Table[]
  comment: string | null
  serviceComment: string | null
  status: BookingStatus | null
  guestsCount: string | null
  date: string | null
  startDate: string | null
  endDate: string | null

  constructor(raw: BookingRequestRaw) {
    this.id = raw.uuid || ''
    this.active = raw.active
    this.customer = raw.customer
    this.customerPhone = raw.customer_phone || null
    this.customerName = raw.customer_name
    this.salesPoint = raw.sales_point || null
    this.tables = raw.tables.map((v) => new Table(v))
    this.comment = raw.comment || null
    this.serviceComment = raw.service_comment || null
    this.status = raw.status || null
    this.guestsCount = raw.guests_count || null
    this.date = raw.date
      ? moment
          .utc(raw.date, 'YYYY-MM-DD HH:mm:ss')
          .local()
          .format('DD.MM.YYYY HH:mm')
      : null
    this.startDate = raw.start_date
      ? moment
          .utc(raw.start_date, 'YYYY-MM-DD HH:mm:ss')
          .local()
          .format('DD.MM.YYYY HH:mm')
      : null
    this.endDate = raw.end_date
      ? moment
          .utc(raw.end_date, 'YYYY-MM-DD HH:mm:ss')
          .local()
          .format('DD.MM.YYYY HH:mm')
      : null
  }

  get requestStatus() {
    const status = this.status
    if (status === 'created')
      return { name: 'Создан', color: 'gray-light', textColor: 'black' }
    else if (status === 'accepted')
      return { name: 'Принят', color: 'gray-light', textColor: 'orange' }
    else if (status === 'declined')
      return { name: 'Отменен', color: 'red', textColor: 'white' }
    else if (status === 'closed')
      return { name: 'Завершен', color: 'green', textColor: 'white' }
    else if (status === 'guest_out')
      return { name: 'Гость вышел', color: 'orange', textColor: 'white' }
    else if (status === 'guest_in')
      return { name: 'Гость вошел', color: 'yellow', textColor: 'black' }
    else return { name: 'Готово', color: 'primary', textColor: 'white' }
  }

  toJson(): Record<string, any> {
    return {
      sales_point: this.salesPoint,
      date: this.date
        ? moment(this.date, 'YYYY-MM-DD HH:mm')
            .utc()
            .format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      start_date: this.startDate
        ? moment(this.startDate, 'DD.MM.YYYY HH:mm')
            .utc()
            .format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      end_date: this.endDate
        ? moment(this.endDate, 'DD.MM.YYYY HH:mm')
            .utc()
            .format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      status: this.status,
      service_comment: this.serviceComment?.length
        ? this.serviceComment
        : undefined,
      comment: this.comment?.length ? this.comment : undefined,
      customer_name: this.customerName,
      customer: this.customer || undefined,
      customer_phone: this.customerPhone,
      guests_count: this.guestsCount,
      tables: this.tables.map((v) => v.id),
    }
  }
}

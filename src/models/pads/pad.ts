import { BaseModel } from 'src/corexModels/apiModels/baseModel'
import { Company, CompanyRaw } from '../company/company'
import { SalesPointRaw, SalesPoint } from '../salesPoint/salesPoint'
import { Section, SectionRaw } from '../sections/section'
import { Table, TableRaw } from '../sections/tables/table'

export type PadRaw = {
  uuid?: string
  name: string | null
  sales_point: SalesPointRaw | null
  company: CompanyRaw | null
  company_group: string
  tables?: TableRaw[]
  settings: {
    uuid: string | null
    orders_enabled: boolean
  }
  active: boolean
  device_id: string
  is_enabled: boolean
  created_at: string
  updated_at: string | null
  is_registered: boolean
  section?: SectionRaw | null
}

export class Pad implements BaseModel {
  id: string | undefined
  name: string | null
  salesPoint: SalesPoint | null
  company: Company | null
  companyGroup: string
  tables: Table[]
  settings: {
    uuid: string | null
    orders_enabled: boolean
  }
  active: boolean
  deviceId: string
  isEnabled: boolean
  createdAt: string
  updatedAt: string | null
  isRegistered: boolean
  section: Section | null

  constructor(raw: PadRaw) {
    this.id = raw.uuid
    this.name = raw.name
    this.salesPoint = raw.sales_point ? new SalesPoint(raw.sales_point) : null
    this.company = raw.company ? new Company(raw.company) : null
    this.companyGroup = raw.company_group
    this.tables = raw.tables ? raw.tables.map((v) => new Table(v)) : []
    this.settings = raw.settings
    this.active = raw.active
    this.deviceId = raw.device_id
    this.isEnabled = raw.is_enabled
    this.createdAt = raw.created_at
    this.updatedAt = raw.updated_at
    this.isRegistered = raw.is_registered
    this.section = raw.section ? new Section(raw.section) : null
  }

  toJson(): Record<string, any> {
    return {
      name: this.name,
      tables: this.tables.map((v) => v.id),
      company: this.company?.id,
      sales_point: this.salesPoint?.id,
      active: this.active,
      section: this.section?.id,
      settings: {
        orders_enabled: this.settings.orders_enabled,
      },
    }
  }
}

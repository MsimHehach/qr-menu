import { SalesPointRaw } from './../salesPoint/salesPoint'
import { Company, CompanyRaw } from './../company/company'
import { BaseModel } from 'src/corexModels/apiModels/baseModel'
import { Contact } from '../types'
import { store } from '../store'

export enum BankType {
  SBER = 'sber',
  ALPHA = 'alpha',
  ALPHA_V2 = 'alpha_v2',
  CLOUDPAYMENTS = 'cloudpayments',
  PAYSELECTION = 'payselection',
  YOOKASSA = 'yookassa',
  PAYONLINE = 'payonline',
}

export type LegalEntityRaw = {
  uuid: string
  code: number | string | null
  registration_code: string | number | null
  state_registration_number: string | number | null
  legal_address: string | null
  contact_phone: string | null
  contact_email: string | null
  name: string
  company_group: string
  active: boolean
  sales_points: {
    uuid: string
    name: string
    code: string | null
    settings: {
      delivery_enabled: boolean
      pickup_enabled: boolean
      table_orders_enabled: boolean
      booking_enabled: boolean
      cart_enabled: boolean
      promo_codes: string | null
    }
    payment_settings: {
      cash_enabled: boolean
      card_enabled: boolean
      online_payment_enabled: boolean
      bonus_using_enabled: boolean
      payment_types_mapping: {
        bonus: string
        cash: string
        card: string
        online: string
      }
      update_on_parent_change: boolean
    }
    external_id: string
    address: string
    custom_address: string
    coords: {
      latitude: number
      longitude: number
    }
    company: {
      uuid: string
      name: string
      code: string | number | null
      external_id: string | number | null
      company_group: string
      visible: boolean
      description: string | null
    }
    company_group: string
    contacts: {
      uuid: string
      active: boolean
      emails: string[]
      contact_phone: number | null
    }
    active: boolean
    visible: boolean
  }[]
}

export type CompanyGroupAppSettings = {
  uuid: string
  app_enabled: boolean
  company_group: string
  android_build_version: number
  ios_build_version: number
  android_download_link: string | null
  ios_download_link: string | null
  app_redirect_link: string | null
  created_at: string | null
  updated_at: string | null
}

export type TermsOfServiceInfo = {
  sales_points: SalesPointRaw[]
  //  {
  //   uuid: string
  //   name: string
  //   code: string | null
  //   external_id: string
  //   address: string
  //   custom_address: string

  //   settings: {
  //     delivery_enabled: boolean
  //     pickup_enabled: boolean
  //     table_orders_enabled: boolean
  //     booking_enabled: boolean
  //     cart_enabled: boolean
  //     promo_codes: string | null
  //   }
  //   payment_settings: {
  //     cash_enabled: boolean
  //     card_enabled: boolean
  //     online_payment_enabled: boolean
  //     bonus_using_enabled: boolean
  //     payment_types_mapping: {
  //       bonus: string
  //       cash: string
  //       card: string
  //       online: string
  //     }
  //     update_on_parent_change: boolean
  //   }
  //   coords: {
  //     latitude: number
  //     longitude: number
  //   }
  //   company: string
  //   company_group: string
  //   contacts: {
  //     uuid: string
  //     active: boolean
  //     emails: string[]
  //     contact_phone: number | null
  //   }
  //   active: boolean
  //   visible: boolean
  // }[]
  legal_entities: LegalEntityRaw[]
  bank: {
    uuid: string | null
    bank: string | null
    default: boolean
    production: boolean
    legal_entity: string | null
    payment_services: {
      apple_pay_enabled: boolean
      apple_pay: string
      google_pay_enabled: boolean
      google_pay: string
      sbp_enabled: boolean
      save_cards_enabled: boolean
    }
  } | null
}

export type CompanyGroupRaw = {
  uuid: string | undefined
  name: string | null
  production: boolean
  external_id: string
  enable_order_sending: boolean
  companies: CompanyRaw[]
  contacts: Contact
}

export class CompanyGroup implements BaseModel {
  id: string
  name: string | null
  production: boolean
  externalId: string
  enableOrderSending: boolean
  companies: Company[]
  contacts: Contact

  constructor(raw: CompanyGroupRaw) {
    this.id = raw.uuid || ''
    this.name = raw.name
    this.production = raw.production
    this.externalId = raw.external_id
    this.enableOrderSending = raw.enable_order_sending
    this.companies = raw.companies
      ? raw.companies.map((v) => new Company(v))
      : []
    this.contacts = raw.contacts
  }

  get currentCompany() {
    return this.companies.find((v) => v.id === store.institution)
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
    }
  }
}

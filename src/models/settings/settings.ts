import { BaseModel } from 'src/corexModels/apiModels/baseModel'

export enum FirstOrderType {
  PERCENT = '1',
  FIXED = '2',
  ORDER_SUM = '3',
}

export const firstOrderTypeNames = {
  [FirstOrderType.PERCENT]: 'Процент',
  [FirstOrderType.ORDER_SUM]: 'Сумма заказа',
  [FirstOrderType.FIXED]: 'Фиксированная сумма',
}

export const firstOrderTypes = Object.keys(firstOrderTypeNames).map((el) => {
  const key = el as FirstOrderType
  return { label: firstOrderTypeNames[key] as FirstOrderType, value: key }
})

export type RequiredFieldRaw = {
  required: boolean
  hidden: boolean
}

export type SettingsRaw = {
  company_group?: string
  required_fields_settings: {
    last_name: RequiredFieldRaw
    first_name: RequiredFieldRaw
    email: RequiredFieldRaw
    birthday: RequiredFieldRaw
    sex: RequiredFieldRaw
  }
  accrual_settings: {
    for_first_order_type: FirstOrderType
    for_first_order: number
    for_birthday: number
    for_complete_user_information: number
    for_referral: number
  }
  notification_settings: {
    birthday_push_settings: {
      message: string | null
      title: string | null
      should_be_sent_before: number
    }
    order_review_push_settings: {
      message: string | null
      send_interval_after_order: number | null
      title: string | null
    }
    push_settings: {
      send_birthday_pushes: boolean
      send_order_review_push: boolean
      send_for_order_created: true
      send_for_order_validated: true
      send_for_order_accepted: true
      send_for_order_declined: true
      send_for_order_closed: true
      send_for_order_on_way: true
      send_for_order_cooking: true
      send_for_order_ready: true
      send_for_order_delivery_time_changed: true
      send_for_balance_updated: true
      send_for_news_published: true
    }
  }
}

export class Settings implements BaseModel {
  id: undefined
  company_group?: string
  requiredFieldsSettings: SettingsRaw['required_fields_settings']
  accrual_settings: {
    for_first_order_type: FirstOrderType
    for_first_order: number
    for_birthday: number
    for_complete_user_information: number
    for_referral: number
  }
  notificationSettings: {
    birthday_push_settings: {
      message: string | null
      title: string | null
      should_be_sent_before: number
    }
    order_review_push_settings: {
      message: string | null
      send_interval_after_order: number | null
      title: string | null
    }
    push_settings: {
      send_birthday_pushes: boolean
      send_order_review_push: boolean
      send_for_order_created: true
      send_for_order_validated: true
      send_for_order_accepted: true
      send_for_order_declined: true
      send_for_order_closed: true
      send_for_order_on_way: true
      send_for_order_cooking: true
      send_for_order_ready: true
      send_for_order_delivery_time_changed: true
      send_for_balance_updated: true
      send_for_news_published: true
    }
  }

  constructor(raw: SettingsRaw) {
    this.company_group = raw.company_group
    this.requiredFieldsSettings = {
      birthday: raw.required_fields_settings.birthday,
      email: raw.required_fields_settings.email,
      first_name: raw.required_fields_settings.first_name,
      last_name: raw.required_fields_settings.last_name,
      sex: raw.required_fields_settings.sex,
    }
    this.accrual_settings = raw.accrual_settings
    this.notificationSettings = raw.notification_settings
  }

  toJson(): Record<string, any> {
    return {
      company_group: this.company_group,
      required_fields_settings: this.requiredFieldsSettings,
      accrual_settings: this.accrual_settings,
      notification_settings: this.notificationSettings,
    }
  }
}

import { EventBusKey } from '@vueuse/core'
import { Company } from 'src/models/company/company'

export const selectCompanyKey: EventBusKey<{ company: Company }> =
  Symbol('selectCompanyKey')

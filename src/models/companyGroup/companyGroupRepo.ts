import { RequiredFieldRaw } from './../settings/settings'
import {
  CompanyGroup,
  CompanyGroupAppSettings,
  CompanyGroupRaw,
  TermsOfServiceInfo,
} from './companyGroup'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { companyGroupApi } from './companyGroupApi'
import { reactive } from 'vue'

export class CompanyGroupRepo extends BaseRepo<CompanyGroup> {
  api = companyGroupApi
  requiredFields: {
    last_name: RequiredFieldRaw
    first_name: RequiredFieldRaw
    email: RequiredFieldRaw
    birthday: RequiredFieldRaw
    sex: RequiredFieldRaw
  } | null = null

  async getTermsOfServiceInfo(header: string) {
    const res: TermsOfServiceInfo = await this.api.send({
      method: 'GET',
      action: 'terms_of_service_info',
      headers: {
        'Company-Group': header,
      },
    })

    return res
  }

  async getRequiredFieldsSettings() {
    const res: {
      last_name: RequiredFieldRaw
      first_name: RequiredFieldRaw
      email: RequiredFieldRaw
      birthday: RequiredFieldRaw
      sex: RequiredFieldRaw
    } = await this.api.send({
      method: 'GET',
      action: 'get_required_fields_settings',
    })
    this.requiredFields = res
  }

  async current() {
    const res: CompanyGroupRaw = await this.api.send({
      method: 'GET',
      action: 'current',
      params: {
        only_visible: true,
        use_cities: true,
        city: localStorage.getItem('city') || undefined,
      },
    })
    this.item = new CompanyGroup(res)
    return this.item
  }

  async getAppSettings(id: string): Promise<CompanyGroupAppSettings> {
    const res: CompanyGroupAppSettings = await this.api.send({
      method: 'GET',
      action: 'app_settings',
      id,
    })

    return res
  }
}

export const companyGroupRepo = reactive(new CompanyGroupRepo())

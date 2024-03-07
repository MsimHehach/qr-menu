import { Settings, SettingsRaw } from './settings'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { settingsApi } from './settingsApi'
import { reactive } from 'vue'
import { companyGroupRepo } from '../companyGroup/companyGroupRepo'

export class SettingsRepo extends BaseRepo<Settings> {
  api = settingsApi

  async getSettings(): Promise<Settings> {
    const res: SettingsRaw = await this.api.send({
      method: 'GET',
      action: 'get_settings',
      params: {
        company_group: companyGroupRepo.item?.id,
      },
    })
    this.item = new Settings(res)
    return new Settings(res)
  }

  async setSettings(settings: Settings): Promise<Settings> {
    const res: SettingsRaw = await this.api.send({
      method: 'POST',
      action: 'set_settings',
      data: settings?.toJson(),
    })
    this.item = new Settings(res)
    this.item.company_group = companyGroupRepo.item?.id
    return new Settings(res)
  }
}

export const settingsRepo = reactive(new SettingsRepo())

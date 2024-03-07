import { AppSettings, LinksSettingsRaw } from './appSettings'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { appSettingsApi } from './appSettingsApi'
import { reactive } from 'vue'

export class AppSettingsRepo extends BaseRepo<AppSettings> {
  api = appSettingsApi
  linksData: LinksSettingsRaw | null = null

  async getLinksSettings(header?: string) {
    const headers = header ? { 'Company-Group': header } : undefined
    const res: LinksSettingsRaw = await this.api.send({
      method: 'GET',
      action: 'fetch',
      headers,
    })
    this.linksData = res
    return res
  }

  async saveLinksSettings(data: LinksSettingsRaw): Promise<LinksSettingsRaw> {
    return await this.api.send({
      method: 'POST',
      data: data,
    })
  }
}

export const appSettingsRepo = reactive(new AppSettingsRepo())

import { BaseModel } from 'src/corexModels/apiModels/baseModel'

export type AppSettingsRaw = {
  id: number | undefined
}

export type LinksSettingsRaw = {
  uuid: string | undefined
  app_enabled: boolean
  company_group: string | undefined
  android_build_version: number
  ios_build_version: number
  android_download_link: string
  ios_download_link: string
  app_download_link: string
}

export class AppSettings implements BaseModel {
  id: number | undefined

  constructor(raw: AppSettingsRaw) {
    this.id = raw.id
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
    }
  }
}

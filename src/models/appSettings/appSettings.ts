import { BaseModel } from 'src/corexModels/apiModels/baseModel'

export type AppSettingsRaw = {
  id: number | undefined
}

export type LinksSettingsRaw = {
  uuid: string | undefined
  app_enabled: boolean
  company_group: string | undefined
  android_build_version: number | null
  ios_build_version: number | null
  android_download_link: string | null
  ios_download_link: string | null
  app_download_link: string | null
  app_redirect_link: string | null
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

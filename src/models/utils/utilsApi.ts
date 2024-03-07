import { api } from 'boot/axios'
import { AxiosResponse } from 'axios'
import { UtilsRaw, Utils } from './utils'
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi'
import { Address } from '../types'

export class UtilsApi extends BaseModelApi<Utils> {
  routeName = 'utils'
  fromJson = (json: UtilsRaw) => new Utils(json)

  async suggest(search: string): Promise<Address[]> {
    const result: AxiosResponse<Address[]> = await api.get(
      `${this.routeName}/addresses/suggest/`,
      {
        params: {
          search,
        },
      }
    )
    return result.data
  }

  async geolocate(lat: number, lng: number): Promise<Address> {
    const result: AxiosResponse<Address> = await api.get(
      `${this.routeName}/addresses/geolocate/`,
      {
        params: {
          lat,
          lng,
        },
      }
    )
    return result.data
  }
}

export const utilsApi = new UtilsApi()

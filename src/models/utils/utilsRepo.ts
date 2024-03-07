import { Utils } from './utils'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { utilsApi } from './utilsApi'
import { reactive } from 'vue'

export class UtilsRepo extends BaseRepo<Utils> {
  api = utilsApi

  async suggestAddresses(search: string) {
    const res = await this.api.suggest(search)
    res.forEach((v) => v.coords.reverse())
    return res
  }

  async geolocate(lat: number, lng: number) {
    const res = await this.api.geolocate(lat, lng)
    return res
  }
}

export const utilsRepo = reactive(new UtilsRepo())

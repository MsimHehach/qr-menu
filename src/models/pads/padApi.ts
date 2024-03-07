import { PadRaw, Pad } from './pad'
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi'

export class PadApi extends BaseModelApi<Pad> {
  routeName = 'pads'
  fromJson = (json: PadRaw) => new Pad(json)
}

export const padApi = new PadApi()

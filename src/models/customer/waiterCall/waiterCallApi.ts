import { WaiterCallRaw, WaiterCall } from './waiterCall';
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi';

export class WaiterCallApi extends BaseModelApi<WaiterCall> {
  routeName = 'waiter_calls'
  fromJson = (json: WaiterCallRaw) => new WaiterCall(json)
}

export const waiterCallApi = new WaiterCallApi();

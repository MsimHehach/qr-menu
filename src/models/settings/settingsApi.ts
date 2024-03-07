import { SettingsRaw, Settings } from './settings';
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi';

export class SettingsApi extends BaseModelApi<Settings> {
  routeName = 'settings'
  fromJson = (json: SettingsRaw) => new Settings(json)
}

export const settingsApi = new SettingsApi();

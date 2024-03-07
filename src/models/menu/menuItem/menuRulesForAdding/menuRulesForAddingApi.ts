import { MenuRulesForAddingRaw, MenuRulesForAdding } from './menuRulesForAdding';
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi';

export class MenuRulesForAddingApi extends BaseModelApi<MenuRulesForAdding> {
  routeName = 'menu_rules_for_adding_product'
  fromJson = (json: MenuRulesForAddingRaw) => new MenuRulesForAdding(json)
}

export const menuRulesForAddingApi = new MenuRulesForAddingApi();

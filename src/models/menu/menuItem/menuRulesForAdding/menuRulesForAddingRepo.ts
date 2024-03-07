import { MenuRulesForAdding } from './menuRulesForAdding'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { menuRulesForAddingApi } from './menuRulesForAddingApi'
import { reactive } from 'vue'

export class MenuRulesForAddingRepo extends BaseRepo<MenuRulesForAdding> {
  api = menuRulesForAddingApi
}

export const menuRulesForAddingRepo = reactive(new MenuRulesForAddingRepo())

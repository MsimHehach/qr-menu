import { first } from 'lodash'
import { companyGroupRepo } from './companyGroup/companyGroupRepo'
import { companyRepo } from './company/companyRepo'
import { menuRepo } from './menu/menuRepo'
import { salesPointRepo } from './salesPoint/salesPointRepo'
import { SalesPoint } from './salesPoint/salesPoint'
import { authentication } from './authentication/authentication'
import { LocalStorage } from 'quasar'
import { reactive } from 'vue'

export class Store {
  salesPoint = 'd253cd53-044b-468d-8881-232f43715f5e'
  tableMode = false
  companyGroup = 'corex_demo'
  institution = '4a1d27e8-281e-42c5-95cc-6331a2e4cffa'
  authModal = false
  profileModal = false
  cartDrawer = false
  serviceSettingsModal = false
  selectCompanyModal = false
  verticalScroll = 0
  offersTab = 'Акции'
  externalID = 'HooDoo'
  menuItemModal = false
  images = {
    empty: 'https://mtraktor.ru/images/no-image.png',
  }

  getCompanyGroup(externalId: string) {
    // LocalStorage.getItem('Company-Group')
    const currentCompanyGroup = externalId

    // const foundAvailableCompany = authRepo.availableCustomers.find(
    //   (v) => v.companyGroup.externalId === companyGroup
    // );
    // if (foundAvailableCompany)
    //   authentication.setCompanyGroupHeader(
    //     foundAvailableCompany.companyGroup.externalId
    //   );
    if (currentCompanyGroup)
      authentication.setCompanyGroupHeader(String(currentCompanyGroup))
    else {
      // authentication.setCompanyGroupHeader(this.companyGroup)
    }
  }

  setCompanyGroup(v: string) {
    LocalStorage.set('Company-Group', v)
    authentication.setCompanyGroupHeader(v)

    window.location.reload()
  }

  async loadCatalog(point: SalesPoint | string) {
    let salesPoint: SalesPoint | null = null

    if (typeof point === 'string') {
      const res = await salesPointRepo.retrieve(point)
      salesPoint = res
    } else if (point.id) {
      const res = await salesPointRepo.retrieve(point.id)
      salesPoint = res
    }
    if (salesPoint) {
      const foundCompany = companyGroupRepo.item?.companies.find(
        (v) =>
          v.id ===
          (typeof salesPoint?.company === 'string'
            ? salesPoint.company
            : salesPoint?.company?.id)
      )

      if (foundCompany) companyRepo.item = foundCompany
      menuRepo.item = await salesPointRepo.getMenu(salesPoint.id || '')
    }
  }
}

export const beautifyNumber = (x: number, toFixed = false) => {
  if (toFixed) x = Number(x.toFixed(2))
  const parts = x.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return parts.join('.')
}

export const parseAlphaColorsFromCorrect = (str: string) => {
  if (str.length === 9) {
    const firstTwo = str.substr(1, 2)
    const res = str.charAt(0) + str.substr(3, str.length) + firstTwo
    return res
  } else return str
}

export const parseAlphaColorsToCorrect = (str: string) => {
  if (str.length === 9) {
    const lastTwo = str.substr(-2)
    const res = str.charAt(0) + lastTwo + str.substr(1, str.length - 3)
    return res
  } else return str
}

export const addHash = (v: string) => {
  if (first(v) !== '#') return '#' + v
  return v
}

export const store = reactive(new Store())

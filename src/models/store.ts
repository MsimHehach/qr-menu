import { first } from 'lodash'
import { companyGroupRepo } from './companyGroup/companyGroupRepo'
import { companyRepo } from './company/companyRepo'
import { menuRepo } from './menu/menuRepo'
import { salesPointRepo } from './salesPoint/salesPointRepo'
import { SalesPoint } from './salesPoint/salesPoint'
import { authentication } from './authentication/authentication'
import { LocalStorage } from 'quasar'
import { reactive } from 'vue'
import moment from 'moment'
import { DeliveryAreaSettings } from 'src/models/deliveryAreas/deliveryAreaSettings/deliveryAreaSettings'
import { DeliveryArea } from 'src/models/deliveryAreas/deliveryArea'

type DeliveryAreaInfoDrawerData = {
  salesPoint: SalesPoint
  deliveryAreaSettings: DeliveryAreaSettings[]
  defaultDeliveryAreaSettings: DeliveryAreaSettings[]
  deliveryArea: DeliveryArea
}

export class Store {
  footerHeight = 0
  headerHeight = 0
  salesPoint = 'd253cd53-044b-468d-8881-232f43715f5e'
  tableMode = false
  companyGroup = 'corex_demo'
  institution = '4a1d27e8-281e-42c5-95cc-6331a2e4cffa'
  authModal = false
  registrationModal = false
  profileModal = false
  cartDrawer = false
  deliveryAreaInfoDrawer = false
  deliveryAreaInfoDrawerData: DeliveryAreaInfoDrawerData | null = null
  leftDrawer = false
  bonusesModal = false
  serviceSettingsModal = false
  selectCompanyModal = false
  verticalScroll = 0
  offersTab = 'Новости'
  menuItemModal = false
  newsModal = false
  images = {
    empty: 'https://mtraktor.ru/images/no-image.png',
  }
  catalogLoading = false
  storedMenuItem: string | null = null
  citySelectorModal = false

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

  log(...v: any) {
    console.log(...v)
  }

  setCompanyGroup(v: string) {
    LocalStorage.set('Company-Group', v)
    authentication.setCompanyGroupHeader(v)
  }

  async loadCatalog(point: SalesPoint | string) {
    this.catalogLoading = true
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
    this.catalogLoading = false
  }
}

export const beautifyNumber = (x: number, toFixed = false) => {
  if (toFixed) x = Number(x.toFixed(2))
  const parts = x.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return parts.join('.')
}

export const parseAlphaColorsFromCorrect = (str: string) => {
  if (str.length === 8) {
    const firstTwo = str.substr(0, 2)
    const res = str.substr(2, str.length) + firstTwo
    return res
  } else return str
}

// export const parseAlphaColorsToCorrect = (str: string) => {
//   if (str.length === 8) {
//     const lastTwo = str.substr(-2)
//     const res = str.charAt(0) + lastTwo + str.substr(1, str.length - 3)
//     return res
//   } else return str
// }

export const addHash = (v: string) => {
  if (first(v) !== '#') return '#' + v
  return v
}

export const totalDayTimes = () => {
  return Array.from({ length: 24 }, (_, i) => i).reduce((r: string[], hour) => {
    r.push(moment({ hour, minute: 0 }).format('HH:mm'))
    r.push(moment({ hour, minute: 15 }).format('HH:mm'))
    r.push(moment({ hour, minute: 30 }).format('HH:mm'))
    r.push(moment({ hour, minute: 45 }).format('HH:mm'))

    return r
  }, [])
}

export const getTimesBetween = (start: string, end: string) => {
  const times = []
  const startHour = moment(start, 'HH:mm').format('HH')
  const startMinute = moment(start, 'HH:mm').format('mm')
  const endTime = moment(end, 'HH:mm')

  let startTime = moment(start, 'HH:mm')
  if (startMinute !== '00') {
    if (Number(startMinute) <= 15) {
      startTime = moment(`${startHour}:15`, 'HH:mm')
    } else if (Number(startMinute) <= 30) {
      startTime = moment(`${startHour}:30`, 'HH:mm')
    } else if (Number(startMinute) <= 45) {
      startTime = moment(`${startHour}:45`, 'HH:mm')
    } else {
      startTime = moment(startHour, 'HH').add(1, 'hour')
    }
  }
  while (startTime <= endTime) {
    times.push(startTime.format('HH:mm'))
    startTime.add(15, 'minutes')
  }
  return times
}

export const lightColor = (v: string, opacityValue: string) => {
  let value = v
  if (v.startsWith('#')) {
    value = v.substring(1)
  }
  if (value.length === 6) {
    return `#${value}${opacityValue}`
  } else {
    return `#${value.slice(0, 6)}${opacityValue}`
  }
}

export const store = reactive(new Store())

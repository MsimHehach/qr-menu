import { LocalStorage, useQuasar } from 'quasar'
import { store } from '../store'
import { companyGroupRepo } from '../companyGroup/companyGroupRepo'
import { uiSettingsRepo } from '../uiSettings/uiSettingsRepo'
import { cartRepo } from '../carts/cartRepo'
import { appSettingsRepo } from '../appSettings/appSettingsRepo'
import { authentication } from '../authentication/authentication'
import { newsRepo } from '../news/newsRepo'
import { NewsType } from '../news/news'
import { companyRepo } from '../company/companyRepo'
import { customerRepo } from '../customer/customerRepo'
import moment from 'moment'

export type AppManagerConfig = {
  companyGroupId?: string | null
  initMenuPage?: boolean
}

let interval: NodeJS.Timeout | null = null

export class AppManager {
  config: AppManagerConfig

  constructor(config: AppManagerConfig) {
    this.config = config
  }
  async initApp() {
    this.setScrollSettings()
    let companyGroupId = this.config.companyGroupId
    const _value = LocalStorage.getItem('Company-Group')
    if (_value && !companyGroupId) companyGroupId = String(_value)
    if (companyGroupId) store.setCompanyGroup(String(companyGroupId))
    await Promise.all([
      this.tryAuth(),
      this.getCurrentCompanyGroup(),
      uiSettingsRepo.fetchSettings(),
      appSettingsRepo.getLinksSettings(),
      companyGroupRepo.getRequiredFieldsSettings(),
    ]).then(() => {
      if (companyGroupRepo.item?.externalId !== _value) {
        LocalStorage.set('Favicon', companyGroupRepo.item?.image?.thumbnail)
        LocalStorage.set('Website-Name', companyGroupRepo.item?.name)
      }

      if (companyRepo.item?.externalId)
        store.setCompanyGroup(companyRepo.item?.externalId)
    })
    if (authentication.user) {
      void this.setDeviceMeta()
      void this.setOnline()
    }
    this.setDefaultCompany()
    if (this.config.initMenuPage) {
      await this.loadMenuPage()
    }
  }

  setScrollSettings() {
    const q = useQuasar()
    window.addEventListener('scroll', () => {
      store.verticalScroll = window.scrollY
    })
    if (q.platform.is.win) {
      const body = document.getElementsByTagName('body')
      if (body.length) body[0].classList.add('custom-scroll-bar')
    }
  }

  setDefaultCompany() {
    if (companyGroupRepo.item) {
      if (
        companyGroupRepo.item &&
        companyGroupRepo.item?.companies.length > 1
      ) {
      } else {
        companyRepo.item = companyGroupRepo.item.companies[0]
        companyRepo.cartCompany = companyGroupRepo.item.companies[0]
      }
    }
  }

  async tryAuth() {
    try {
      await authentication.validateTokens()
      await authentication.me()
    } catch {}
  }

  async setDeviceMeta() {
    if (!authentication.user) return
    await customerRepo.setDeviceMeta(authentication.user?.id, {
      device_id: 1,
      app_build_version: 1,
      app_version: 1,
      device_name: window.navigator.userAgent,
      system: 3,
      mac: window.navigator.userAgent,
      timezone: `${moment().format('Z')} ${
        Intl.DateTimeFormat().resolvedOptions().timeZone
      }`,
    })
  }

  async setOnline() {
    if (interval) clearInterval(interval)
    else void customerRepo.setOnline(window.navigator.userAgent)

    interval = setInterval(() => {
      void customerRepo.setOnline(window.navigator.userAgent)
    }, 30000)
  }

  getCurrentCompanyGroup = async () => {
    try {
      await companyGroupRepo.current()
    } catch {
      authentication.tokens = new authentication.tokensClass(null, null)
      authentication.setApiHeader()
      localStorage.setItem('access', '')
      localStorage.setItem('refresh', '')
    }
  }

  async loadMenuPage() {
    let currentPoint = cartRepo.item
      ? cartRepo.item?.salesPoint
      : companyGroupRepo.item?.companies[0]?.salesPoints &&
        companyGroupRepo.item?.companies[0]?.salesPoints.length
      ? companyGroupRepo.item?.companies[0]?.salesPoints[0]
      : null
    if (authentication.user) await cartRepo.current()
    if (cartRepo.item) currentPoint = cartRepo.item.salesPoint
    if (currentPoint) void store.loadCatalog(currentPoint)

    if (!newsRepo.news.length) {
      void newsRepo
        .list({
          company_group: companyGroupRepo.item?.id,
          active: true,
          type: NewsType.DEFAULT,
        })
        .then((res) => {
          newsRepo.news = res.items
        })
    }
    if (!newsRepo.promotions.length) {
      void newsRepo
        .list({
          company_group: companyGroupRepo.item?.id,
          active: true,
          type: NewsType.PROMOTION,
        })
        .then((res) => {
          newsRepo.promotions = res.items
        })
    }
    if (authentication.user?.registeredAt === null) {
      store.registrationModal = true
    }
  }
}

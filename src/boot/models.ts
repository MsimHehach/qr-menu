import { menuRulesForAddingRepo } from './../models/menu/menuItem/menuRulesForAdding/menuRulesForAddingRepo'
import {
  OrderReviewRepo,
  orderReviewRepo,
} from './../models/order/orderReview/orderReviewRepo'
import {
  WaiterCallRepo,
  waiterCallRepo,
} from './../models/customer/waiterCall/waiterCallRepo'
import { PadRepo, padRepo } from './../models/pads/padRepo'
import { customerRepo, CustomerRepo } from './../models/customer/customerRepo'
import {
  AppSettingsRepo,
  appSettingsRepo,
} from 'src/models/appSettings/appSettingsRepo'
import { CompanyRepo, companyRepo } from './../models/company/companyRepo'
import {
  PaymentCardRepo,
  paymentCardRepo,
} from './../models/customer/paymentCards/paymentCardRepo'
import { OrderRepo, orderRepo } from './../models/order/orderRepo'
import {
  SalesPointRepo,
  salesPointRepo,
} from './../models/salesPoint/salesPointRepo'
import { SectionRepo, sectionRepo } from './../models/sections/sectionRepo'
import {
  CartItemRepo,
  cartItemRepo,
} from './../models/carts/cartItem/cartItemRepo'
import {
  MenuItemRepo,
  menuItemRepo,
} from './../models/menu/menuItem/menuItemRepo'
import {
  MenuGroupRepo,
  menuGroupRepo,
} from './../models/menu/menuGroups/menuGroupRepo'
import { CartRepo, cartRepo } from './../models/carts/cartRepo'
import {
  DeliveryAreaRepo,
  deliveryAreaRepo,
} from './../models/deliveryAreas/deliveryAreaRepo'
import { promotionsRepo } from './../models/promotion/promotionsRepo'
import { NewsRepo, newsRepo } from './../models/news/newsRepo'
import {
  CompanyGroupRepo,
  companyGroupRepo,
} from './../models/companyGroup/companyGroupRepo'
import {
  DeliveryAddressRepo,
  deliveryAddressRepo,
} from './../models/customer/deliveryAddress/deliveryAddressRepo'
import {
  uiSettingsRepo,
  UiSettingsRepo,
} from './../models/uiSettings/uiSettingsRepo'
import { menuRepo, MenuRepo } from './../models/menu/menuRepo'
import { store, Store } from 'src/models/store'
import { boot } from 'quasar/wrappers'
import { PromotionsRepo } from 'src/models/promotion/promotionsRepo'
import { MenuRulesForAddingRepo } from 'src/models/menu/menuItem/menuRulesForAdding/menuRulesForAddingRepo'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store
    $menu: MenuRepo
    $uiSettings: UiSettingsRepo
    $deliveryAddress: DeliveryAddressRepo
    $deliveryArea: DeliveryAreaRepo
    $cart: CartRepo
    $companyGroup: CompanyGroupRepo
    $news: NewsRepo
    $menuGroup: MenuGroupRepo
    $promotion: PromotionsRepo
    $menuItem: MenuItemRepo
    $cartItem: CartItemRepo
    $section: SectionRepo
    $salesPoint: SalesPointRepo
    $order: OrderRepo
    $paymentCard: PaymentCardRepo
    $company: CompanyRepo
    $appSettings: AppSettingsRepo
    $customer: CustomerRepo
    $pad: PadRepo
    $waiterCall: WaiterCallRepo
    $orderReview: OrderReviewRepo
    $menuRulesForAdding: MenuRulesForAddingRepo
  }
}

export default boot(({ app }) => {
  app.config.globalProperties.$store = store
  app.config.globalProperties.$menu = menuRepo
  app.config.globalProperties.$uiSettings = uiSettingsRepo
  app.config.globalProperties.$deliveryAddress = deliveryAddressRepo
  app.config.globalProperties.$deliveryArea = deliveryAreaRepo
  app.config.globalProperties.$cart = cartRepo
  app.config.globalProperties.$menuGroup = menuGroupRepo
  app.config.globalProperties.$companyGroup = companyGroupRepo
  app.config.globalProperties.$news = newsRepo
  app.config.globalProperties.$promotion = promotionsRepo
  app.config.globalProperties.$menuItem = menuItemRepo
  app.config.globalProperties.$cartItem = cartItemRepo
  app.config.globalProperties.$section = sectionRepo
  app.config.globalProperties.$salesPoint = salesPointRepo
  app.config.globalProperties.$order = orderRepo
  app.config.globalProperties.$paymentCard = paymentCardRepo
  app.config.globalProperties.$company = companyRepo
  app.config.globalProperties.$appSettings = appSettingsRepo
  app.config.globalProperties.$customer = customerRepo
  app.config.globalProperties.$pad = padRepo
  app.config.globalProperties.$waiterCall = waiterCallRepo
  app.config.globalProperties.$orderReview = orderReviewRepo
  app.config.globalProperties.$menuRulesForAdding = menuRulesForAddingRepo
})

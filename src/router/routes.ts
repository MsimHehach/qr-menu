import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/successful_payment',
    name: 'successfulPaymentPage',
    component: () => import('src/pages/SuccessfulPayment.vue'),
  },
  {
    path: '/:companyGroup/',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('src/pages/home/Home.vue'),
      },
      {
        path: 'profile',
        name: 'profilePage',
        children: [
          {
            path: 'data',
            name: 'profileData',
            component: () => import('src/pages/profile/ProfileData.vue'),
          },
          {
            path: 'orders',
            name: 'ordersHistory',
            component: () =>
              import('src/pages/profile/ProfileOrdersHistory.vue'),
          },
          {
            path: 'cards',
            name: 'profileCards',
            component: () => import('src/pages/profile/ProfileMyCards.vue'),
          },
          {
            path: 'addresses',
            name: 'profileAddresses',
            component: () =>
              import('src/pages/profile/ProfileDeliveryAddresses.vue'),
          },
          {
            path: 'about',
            name: 'aboutUs',
            component: () => import('src/pages/profile/ProfileAboutUs.vue'),
          },
        ],
        component: () => import('src/pages/profile/ProfilePage.vue'),
      },
      {
        path: '',
        name: 'testPage',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: 'menu',
        name: 'menuPage',
        component: () => import('src/pages/MenuPage.vue'),
      },
      {
        path: 'category/:categoryId',
        name: 'categoryPage',
        component: () => import('src/pages/CategoryMenu.vue'),
      },
      {
        path: 'news/:newsId',
        name: 'newsPage',
        component: () => import('src/pages/news/NewsPage.vue'),
      },
      {
        path: 'promotion/:promotionId',
        name: 'promotionPage',
        component: () => import('src/pages/promotion/PromotionPage.vue'),
      },
      {
        path: 'menu_item/:menuItemId',
        name: 'menuItemPage',
        component: () => import('src/pages/menuItem/MenuItemPage.vue'),
      },
      {
        path: 'my_qr',
        name: 'myQrPage',
        component: () => import('src/pages/loyaltyCard/LoyaltyCardMyQr.vue'),
      },
    ],
  },
  {
    path: '/qr_data/:topologyItemId',
    name: 'parseTopologyQr',
    component: () => import('src/pages/ParseTopologyQr.vue'),
  },
  {
    path: '/404',
    name: '404page',
    component: () => import('src/pages/404page.vue'),
  },

  {
    path: '/:externalId/stores',
    name: 'storesPage',
    component: () => import('pages/StoresPage.vue'),
  },
  {
    path: '/:externalId/policy',
    name: 'policyPage',
    component: () => import('pages/PolicyPage.vue'),
  },
  {
    path: '/:externalId/terms_of_service',
    name: 'termsOfServicePage',
    component: () => import('pages/TermsOfServicePage.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/404page.vue'),
  },
]

export default routes

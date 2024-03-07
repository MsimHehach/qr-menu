<template>
  <div class="row full-width bg-background-color" ref="bottomHeader">
    <div class="row no-wrap items-center full-width">
      <div
        :style="
          $cart.item || categories?.length
            ? `height: ${$q.screen.gt.sm ? '48' : '42'}px`
            : ''
        "
        class="row full-width border-radius no-wrap body items-center gap-10 content-row relative-position"
      >
        <div
          class="row gap-sm-14 gap-xs-8 no-wrap items-center no-scrollbar"
          style="overflow-x: scroll; scroll-behavior: smooth"
          ref="scrollArea"
        >
          <div
            v-if="categories && !$salesPoint.menuLoading"
            class="gap-lg-7 gap-xs-6 gap-md-8 no-wrap items-center no-scrollbar row"
            style="transition: 0.25s all ease"
          >
            <div
              v-for="(el, index) in categories"
              :key="index"
              ref="groupButtons"
            >
              <GroupButton :key="key" :item="el" />
            </div>
            <!-- <div
              v-if="
                $q.screen.gt.sm &&
                (replacementAvailable
                  ? categories.length > 6
                  : categories.length > ($q.screen.lt.lg ? 6 : 8) &&
                    !$q.screen.xs)
              "
              class="row body no-wrap gap-4 cursor-pointer text-on-background-color"
              :class="[{ 'mt-1': $q.screen.lt.lg }]"
            >
              Еще
              <CIcon
                color="on-background-color"
                name="fa-regular fa-angle-down"
                style="transition: transform 0.25s ease"
                :style="moreCategoriesMenu ? 'transform:rotate(180deg)' : ''"
              />
              <q-menu
                v-model="moreCategoriesMenu"
                auto-close
                class="border-radius bg-background-color pa-5 column gap-2"
              >
                <div
                  v-for="(el, index) in additionalCategories"
                  :key="index"
                  class="row items-center cursor-pointer"
                >
                  <GroupButton additional :key="key" :item="el" />
                </div>
              </q-menu>
            </div> -->
          </div>
          <template v-if="$salesPoint.menuLoading">
            <q-skeleton
              v-for="(el, index) in [1, 2, 3, 4, 5, 6, 7]"
              :key="index"
              class="mt-5"
              style="margin-bottom: 13px; width: 180px"
            >
            </q-skeleton>
          </template>
        </div>

        <!-- <CButton
          v-if="authentication.user && $cart.item && $q.screen.gt.sm"
          height="48px"
          class="body"
          color="primary"
          :loading="$cart.loading"
          text-color="on-primary"
          @click="$store.cartDrawer = !$store.cartDrawer"
          style="position: absolute; right: 12px"
        >
          <div class="row gap-4">
            <CIcon
              size="17px"
              name="fa-regular fa-basket-shopping"
              color="on-button-color"
            />
            <div v-if="!$cart.item.cartItems.length">Корзина</div>
            <div v-else>
              {{ beautifyNumber($cart.item.discountedTotalSum, true) }} ₽
            </div>
          </div></CButton
        > -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import GroupButton from './GroupButton.vue'
import { useRoute } from 'vue-router'
import { menuRepo } from 'src/models/menu/menuRepo'
import { menuGroupRepo } from 'src/models/menu/menuGroups/menuGroupRepo'
// import { useQuasar } from 'quasar'
// import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
// import { store } from 'src/models/store'

const bottomHeader = ref<Element | null>(null)

const key = ref(0)

// const q = useQuasar()

const route = useRoute()

const groupButtons = ref<HTMLDivElement[]>([])

const initWatcher = ref(false)

const scrollArea = ref<HTMLDivElement>()

const categories = computed(() => {
  return menuRepo.item?.groups?.filter((v) => v.items.length)
})

// const replacementAvailable = computed(() => {
//   return (
//     companyGroupRepo.item &&
//     companyGroupRepo.item.companies.length > 1 &&
//     !store.tableMode
//   )
// })

watch(
  () => menuGroupRepo.elementsInViewport[0],
  (v) => {
    if (!initWatcher.value) {
      initWatcher.value = true
      return
    }
    const foundElementIndex = categories.value?.findIndex((el) => el.id === v)

    if (
      foundElementIndex !== undefined &&
      foundElementIndex > -1 &&
      scrollArea.value
    ) {
      scrollArea.value.scrollLeft =
        groupButtons.value[foundElementIndex].offsetLeft
    }

    // if (menuGroupRepo.scrollingToGroup) return
    // const foundElementIndex = categories.value?.findIndex((el) => el.id === v)
    // if (foundElementIndex !== undefined && foundElementIndex > -1) {
    //   groupButtons.value[foundElementIndex].scrollIntoView({
    //     block: 'start',
    //   })
    // }
  }
)

watch(
  () => route.name,
  (v) => {
    if (v === 'home' || v === 'qrHome') {
      key.value++
    }
  }
)

// const previewCategories = computed(() => {
//   return q.screen.lt.md
//     ? categories.value
//     : categories.value?.filter((_, ind) =>
//         q.screen.md ? ind < 5 : ind < (replacementAvailable.value ? 6 : 8)
//       )
// })

// onMounted(() => {
// const observer = new IntersectionObserver(
//   ([e]) => {
// if (e.boundingClientRect.top < 200) {
//   e.target.classList.toggle('isSticky', e.intersectionRatio < 1)
//   isSticky.value = e.target.classList.contains('isSticky')
// }
//   },
//   { rootMargin: '-1px 0px 0px 0px', threshold: [1] }
// )
// if (bottomHeader.value) observer.observe(bottomHeader.value)
// })
</script>

<style lang="scss" scoped>
// .content-row {
//   transition: background-color 0.3s ease;
// }
// .sticky-block {
//   position: sticky;
//   top: 0;
//   z-index: 2;
//   transition: 0.3s ease;
// }
// .sticky-block.isSticky {
//   box-shadow: var(--box-shadow);
// }
</style>

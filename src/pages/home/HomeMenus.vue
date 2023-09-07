<template>
  <div>
    <div
      v-if="$companyGroup.item && $companyGroup.item.companies.length > 1"
      class="row border-radius gap-md-20 gap-sm-10 gap-xs-5 items-center mt-sm-20 mt-md-25 mt-xs-15"
    >
      <div class="row no-wrap items-center gap-8 pr-10">
        <q-img
          class="border-radius"
          fit="contain"
          style="width: 75px; height: 75px"
          :src="$menu.item?.company.image?.thumbnail || $store.images.empty"
        >
          <template v-slot:error>
            <span>
              <q-img
                class="user-image"
                fit="contain"
                :src="$store.images.empty"
              ></q-img>
            </span> </template
        ></q-img>
        <div class="header">
          <template v-if="!$salesPoint.menuLoading">
            {{ $menu.item?.company.name }}
          </template>
          <q-skeleton v-else width="150px" height="30px" />
        </div>
      </div>

      <CButton @click="changeCompany()" label="Выбрать другое заведение" />
    </div>
    <div v-else class="header mt-18">{{ $menu.item?.name }}</div>
    <!-- <div class="row full-width mt-10 gap-10">
      <div
        @click="selectCompany(el)"
        v-for="(el, index) in $companyGroup.item?.companies"
        :key="index"
        :class="
          currentCompany?.id === el.id ? 'active-company' : 'inactive-company'
        "
        style="width: 130px"
        class="pa-5 border-radius column items-center gap-5 no-wrap cursor-pointer"
      >
        <q-avatar size="80px">
          <q-img style="height: 100%" :src="el.image?.thumbnail" fit="cover">
            <template v-slot:error>
              <span style="width: 100%; height: 100%">
                <q-img
                  class="user-image"
                  fit="contain"
                  :src="$store.images.empty"
                ></q-img>
              </span> </template
          ></q-img>
        </q-avatar>
        <div class="bold body">
          {{ el.name }}
        </div>
      </div>
    </div> -->
    <template v-if="!$salesPoint.menuLoading && $menu.item?.groups">
      <div
        v-for="(el, index) in $menu.item.groups"
        :key="index"
        class="full-width pt-18"
        :id="el.id"
      >
        <div class="header2 mb-10">
          {{ el.name }}
        </div>
        <div v-if="el.items.length" class="row full-width">
          <GridContainer
            products
            :items="el.items"
            :lg="6"
            :xl="6"
            :md="4"
            :sm="3"
            :xs="2"
          >
            <template v-slot:item="{ item }">
              <MenuItemCard :item="(item as MenuItem)" />
            </template>
          </GridContainer>
        </div>
        <div v-else>Пусто</div>
      </div>
    </template>
    <div v-else class="full-width">
      <q-skeleton type="text" width="210px" height="45px" class="mb-10 mt-18" />
      <GridContainer
        :items="[1, 2, 3, 4, 5, 6, 7, 8]"
        :lg="6"
        :xl="6"
        :md="5"
        :sm="4"
      >
        <template v-slot:item="{ item }">
          <!-- <MenuItemSkeleton v-if="$salesPoint.menuLoading" /> -->
          <MenuItemSkeleton :id="item" />
        </template>
      </GridContainer>
    </div>
    <!-- <SelectSalesPointModal
      :company="selectedCompany"
      :model-value="selectSalesPointModal"
      @update:model-value="selectSalesPointModal = false"
      @select="loadBySalesPoint($event)"
    /> -->
    <SelectCompanyModal
      :model-value="selectCompanyModal"
      @update:model-value="selectCompanyModal = false"
      @select="selectCompany($event)"
    />

    <ServiceSettingsModal
      :model-value="serviceModal"
      @update:model-value="serviceModal = false"
    />
  </div>
</template>
<script lang="ts" setup>
import MenuItemCard from 'src/components/cards/MenuItemCard.vue'
import { Company } from 'src/models/company/company'
import { ref } from 'vue'
import CButton from 'src/components/template/buttons/CButton.vue'
import SelectCompanyModal from 'src/components/dialogs/SelectCompanyModal.vue'
import { companyRepo } from 'src/models/company/companyRepo'
import ServiceSettingsModal from 'src/components/serviceSettings/ServiceSettingsModal.vue'
import MenuItemSkeleton from 'src/components/cards/MenuItemSkeleton.vue'
import GridContainer from 'src/components/containers/GridContainer.vue'
import { MenuItem } from 'src/models/menu/menuItem/menuItem'

const serviceModal = ref(false)

const selectCompanyModal = ref(false)

// const selectSalesPointModal = ref(false)

// const selectedCompany = ref<Company | null>(null)

// const currentCompany = computed(() => {
//   return companyGroupRepo.item?.companies.find((v) =>
//     v.salesPoints?.some((el) => el.menu.id === currentMenu.value)
//   )
// })

// const currentMenu = computed(() => {
//   return menuGroupRepo.items[0].menu
// })

// const showCompaniesSelector = computed(() => {
//   if (!companyGroupRepo.item || cartRepo.item) return
//   return (
//     companyGroupRepo.item?.companies.length > 1 ||
//     (companyRepo.item && companyRepo.item.salesPoints
//       ? companyRepo.item.salesPoints.filter((v) => v.active).length > 1
//       : false)
//   )
// })

const changeCompany = () => {
  selectCompanyModal.value = true
}

// const loadBySalesPoint = async (v: SalesPoint) => {
//   selectSalesPointModal.value = false
//   await store.loadCatalog(v)
//   // await menuRepo.retrieve(v.menu.id)
//   // await menuGroupRepo
//   //   .list({
//   //     menu: v.menu.id,
//   //   })
//   //   .then((res) => {
//   //     menuGroupRepo.items = res.items
//   //   })
// }

const selectCompany = async (v: Company) => {
  selectCompanyModal.value = false
  companyRepo.cartCompany = v
  serviceModal.value = true

  // if (!v.salesPoints) return
  // if (v.salesPoints?.length > 1) {
  //   selectedCompany.value = v
  //   selectSalesPointModal.value = true
  // } else {
  //   await store.loadCatalog(v.salesPoints[0])
  // }
}
</script>

<style lang="scss" scoped>
.inactive-company {
  border: 1px var(--on-background-color) solid;
}

.active-company {
  width: fit-content;
  border: 2px var(--primary) solid;
}
</style>

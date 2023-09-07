<template>
  <div>
    <div class="header mb-sm-12 mb-xs-8">Мои бонусы</div>
    <div class="row full-width no-wrap gap-10 py-xs-7">
      <div
        v-if="authentication.user?.wallets.find((v) => v.type === 'bonus')"
        :style="$q.screen.xs ? 'width: 100%' : 'min-width: 337px'"
      >
        <div
          class="row no-wrap bg-bonus-color pa-3 justify-between border-radius box-shadow bonus-block"
        >
          <div class="row no-wrap text-on-bonus-color items-center gap-5">
            <div
              class="border-radius row items-center justify-center header"
              style="
                background-color: #ffffff55;
                width: 88px;
                height: 100%;
                font-weight: 400;
              "
            >
              {{
                authentication.user
                  ? authentication.user.wallets[0].balance
                  : '-'
              }}
            </div>
            <div class="body">Доступно баллов</div>
          </div>
          <div class="row items-end">
            <div
              class="border-radius px-5 py-4"
              style="background-color: #ffffff55; height: min-content"
            >
              <CIcon color="on-bonus-color" name="fa-light fa-piggy-bank" />
            </div>
          </div>
        </div>
      </div>
      <!-- <div style="min-width: 337px">
        <div
          class="row no-wrap bg-sale-color pa-3 justify-between border-radius box-shadow bonus-block"
        >
          <div class="row no-wrap text-on-sale-color items-center gap-5">
            <div
              class="border-radius row items-center justify-center header"
              style="
                background-color: #ffffff55;
                width: 88px;
                height: 100%;
                font-weight: 400;
              "
            >
              -
            </div>
            <div class="body">Скидка</div>
          </div>
          <div class="row items-end">
            <div
              class="border-radius px-5 py-4"
              style="background-color: #ffffff55; height: min-content"
            >
              <CIcon color="on-sale-color" name="fa-light fa-percent" />
            </div>
          </div>
        </div>
      </div>
      <div style="min-width: 337px">
        <div
          class="row box-shadow text-white bg-gift-color pa-3 justify-between border-radius bonus-block"
        >
          <div class="row no-wrap text-on-gift-color items-center gap-5">
            <div
              class="border-radius row items-center justify-center"
              style="background-color: #ffffff55; width: 88px; height: 100%"
            >
              <CIcon
                name="fa-light fa-gift"
                color="on-gift-color"
                size="40px"
              />
            </div>
            <div class="body">
              Любое кофе на ваш выбор<br />
              при покупке десерта
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script lang="ts" setup>
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { authentication } from 'src/models/authentication/authentication'
</script>

<style scoped lang="scss">
.bonus-block {
  height: 100px;
}
</style>

<template>
  <div class="pt-10 bg-background-color">
    <div
      class="border-radius bg-backing-color full-width py-10 column no-wrap gap-10 items-center"
      style="height: 300px"
    >
      <div class="header2">Мой QR код</div>
      <div class="border-radius" style="height: 210px; overflow: hidden">
        <div id="qrCode"></div>
      </div>
    </div>
    <div
      class="row justify-between pa-10 full-width bg-backing-color border-radius mt-10"
    >
      <div class="column gap-3">
        <div class="bold">
          {{
            authentication.user && authentication.user.categories.length > 1
              ? 'Категории гостя'
              : 'Категория гостя'
          }}
        </div>
        <div
          v-for="(el, index) in authentication.user?.categories"
          :key="index"
          class="text-primary bold"
        >
          · {{ el.name }}
        </div>
      </div>
      <div
        style="width: 52px; height: 52px"
        class="border-radius row justify-center items-center bg-white-opacity"
      >
        <CIcon size="25px" name="fa-light fa-badge-percent" />
      </div>
    </div>
    <div class="mt-10 text-on-background-color">
      {{ $uiSettings.item?.qrCodeDescription }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { authentication } from 'src/models/authentication/authentication'
import * as qr from 'qr-ts'
import { watch, onMounted } from 'vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'

const createQrs = () => {
  let code: HTMLCanvasElement | null = null
  code = qr.renderOnCanvas(
    qr.generate(String(authentication.user?.loyaltyCard?.card_number)),
    'qrCode'
  )

  const qrElement = document.getElementById('qrCode')

  if (code && qrElement) {
    code.style.height = '210px'
    qrElement.replaceWith(code)
  }
}

watch(
  () => authentication.user,
  (v) => {
    if (v) {
      createQrs()
    }
  }
)

onMounted(() => {
  createQrs()
})
</script>

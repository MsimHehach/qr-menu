<template>
  <div>
    <div
      class="row no-wrap full-width items-center justify-between border-radius px-7 relative-position"
      style="height: 174px"
      :class="{
        'bg-loyalty-card-background-color': !$uiSettings.item?.loyaltyCardImage,
      }"
    >
      <q-img
        :src="$uiSettings.item?.loyaltyCardImage?.thumbnail"
        class="absolute border-radius"
        fit="cover"
        position="left"
        style="z-index: 0; width: 100%; height: 100%; top: 0; left: 0"
      >
      </q-img>
      <div class="col-6" style="max-height: 130px">
        <q-img
          style="max-height: 130px; height: 100%"
          fit="contain"
          :src="$uiSettings.item?.loyaltyCardLogo?.thumbnail"
        />
      </div>
      <div
        class="border-radius col-5"
        style="height: 130px; width: 130px; overflow: hidden; z-index: 999"
      >
        <div id="qrCode"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
// import { authentication } from 'src/models/authentication/authentication'
// import { watch, onMounted } from 'vue'

// const createQrs = () => {
//   let code: HTMLCanvasElement | null = null
//   code = qr.renderOnCanvas(
//     qr.generate(String(authentication.user?.loyaltyCard?.card_number)),
//     'qrCode'
//   )

//   const qrElement = document.getElementById('qrCode')

//   if (code && qrElement) {
//     code.style.height = '130px'
//     qrElement.replaceWith(code)
//   }
// }

// watch(
//   () => authentication.user,
//   (v) => {
//     if (v) {
//       createQrs()
//     }
//   }
// )

// onMounted(() => {
//   createQrs()
// })
</script>

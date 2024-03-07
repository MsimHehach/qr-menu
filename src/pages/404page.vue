<template>
  <div
    v-if="ready"
    style="height: 100vh; width: 100vw"
    class="back-panel row justify-center items-center"
  >
    <div
      style="border-radius: 30px"
      class="white-panel bg-white column gap-20 no-wrap justify-center items-center"
    >
      <div class="gradient-text first-text">404</div>
      <div class="sec-text text-uppercase">Страница не найдена</div>
      <div class="third-text">
        Что-то пошло не так. Запрашиваемая вами страница
        <br v-if="$q.screen.gt.sm" />
        не найдена.
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'

const router = useRouter()
const route = useRoute()
const ready = ref(false)

onMounted(async () => {
  if (
    route.name !== '404page' &&
    !window.location.hostname.includes('loyalhub')
  ) {
    await router.replace({ name: 'home' })
  }
  ready.value = true
})
</script>

<style lang="scss" scoped>
body.screen--xl {
  @media (max-width: 1560px) {
    .sec-text {
      font-size: 40px;
      line-height: 55px;
    }
    .first-text {
      line-height: 170.8px;
      font-weight: 600;
      font-size: 200px;
    }
    .white-panel {
      width: 60%;
      height: 80%;
    }

    .third-text {
      font-size: 24px;
      line-height: 32px;
    }
  }
  @media (min-width: 1560px) {
    .first-text {
      line-height: 190.8px;
      font-weight: 600;
      font-size: 220px;
    }
    .white-panel {
      width: 60%;
      height: 80%;
    }
    .sec-text {
      font-size: 40px;
      line-height: 55px;
    }

    .third-text {
      font-size: 24px;
      line-height: 32px;
    }
  }
}

body.screen--lg {
  .first-text {
    line-height: 150.8px;
    font-weight: 600;
    font-size: 200px;
  }

  .sec-text {
    font-size: 40px;
    line-height: 50px;
  }

  .white-panel {
    width: 65%;
    height: 80%;
  }

  .third-text {
    font-size: 24px;
    line-height: 32px;
  }
}

body.screen--md {
  .first-text {
    line-height: 150.8px;
    font-weight: 600;
    font-size: 180px;
  }

  .white-panel {
    width: 70%;
    height: 80%;
  }
  .sec-text {
    font-size: 38px;
    line-height: 45px;
  }

  .third-text {
    font-size: 20px;
    line-height: 30px;
  }
}

body.screen--sm {
  .first-text {
    line-height: 130.8px;
    font-weight: 600;
    font-size: 150px;
  }
  .white-panel {
    width: 70%;
    height: 80%;
  }

  .sec-text {
    font-size: 30px;
    line-height: 40px;
  }

  .third-text {
    font-size: 20px;
    line-height: 30px;
  }
}

body.screen--xs {
  .first-text {
    line-height: 110.8px;
    font-weight: 600;
    font-size: 110px;
  }
  .white-panel {
    width: 90%;
    height: 80%;
  }

  .sec-text {
    font-size: 18px;
    line-height: 35px;
  }

  .third-text {
    font-size: 16px;
    line-height: 28px;
  }
}

.third-text {
  font-weight: 400;
  text-align: center;
  max-width: 85%;
}

.sec-text {
  font-weight: 500;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(to right, #727272, #343434);
}
.gradient-text {
  background-image: linear-gradient(to right, #62e5f6, #d726fb);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.back-panel {
  background: hsla(186, 33%, 94%, 1);

  background: linear-gradient(
    90deg,
    hsla(186, 33%, 94%, 1) 0%,
    hsla(216, 41%, 79%, 1) 100%
  );

  background: -moz-linear-gradient(
    90deg,
    hsla(186, 33%, 94%, 1) 0%,
    hsla(216, 41%, 79%, 1) 100%
  );

  background: -webkit-linear-gradient(
    90deg,
    hsla(186, 33%, 94%, 1) 0%,
    hsla(216, 41%, 79%, 1) 100%
  );
}
</style>

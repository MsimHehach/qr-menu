<template>
  <div
      style="height: 100vh; width: 100vw"
      class="main-background row justify-center items-center"
  >
    <div
        style="border-radius: 30px"
        class="content-block bg-white column no-wrap justify-center items-center"
    >
      <div class="gradient-bg pa-10 flex flex-center text-white mb-20" style="border-radius: 50%; " :style="$q.screen.xs ? 'width: 70px; height: 70px;' : 'width: 100px; height: 100px'" >

        <q-icon name="fas fa-check" :size="$q.screen.xs ? '30px' : '50px'" />
      </div>
      <div class="title-payment-text text-uppercase mb-7">Успешная оплата</div>
      <div class="subtitle-payment-text">
        Спасибо за заказ
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
</script>

<style lang="scss" scoped>
body.screen--xl {
  @media (max-width: 1560px) {
    .title-payment-text {
      font-size: 40px;
      line-height: 55px;
    }
    .first-text {
      line-height: 170.8px;
      font-weight: 600;
      font-size: 200px;
    }
    .content-block {
      width: 60%;
      height: 80%;
    }

    .subtitle-payment-text {
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
    .content-block {
      width: 40%;
      height: 50%;
    }
    .title-payment-text {
      font-size: 40px;
      line-height: 55px;
    }

    .subtitle-payment-text {
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

  .title-payment-text {
    font-size: 40px;
    line-height: 50px;
  }

  .content-block {
    width: 40%;
    height: 50%;
  }

  .subtitle-payment-text {
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

  .content-block {
    width: 50%;
    height: 50%;
  }
  .title-payment-text {
    font-size: 38px;
    line-height: 45px;
  }

  .subtitle-payment-text {
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
  .content-block {
    width: 60%;
    height: 40%;
  }

  .title-payment-text {
    font-size: 30px;
    line-height: 40px;
  }

  .subtitle-payment-text {
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
  .content-block {
    width: 80%;
    height: 50%;
    max-height: 400px;
  }

  .title-payment-text {
    font-size: 18px;
    line-height: 35px;
  }

  .subtitle-payment-text {
    font-size: 16px;
    line-height: 28px;
  }
}

.subtitle-payment-text {
  font-weight: 400;
  text-align: center;
  max-width: 85%;
}

.title-payment-text {
  font-weight: 500;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(to right, #727272, #343434);
}
.gradient-bg {
  background-image: linear-gradient(to right, #62e5f6, #d726fb);
  //background-clip: text;
  //-webkit-text-fill-color: transparent;
}
.main-background {
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

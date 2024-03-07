<template>
  <div v-if="authentication.user" class="row full-width justify-between">
    <div class="row gap-5 no-wrap items-center">
      <q-img
        width="50px"
        height="50px"
        class="border-radius"
        fit="cover"
        :src="authentication.user.image?.thumbnail || $store.images.empty"
      >
        <template v-slot:error>
          <span>
            <q-img
              class="user-image"
              fit="cover"
              height="50px"
              width="50px"
              :src="$store.images.empty"
            ></q-img>
          </span>
        </template>
      </q-img>
      <div class="column gap-3">
        <div class="header3">{{ authentication.user?.firstName }}</div>
        <div style="font-size: 13px">{{ authentication.user?.phone }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { authentication } from 'src/models/authentication/authentication'
</script>

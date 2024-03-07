<template>
  <div class="bg-primary text-on-primary">
    <div class="c-container items-center px-4 py-5 row justify-between gap-3">
      <div class="row gap-3 items-baseline">
        <div class="header light">Мой счет</div>
        <q-separator vertical color="on-primary" style="opacity: 0.85" />
        <div style="opacity: 0.85; font-weight: 300; font-size: 15px">
          Стол
          {{ $pad.item?.tables[0].name || $pad.item?.tables[0].number }}
        </div>
      </div>
      <q-avatar>
        <q-img
          fit="cover"
          :src="$companyGroup.item?.image?.thumbnail || $store.images.empty"
        >
          <template v-slot:error>
            <q-img fit="cover" :src="$store.images.empty"></q-img> </template
        ></q-img>
      </q-avatar>
    </div>
  </div>
</template>
<script lang="ts" setup></script>

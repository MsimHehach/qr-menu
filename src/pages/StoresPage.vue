<template>
  <div class="absolute-center items-center justify-center column">
    <q-skeleton v-if="preloader && !error" size="300px" type="QAvatar" />
    <q-img
      v-else
      style="width: 300px; height: 300px; border-radius: 50%"
      :src="$uiSettings.item?.logo?.thumbnail || $store.images.empty"
    />
    <q-skeleton
      v-if="preloader && !error"
      width="200px"
      height="38px"
      class="mb-5 mt-15"
    />
    <div class="mt-8" style="font-size: 18px">
      {{ $uiSettings.item?.companyGroup.name }}
    </div>
    <q-skeleton
      v-if="preloader && !error"
      width="300px"
      height="38px"
      class="mb-5"
    />

    <div v-else style="font-weight: 400 !important" class="header2 mt-5">
      {{ error ? 'Произошла ошибка' : 'Сейчас вы будете перенаправлены' }}
    </div>
    <CButton
      v-if="currentLink"
      @click="toLink()"
      :style="`visibility: ${
        !error && !preloader && !loader ? 'visible' : 'hidden'
      }`"
      text-color="blue"
      hover-color="white"
      hover-text-color="blue"
      class="px-4 pt-2"
      text-button
      label="по ссылке"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { appSettingsRepo } from 'src/models/appSettings/appSettingsRepo'
import { useRoute } from 'vue-router'
import CButton from 'src/components/template/buttons/CButton.vue'
// import QrcodeVue from 'qrcode.vue';

const q = useQuasar()
const loader = ref(false)
const preloader = ref(false)
const route = useRoute()
const error = ref(false)

// const sexOptions = ref([
//   {
//     label: 'Мужчина',
//     value: 'male',
//   },
//   {
//     label: 'Женщина',
//     value: 'female',
//   },
//   {
//     label: 'Не указано',
//     value: 'not_stated',
//   },
// ]);

// const firstLoading = ref(false);

// const getMe = async () => {
//   const access = localStorage.getItem('access');
//   try {
//     const res: AxiosResponse<{
//       registered_at: string;
//       loyalty_cards: { card_number: string; active: boolean }[];
//       wallets: { active: boolean; balance: number; type: 'bonus' | string }[];
//       first_name: string;
//       phone: string;
//     }> = await api.get('/users/me/', {
//       headers: {
//         Authorization: `Bearer ${access}`,
//         'Company-Group': 'HooDoo',
//       },
//     });
//     return res;
//   } catch (e) {
//     console.log(e);
//   }
// };
onMounted(async () => {
  loader.value = true
  preloader.value = true
  try {
    await appSettingsRepo.getLinksSettings(String(route.params.externalId))

    if (currentLink.value) window.location.replace(currentLink.value)

    loader.value = false
  } catch (e) {
    loader.value = false
    console.log(e)
    error.value = true
  }
})
//
// const qrBlockData = ref({
//   balance: 0,
//   codeForQr: '',
//   first_name: '',
//   phone: '',
// });
//
// const setQrBlock = async (data?: {
//   registered_at: string;
//   loyalty_cards: { card_number: string; active: boolean }[];
//   wallets: { active: boolean; balance: number; type: 'bonus' | string }[];
//   first_name: string;
//   phone: string;
// }) => {
//   let res: typeof data;
//   if (!data) {
//     res = await getMe().then((r) => r?.data);
//   } else {
//     res = data;
//   }
//   if (res) {
//     if (!res.registered_at) {
//       tab.value = 'registerNewUser';
//       return;
//     }
//     qrBlockData.value = {
//       balance:
//         res.wallets.find((el) => el.active && el.type === 'bonus')?.balance ||
//         -1,
//       codeForQr: res.loyalty_cards.find((el) => el.active)?.card_number || '',
//       first_name: res.first_name,
//       phone: res.phone,
//     };
//   }
//   if (qrBlockData.value.codeForQr) {
//     tab.value = 'qrBlock';
//   }
// };
//
// const tab = ref('main');
//
// const regCodeForLogin = ref<number | null>(null);
//
// const processDataAccepted = ref(false);
//
// const toRegiser = () => {
//   tab.value = 'register';
// };
//
// const regError = ref(false);
//
// const lastAuthTryTime = ref<number | null>(null);
//
// const getPhone = (v: string) => {
//   const data = [];
//   for (const el of v) {
//     if (!Number.isNaN(Number(el)) && el !== ' ') data.push(el);
//   }
//   return data.join('');
// };
//
// const sendRegister = async () => {
//   if (regValidated.value) {
//     try {
//       await api.post(
//         '/users/request_auth/',
//         { phone: getPhone(regPhone.value) },
//         {
//           headers: {
//             'Company-Group': 'HooDoo',
//           },
//         }
//       );
//       lastAuthTryTime.value = moment.now();
//       tab.value = 'codeInput';
//     } catch (e) {
//       console.log(e);
//     }
//   } else {
//     regError.value = true;
//   }
// };
//
// const regPhone = ref('');
//
// const regValidated = computed(() => {
//   return regPhone.value && processDataAccepted.value;
// });
//
// const codeSent = ref(false);
// const codeSentFail = ref(false);
//
// watch(regCodeForLogin, async (val) => {
//   if (val !== null && String(val).length === 4) {
//     try {
//       codeSent.value = true;
//       const res: AxiosResponse<{ access: string }> = await api.post(
//         '/users/auth/',
//         {
//           phone: getPhone(regPhone.value),
//           code: String(val),
//         },
//         {
//           headers: {
//             'Company-Group': 'HooDoo',
//           },
//         }
//       );
//       codeSentFail.value = false;
//       localStorage.setItem('access', res.data.access);
//       const me = await getMe();
//       if (!me?.data.registered_at) {
//         tab.value = 'registerNewUser';
//       } else {
//         setQrBlock();
//       }
//     } catch (e) {
//       console.log(e);
//       codeSent.value = false;
//       codeSentFail.value = true;
//     }
//   }
// });
//
// const registerData = ref({
//   first_name: '',
//   birthday: '',
//   sex: '',
// });
//
// const registerLoading = ref(false);
// const registerError = ref(false);
//
// const register = async () => {
//   const access = localStorage.getItem('access');
//   try {
//     registerError.value = false;
//     registerLoading.value = true;
//     await api.post(
//       '/users/register/',
//       {
//         ...registerData.value,
//         birthday: moment(registerData.value.birthday).format('YYYY-MM-DD'),
//       },
//       {
//         headers: {
//           'Company-Group': 'HooDoo',
//           Authorization: `Bearer ${access}`,
//         },
//       }
//     );
//     setQrBlock();
//     registerLoading.value = false;
//   } catch (e) {
//     registerError.value = true;
//     registerLoading.value = false;
//   }
// };

const currentLink = computed(() => {
  const data = appSettingsRepo.linksData
  console.log(q.platform.is.mac)
  if (!data) return null
  if (data.app_download_link) return data.app_download_link
  if (
    q.platform.is.ios ||
    q.platform.is.iphone ||
    q.platform.is.ipad ||
    q.platform.is.mac
  )
    return data.ios_download_link
  return data.android_download_link
})

const toLink = () => {
  if (!currentLink.value) return
  window.open(currentLink.value, '_blank')
}
</script>

<style scoped lang="scss">
//.bcg {
//  background: linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
//    url('src/assets/top-view-delicious-kebab-with-french-fries-ketchup.jpeg');
//  background-size: cover;
//  background-repeat: no-repeat;
//  background-position: center center;
//}
//.processDataAccepted :deep(.q-checkbox__bg) {
//  background-color: white;
//}
</style>

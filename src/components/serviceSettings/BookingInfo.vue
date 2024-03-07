<template>
  <div class="px-xs-8 px-md-0 py-xs-12 py-md-0 full-width">
    <div v-if="$q.screen.lt.md" class="row full-width mb-12 gap-4 items-center">
      <CIcon
        @click="$emit('back')"
        name="fa-regular fa-angle-left"
        color="on-background-color"
        hover-color="primary"
        class="cursor-pointer"
        size="22px"
      />
      <div class="header3 bold">Забронировать стол</div>
    </div>
    <q-tab-panels
      animated
      :style="
        $q.screen.lt.md
          ? 'min-height: 320px; max-height: 80vh; height: fit-content'
          : 'height: 423px !important'
      "
      :model-value="currentMode"
      :class="{ 'full-height': $q.screen.gt.sm }"
      class="bg-background-color"
    >
      <q-tab-panel
        v-if="currentBooking"
        name="bookingInfo"
        class="column full-width justify-between no-wrap pa-0"
      >
        <div class="column no-wrap gap-8 full-width">
          <div class="column full-width gap-md-10 gap-xs-8 no-wrap">
            <div class="subtitle-text">Количество гостей и выбор стола</div>
            <div class="row full-width gap-md-8 gap-xs-6">
              <ChangeAmount
                outlined
                text-color="on-secondary-button-color"
                :height="$q.screen.lt.md ? '40px' : '48px'"
                :model-value="Number(currentBooking.guestsCount)"
                @update:model-value="
                  currentBooking.guestsCount = String($event)
                "
              />
              <div class="col-6">
                <CButton
                  v-if="$section.items.length"
                  @click="$emit('changeBookingMode', 'tablePicker')"
                  :disabled="!$section.items.length"
                  class="body ellipsis"
                  width="100%"
                  text-color="primary"
                  :style="`background-color: ${lightColor(
                    $uiSettings.item?.primaryColor.color || '000',
                    '27'
                  )} !important`"
                  :height="$q.screen.lt.md ? '40px' : '48px'"
                >
                  <div>
                    {{
                      selectedTables.length
                        ? selectedTables.length === 1
                          ? `Стол: ${selectedTables[0].number}`
                          : `Столы: ${selectedTables
                              .map((v) => v.number)
                              .join(',')}`
                        : 'Выбор стола'
                    }}
                  </div>
                </CButton>
              </div>
            </div>
          </div>
          <q-separator color="divider-color" />
          <BookingDateSelector :date="date" @updated="date = $event" />
          <BookingTimeSelector
            v-if="availableHours?.today.length"
            @updated="time = $event"
            :available-hours="availableHours"
            :time="time"
          />

          <q-separator class="my-2" color="divider-color" />
          <CInput
            v-model="currentBooking.comment"
            auto-grow
            height="fit-content"
            placeholder="Оставьте пожелания к бронированию"
          />
        </div>

        <div class="row full-width justify-center gap-6 mt-10">
          <CButton
            v-if="$q.screen.gt.sm"
            @click="$emit('changeBookingMode', 'bookingList')"
            width="280px"
            height="48px"
            color="secondary-button-color"
            text-color="on-secondary-button-color"
            class="body"
            label="Изменить адрес"
          ></CButton>
          <CButton
            @click="createBooking()"
            :disabled="!isContinueAvailable"
            :width="$q.screen.gt.sm ? '280px' : '100%'"
            :height="$q.screen.gt.sm ? '48px' : '40px'"
            class="body"
            label="Выбрать"
          ></CButton>
        </div>
      </q-tab-panel>
      <q-tab-panel name="tablePicker" class="pa-0 column full-width no-wrap">
        <BookingTableSelector
          :selected-tables="selectedTables"
          @open-table-detail="tableDetailMode($event)"
          @delete-table="deleteTableFromSelected($event)"
        />
      </q-tab-panel>
      <q-tab-panel name="tableDetail" class="pa-0 column no-wrap">
        <TableDetail
          v-if="tableToOpen"
          @confirm-selection="confirmTableSelectionHandler()"
          :table="tableToOpen"
        />
      </q-tab-panel>
      <q-tab-panel name="successBooked" class="pa-0 column no-wrap">
        <SuccessfullyBooked @close="$emit('close')" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script lang="ts" setup>
import CInput from '../template/inputs/CInput.vue'
import { ref, onMounted, computed, watch } from 'vue'
import CButton from '../template/buttons/CButton.vue'
import { sectionRepo } from 'src/models/sections/sectionRepo'
import BookingTableSelector from './BookingTableSelector.vue'
import { Table, TableRaw } from 'src/models/sections/tables/table'
import SuccessfullyBooked from './SuccessfullyBooked.vue'
import {
  BookingRequest,
  BookingStatus,
} from 'src/models/bookingRequest/bookingRequest'
import { bookingRequestRepo } from 'src/models/bookingRequest/bookingRequestRepo'
import TableDetail from './TableDetail.vue'
import { authentication } from 'src/models/authentication/authentication'
import { Notify } from 'quasar'
import { SalesPoint } from 'src/models/salesPoint/salesPoint'
import ChangeAmount from '../inputs/ChangeAmount.vue'
import { lightColor } from 'src/models/store'
import BookingDateSelector from './BookingDateSelector.vue'
import BookingTimeSelector from './BookingTimeSelector.vue'
import { AvailableHours } from 'src/models/carts/cart'
import { salesPointRepo } from 'src/models/salesPoint/salesPointRepo'
import CIcon from '../template/helpers/CIcon.vue'

export type BookingModes =
  | 'bookingList'
  | 'bookingInfo'
  | 'tablePicker'
  | 'tableDetail'
  | 'successBooked'

const props = defineProps<{
  salesPoint: SalesPoint | null
  currentMode: BookingModes
}>()

const emit = defineEmits<{
  (evt: 'changeBookingMode', value: BookingModes): void
  (evt: 'close'): void
  (evt: 'back'): void
}>()

const availableHours = ref<AvailableHours | null>(null)

const currentBooking = ref<BookingRequest | null>(null)

const date = ref<string | null>(null)

const time = ref<string | null>(null)

const tableToOpen = ref<TableRaw | null>(null)

const selectedTables = ref<TableRaw[]>([])

watch(
  () => date.value,
  (v) => {
    void salesPointRepo
      .getAvailableWorkingHours(v, props.salesPoint?.id)
      .then((res) => {
        availableHours.value = res
      })
  }
)

const isContinueAvailable = computed(() => {
  return !!currentBooking.value?.guestsCount?.length && date.value && time.value
})

const tableDetailMode = (v: TableRaw) => {
  if (selectedTables.value.map((v) => v.uuid).includes(v.uuid)) return
  tableToOpen.value = v
  emit('changeBookingMode', 'tableDetail')
}

const deleteTableFromSelected = (index: number) => {
  selectedTables.value.splice(index, 1)
}

const confirmTableSelectionHandler = () => {
  if (!tableToOpen.value) return
  selectedTables.value.push(tableToOpen.value)
  tableToOpen.value = null
  emit('changeBookingMode', 'tablePicker')
}

onMounted(() => {
  currentBooking.value = new BookingRequest({
    active: true,
    status: BookingStatus.CREATED,
    customer: authentication.user?.id || null,
    customer_name: authentication.user?.fullName || null,
    customer_phone: String(authentication.user?.phone) || null,
    sales_point: props.salesPoint?.id || null,
    tables: [],
  })
  void sectionRepo.list({
    sales_point: props.salesPoint?.id,
  })
})

const createBooking = async () => {
  if (!currentBooking.value) return
  try {
    currentBooking.value.tables = selectedTables.value.map((v) => new Table(v))
    currentBooking.value.date = `${date.value} ${time.value}`

    bookingRequestRepo.item = await bookingRequestRepo.create(
      currentBooking.value
    )

    emit('changeBookingMode', 'successBooked')
  } catch {
    Notify.create({
      message: 'Ошибка при создании бронирования',
      color: 'danger',
    })
  }
}
</script>

<style lang="scss" scoped>
.time-row:hover {
  background-color: var(--secondary-button-color);
  color: var(--on-secondary-button-color);
  transition: background-color 0.4s ease-out;
}

.time-row {
  transition: background-color 0.4s ease-out;
}

.time-picker
  :deep(.q-field--outlined.q-field--readonly .q-field__control:before) {
  border-style: solid;
}
</style>

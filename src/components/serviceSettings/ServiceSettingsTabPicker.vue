<template>
  <div class="row gap-10 full-width">
    <div
      style="height: fit-content; overflow: hidden"
      class="body bg-selector-color border-radius row full-width no-wrap pa-1"
      :class="$q.screen.lt.lg ? 'secondary-text' : 'body'"
    >
      <div
        v-for="tab in previewTabs"
        :key="tab.type"
        @click="selectTabHandler(tab)"
        :style="
          selectedTab?.type === tab.type
            ? 'transition: background-color 0.4s ease-out'
            : 'transition: background-color 0.3s ease-out'
        "
        :class="[
          selectedTab?.type === tab.type
            ? 'bg-selector-active-color text-on-selector-active-color box-shadow'
            : 'text-on-selector-color',
          $q.screen.lt.lg ? 'secondary-text' : 'body',
        ]"
        class="cursor-pointer border-radius col row items-center justify-center rounded-10 relative-position py-4"
      >
        {{ tab.label }}
        <slot name="append"></slot>
      </div>
      <div
        v-if="additionalTabs.length"
        class="py-4 col row justify-center row gap-3 cursor-pointer border-radius items-center"
        :class="[
          isAdditionalTabSelected
            ? 'bg-selector-active-color text-on-selector-active-color box-shadow'
            : 'text-on-selector-color',
        ]"
      >
        <div>Еще</div>

        <CIcon
          :color="
            isAdditionalTabSelected
              ? 'on-selector-active-color'
              : 'on-selector-color'
          "
          size="20px"
          name="fa-regular fa-angle-down"
        />
        <q-menu fit auto-close class="pa-6 column gap-5">
          <div
            v-for="tab in additionalTabs"
            :key="tab.type"
            @click="selectTabHandler(tab)"
            class="row full-width body cursor-pointer"
          >
            {{ tab.label }}
          </div>
        </q-menu>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch, computed } from 'vue'
import { TabRaw } from './ServiceSettingsModal.vue'
import CIcon from '../template/helpers/CIcon.vue'
import { useQuasar } from 'quasar'

const props = withDefaults(
  defineProps<{
    tabs: TabRaw[]
    modelValue?: TabRaw
    routerMethod?: 'replace' | 'push'
  }>(),
  {
    routerMethod: 'replace',
  }
)

const emit = defineEmits<{
  (evt: 'updateTab', value: TabRaw): void
}>()

const selectedTab = ref<TabRaw | null>(null)

const q = useQuasar()

const previewTabs = computed(() => {
  return q.screen.gt.md ? props.tabs.slice(0, 3) : props.tabs.slice(0, 2)
})

const additionalTabs = computed(() => {
  return q.screen.gt.md ? props.tabs.slice(3) : props.tabs.slice(2)
})

const isAdditionalTabSelected = computed(() => {
  if (!selectedTab.value) return
  return additionalTabs.value
    .map((v) => v.type)
    .includes(selectedTab.value.type)
})

const selectTabHandler = (v: TabRaw) => {
  selectedTab.value = v
  emit('updateTab', selectedTab.value)
}

onMounted(() => {
  if (props.modelValue) {
    selectedTab.value = props.modelValue
  }
})

watch(
  () => props.modelValue,
  (v) => {
    if (v) selectedTab.value = v
  }
)
</script>

<stype lang="scss" scoped></stype>

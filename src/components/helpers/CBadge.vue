<template>
  <q-badge
    class="px-6 py-3 rounded-10"
    :style="`height: ${height ? height : '25px'}; width: ${
      width ? width : 'min-content'
    };`"
    v-bind="$props"
  >
    <slot></slot
  ></q-badge>
</template>
<script lang="ts" setup>
import { QBadgeProps } from 'quasar'

defineProps<{
  color?: QBadgeProps['color']
  textColor?: QBadgeProps['textColor']
  floating?: QBadgeProps['floating']
  transparent?: QBadgeProps['transparent']
  multiLine?: QBadgeProps['multiLine']
  label?: QBadgeProps['label']
  align?: QBadgeProps['align']
  outline?: QBadgeProps['outline']
  rounded?: QBadgeProps['rounded']
  height?: string
  width?: string
}>()
</script>

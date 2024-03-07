<template>
  <div :style="`display: ${wrapperDisplay};`">
    <div :style="badge ? 'position: relative' : ''">
      <div
        v-if="badge"
        style="
          border-radius: 50%;
          height: 10px;
          width: 10px;
          background: #47b7b3;
          display: inline-block;
          position: absolute;
          right: -5px;
          top: -5px;
          z-index: 1;
        "
      ></div>
      <q-badge
        class="items-center justify-center"
        v-if="count"
        rounded
        color="accent3"
        :label="count"
      />
      <q-btn
        class="border-radius2"
        @mouseover="_hover = true"
        @mouseleave="_hover = false"
        :ripple="ripple"
        :unelevated="unelevated"
        :outline="outline"
        :color="_color"
        @click="$emit('click')"
        :text-color="_iconColor"
        :to="to"
        :href="href"
        :target="target"
        :loading="loading"
        :disabled="_disabled"
        :disable="_disabled"
        :class="[classes, circle ? 'circle-button' : undefined]"
        :style="`${iconStyle}; width:${_size}; height:${_size}; padding: ${
          noPadding ? '0px' : '4px 16px'
        }`"
      >
        <q-icon
          v-if="icon"
          :name="icon"
          :style="`font-size:${_iconSize} !important;`"
        />
        <slot></slot>
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { computed, ref } from 'vue'

const props = defineProps({
  ripple: {
    default: false,
    type: Boolean,
  },
  flat: Boolean,
  round: Boolean,
  unelevated: {
    default: true,
    type: Boolean,
  },
  outline: Boolean,
  color: {
    default: 'secondary2',
    type: String,
  },
  icon: String,
  to: [String, Object],
  href: String,
  target: String,
  loading: Boolean,
  hoverColor: String,
  iconColor: {
    default: 'black',
    type: String,
  },
  hoverIconColor: {
    default: 'primary',
    type: String,
  },
  size: {
    default: '42px',
    type: String,
  },
  disabled: Boolean,
  count: [Number, String],
  iconClass: String,
  iconSize: {
    default: '16px',
    type: String,
  },
  noPadding: Boolean,
  badge: Boolean,
  iconStyle: String,
  noRelative: Boolean,
  wrapperDisplay: {
    type: String,
    default: 'inline-block',
  },
  circle: Boolean,
})

defineEmits(['click'])

const _hover = ref(false)
const quasar = useQuasar()

const _color = computed(() => {
  return _hover.value && props.hoverColor ? props.hoverColor : props.color
})

const _disabled = computed(() => {
  if (props.disabled) return true
  else return undefined
})

const classes = computed(() => {
  if (props.outline && !props.iconClass) {
    return 'borderedButton'
  } else if (props.outline && props.iconClass) {
    return 'borderedButton ' + props.iconClass
  } else {
    return props.iconClass
  }
})

const _iconColor = computed(() => {
  if (quasar.platform.has.touch && !quasar.platform.is.desktop)
    return props.iconColor

  if (props.disabled) {
    return 'secondary'
  }
  return _hover.value && props.hoverIconColor
    ? props.hoverIconColor
    : props.iconColor
})

const _size = computed(() => {
  let size = props.size
  if (size === 'unset') return size
  if (size.slice(size.length - 1, size.length) === '%') return size
  if (size.slice(size.length - 2, size.length) !== 'px') {
    return (size += 'px')
  } else {
    return size
  }
})

const _iconSize = computed(() => {
  let size = props.iconSize
  if (size.slice(size.length - 2, size.length) !== 'px') {
    return (size += 'px')
  } else {
    return size
  }
})
</script>

<style lang="scss" scoped>
.q-btn {
  line-height: 1rem;
  max-width: unset;
  max-height: unset;
  width: auto;
  height: auto;
  border-radius: 4px;
  transition: 0.3s ease-in-out;
  text-transform: unset !important;
  min-height: unset;
}

.q-badge {
  position: absolute;
  z-index: 1;
  font-size: 10px;
  padding: 0 !important;
  min-height: 16px;
  min-width: 16px;
  transform: translate(33px, -7px);
  padding-top: 1px !important;
}

.circle-button {
  border-radius: 50% !important;
}

.q-btn .q-icon {
  margin-right: 0 !important;
}
.borderedButton:hover {
  color: var(--primary) !important;
}

// .borderedButton:hover:before {
//   // border: 1px solid $accent4;
//   transition: 0.3s;
// }

// .q-btn--outline:before {
//   // border: 1px solid $secondary;
// }

body.screen--sm {
  .q-badge {
    position: absolute;
    z-index: 1;
    font-size: 10px;
    padding: 2px 2px 1px 3px;
    min-height: 16px;
    min-width: 16px;
    transform: translate(23px, -9px);
  }
}

.q-btn.items-start span {
  align-items: flex-start;
}

.q-btn.items-end span {
  align-items: flex-end;
}
</style>

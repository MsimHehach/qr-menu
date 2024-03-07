<template>
  <div style="height: inherit; overflow: hidden; max-width: 590px">
    <div class="row full-width gap-5 no-wrap pb-3" style="overflow-x: auto">
      <div
        @click="loadScheme(section)"
        v-for="(section, index) in $section.items"
        :key="index"
        class="cursor-pointer px-6 py-3 border-radius body"
        :class="
          section.id === selectedSection?.id
            ? 'bg-primary text-on-primary'
            : 'text-on-background-color bg-background-color'
        "
        style="white-space: nowrap"
      >
        {{ section.name }}
      </div>
    </div>
    <div
      v-if="selectedTables.length"
      class="row items-center full-width no-wrap gap-5 pt-6"
      style="overflow-x: auto"
    >
      <div class="body bold">Выбраны:</div>
      <div
        v-for="(table, index_) in selectedTables"
        :key="index_"
        style="white-space: nowrap"
        class="px-4 py-2 border-radius row no-wrap items-center gap-3 bg-secondary text-on-secondary body"
      >
        Стол
        {{ table.number }}
        <CIcon
          @click="deleteTableFromSelected(index_)"
          name="fa-light fa-xmark"
          size="14px"
          color="on-background-color"
          hover-color="primary"
          class="cursor-pointer"
        />
      </div>
    </div>
    <div class="pt-6">
      <div
        class="full-width"
        :style="
          selectedTables.length ? 'max-height: 327px;' : 'max-height: 368px;'
        "
        style="overflow: auto"
      >
        <canvas ref="canvas"></canvas>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Section } from 'src/models/sections/section'
import { sectionRepo } from 'src/models/sections/sectionRepo'
import { ref, onMounted } from 'vue'
import CIcon from '../template/helpers/CIcon.vue'
import { TableRaw } from 'src/models/sections/tables/table'

const selectedSection = ref<Section | null>(null)

const canvas = ref<HTMLCanvasElement | null>(null)

defineProps<{
  selectedTables: TableRaw[]
}>()

const emit = defineEmits<{
  (evt: 'openTableDetail', val: TableRaw): void
  (evt: 'deleteTable', val: number): void
}>()

const loadScheme = async (section: Section) => {
  selectedSection.value = await sectionRepo.retrieve(section.id)
  drawCanvas()
}

const deleteTableFromSelected = (index: number) => {
  emit('deleteTable', index)
}

const parseAlphaColorsFromCorrect = (str: string) => {
  if (str.length === 9) {
    const firstTwo = str.substr(1, 2)
    const res = str.charAt(0) + str.substr(3, str.length) + firstTwo
    return res
  } else return str
}

const drawMarks = () => {
  if (!canvas.value) return
  const sortedFiguresByZIndex = sectionRepo.item?.scheme?.figures.sort(
    (a, b) => a.z - b.z
  )
  const context = canvas.value.getContext('2d')

  sortedFiguresByZIndex
    ?.filter((v) => v.type === 'mark')
    ?.forEach((figure) => {
      if (context) {
        context.fillStyle = parseAlphaColorsFromCorrect(figure.color)
        context.font = `${figure.font_size}px Arial`
        context.fillText(
          figure.text || '',
          figure.x,
          figure.y + (figure.height - 7)
        )
      }
    })
}

const drawFigures = () => {
  if (!canvas.value) return
  const sortedFiguresByZIndex = sectionRepo.item?.scheme?.figures.sort(
    (a, b) => a.z - b.z
  )
  const context = canvas.value.getContext('2d')

  sortedFiguresByZIndex?.forEach((figure) => {
    if (!context) return
    context.fillStyle = parseAlphaColorsFromCorrect(figure.color)
    if (figure.type === 'table' || figure.type === 'rectangle') {
      context.fillRect(figure.x, figure.y, figure.width, figure.height)
    }
    if (figure.type === 'ellipse') {
      context.beginPath()
      context.ellipse(
        figure.x + figure.width / 2,
        figure.y + figure.height / 2,
        figure.width / 2,
        figure.height / 2,
        0,
        0,
        2 * Math.PI
      )
      context.fill()
    }
    if (figure.image?.image) {
      const image = new Image()
      image.src = figure.image.image
      image.onload = () => {
        if (!canvas.value) return
        context?.drawImage(
          image,
          figure.x,
          figure.y,
          figure.width,
          figure.height
        )
      }
    }
  })
}

const drawCanvas = () => {
  if (!canvas.value || !sectionRepo.item || !sectionRepo.item.scheme) return
  const context = canvas.value.getContext('2d')

  // const scaleCoeff = 410 / sectionRepo.item.scheme.height;
  // context?.clearRect(0, 0, canvas.value.width, canvas.value.height);
  // context?.scale(scaleCoeff, scaleCoeff);

  canvas.value.width = sectionRepo.item.scheme.width
  canvas.value.height = sectionRepo.item.scheme.height

  if (sectionRepo.item.scheme.image?.image) {
    const image = new Image()
    image.src = sectionRepo.item.scheme.image?.image

    image.onload = () => {
      if (!canvas.value) return
      context?.drawImage(image, 0, 0, canvas.value.width, canvas.value.height)
      drawFigures()
      setTimeout(() => {
        drawMarks()
      }, 100)
    }
  } else {
    drawFigures()
    setTimeout(() => {
      drawMarks()
    }, 100)
  }
}

const handleClick = (event: MouseEvent) => {
  if (!canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const clickedObject = findClickedObject(x, y)?.table
  if (clickedObject) {
    emit('openTableDetail', clickedObject)
    sectionRepo.lastViewed = selectedSection.value
    // tableDetailModal.value = true;
  }
}

const findClickedObject = (x: number, y: number) => {
  const foundOnClick = sectionRepo.item?.scheme?.figures.filter((v) => {
    const objectX = v.x
    const objectY = v.y

    if (
      x >= objectX &&
      x <= objectX + v.width &&
      y >= objectY &&
      y <= objectY + v.height
    ) {
      return true
    }
  })
  return foundOnClick?.find((v) => v.type === 'table')
}

onMounted(async () => {
  await loadScheme(sectionRepo.lastViewed || sectionRepo.items[0])
  drawCanvas()
  canvas.value?.addEventListener('click', handleClick)
})
</script>

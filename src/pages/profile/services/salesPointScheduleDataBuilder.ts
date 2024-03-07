import { DeliveryAreaSettings } from 'src/models/deliveryAreas/deliveryAreaSettings/deliveryAreaSettings'
import { daysNames } from 'src/services/daysEnum'
import moment from 'moment'

type DefaultScheduleData = {
  day: number
  selected: boolean
}

type DeliveryScheduleTimeData = {
  time: string
  deliveryPrice: number
  deliveryDuration: number
  minimalOrderSum: number
}

type DeliveryScheduleData = DefaultScheduleData & {
  timesData: {
    time: string
    deliveryPrice: number
    deliveryDuration: number
    minimalOrderSum: number
  }[]
}

type Result = DefaultScheduleData & {
  mainItem: DeliveryScheduleTimeData | null
  children: DeliveryScheduleTimeData[]
}

export class SalesPointScheduleDataBuilder {
  private items: DeliveryAreaSettings[]
  private readonly currentDay?: number
  private deliveryDataByDayByTimes: Record<
    number,
    Record<string, Array<DeliveryScheduleTimeData>>
  > = {}

  constructor(items: DeliveryAreaSettings[], currentDay?: number) {
    this.items = items
    this.currentDay = currentDay
  }

  init() {
    this.prepare()
    return this.process()
  }

  private prepare() {
    const result: DeliveryScheduleData[] = []
    for (const dayNumber of Object.keys(daysNames).map((v) => Number(v))) {
      const currentItems = this.items.filter((v) =>
        v.weekdays.some((day) => day === dayNumber)
      )
      const scheduleData: DeliveryScheduleData = {
        day: dayNumber,
        selected: this.getIsDaySelected(dayNumber),
        timesData: [],
      }
      for (const settings of currentItems) {
        const _data = {
          time:
            settings.startTime === settings.endTime
              ? 'Круглосуточно'
              : `${settings.startTime} - ${settings.endTime}`,
          deliveryDuration: settings.deliveryDuration,
          deliveryPrice: settings.deliveryPrice,
          minimalOrderSum: settings.minimalOrderSum,
        }
        scheduleData.timesData.push(_data)
      }
      result.push(scheduleData)
    }
    for (const item of result) {
      if (!this.deliveryDataByDayByTimes[item.day])
        this.deliveryDataByDayByTimes[item.day] = {}
      const resItems = this.deliveryDataByDayByTimes[item.day]
      for (const timeData of item.timesData)
        if (!resItems[timeData.time]) {
          resItems[timeData.time] = [timeData]
        } else resItems[timeData.time].push(timeData)
    }
  }

  private process(): Result[] {
    let resItem: Result = {
      children: [],
      day: 0,
      mainItem: null,
      selected: false,
    }
    const resetResItem = () => {
      resItem = {
        children: [],
        day: 0,
        mainItem: null,
        selected: false,
      }
    }
    const result: Result[] = []
    if (!Object.keys(this.deliveryDataByDayByTimes).length) return []

    for (const dayNumber of Object.keys(this.deliveryDataByDayByTimes)) {
      resItem.day = Number(dayNumber)
      resItem.selected = this.getIsDaySelected(Number(dayNumber))
      const currentItemsByTime =
        this.deliveryDataByDayByTimes[Number(dayNumber)]
      for (const time of Object.keys(currentItemsByTime)) {
        const currentItems = currentItemsByTime[time].sort(
          (a, b) => b.deliveryPrice - a.deliveryDuration
        )
        for (const [index, currentItem] of currentItems.entries()) {
          if (!index) resItem.mainItem = currentItem
          resItem.children.push(currentItem)
        }
        result.push(resItem)
        resetResItem()
      }
    }
    return result
  }

  private getIsDaySelected(dayNumber: number) {
    if (this.currentDay === dayNumber) return true
    return moment().isoWeekday() === dayNumber
  }
}

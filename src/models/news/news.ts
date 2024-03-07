import moment from 'moment'
import { BaseModel } from 'src/corexModels/apiModels/baseModel'
import { ImageRaw } from '../image/image'

export enum NewsType {
  DEFAULT = 'default',
  PROMOTION = 'promotion',
}

export type NewsFilters = {
  search?: string
  active?: boolean
}

export type NewsRaw = {
  uuid?: string
  title: string
  image?: ImageRaw
  images?: ImageRaw[]
  is_html?: boolean
  short_description?: string | null
  active: boolean
  published_at?: string
  company_group: string
  full_description?: string | null
  start_date?: string | null
  end_date: string | null
  created_at?: string | null
  updated_at?: string | null
  sales_points?: string[]
  send_date: string | null
  views_count: number
  type: NewsType
}

export class News implements BaseModel {
  id: string
  title: string
  image?: ImageRaw
  images: ImageRaw[]
  shortDescription: string
  active: boolean
  publishedAt: string
  companyGroup: string
  fullDescription: string
  startDate?: string | null
  endDate: string | null
  createdAt: string | null
  updatedAt?: string | null
  salesPoints?: string[]
  isHtml?: boolean
  sendDate: string | null
  viewsCount: number
  type: NewsType

  constructor(raw: NewsRaw) {
    this.id = raw.uuid || ''
    this.title = raw.title
    this.image = raw.image
    this.images = raw.images || []
    this.shortDescription = raw.short_description ? raw.short_description : ''
    this.active = raw.active
    this.publishedAt = raw.published_at
      ? moment
          .utc(raw.published_at, 'YYYY-MM-DD HH:mm:ss')
          .local()
          .format('DD.MM.YYYY HH:mm')
      : ''
    this.companyGroup = raw.company_group
    this.fullDescription = raw.full_description ? raw.full_description : ''
    this.startDate = raw.start_date
    this.endDate = raw.end_date
      ? moment
          .utc(raw.end_date, 'YYYY-MM-DD HH:mm:ss')
          .local()
          .format('DD.MM.YYYY')
      : null
    this.createdAt = this.createdAt = moment
      .utc(raw.created_at, 'YYYY-MM-DD HH:mm:ss')
      .local()
      .format('DD.MM.YYYY HH:mm')
    this.updatedAt = raw.updated_at
    this.salesPoints = raw.sales_points
    this.isHtml = raw.is_html
    this.sendDate = raw.send_date
      ? moment
          .utc(raw.send_date, 'YYYY-MM-DD HH:mm:ss')
          .local()
          .format('DD.MM.YYYY HH:mm')
      : null
    this.viewsCount = raw.views_count
    this.type = raw.type
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      title: this.title,
      image: this.image,
      images: this.images,
      short_description: this.shortDescription.length
        ? this.shortDescription
        : null,
      active: this.active,
      // published_at: this.published_at,'
      company_group: this.companyGroup,
      full_description: this.fullDescription.length
        ? this.fullDescription
        : null,
      is_html: this.isHtml,
      end_date: this.endDate
        ? moment.utc(this.endDate, 'DD.MM.YYYY').format('YYYY-MM-DD HH:mm:ss')
        : null,
      send_date: this.sendDate
        ? moment(this.sendDate, 'DD.MM.YYYY HH:mm:ss')
            .utc()
            .format('YYYY-MM-DD HH:mm:ss')
        : null,
      // start_date: this.start_date,
      // created_at: this.created_at,
      // updated_at: this.updated_at,
      // sales_points: this.sales_points,
    }
  }
}

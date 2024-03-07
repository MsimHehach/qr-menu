import { cloneDeep } from 'lodash'
import { BaseModel } from './baseModel'
import { BaseModelApi } from './baseModelApi'
import { BasePagination } from './basePagination'

export type BaseListConfig = {
  dontSetToItems?: boolean
  appendItems?: boolean
  page?: number
  pageSize?: number | string
  setLoading?: boolean
}

abstract class BaseRepo<T extends BaseModel> {
  item: T | null = null
  items: Array<T> = []
  pagination: BasePagination = BasePagination.empty()
  loading = true
  loadings = {
    list: false,
    retrieve: false,
    delete: false,
    create: false,
    save: false,
    update: false,
    action: false,
  }
  abstract api: BaseModelApi<T>

  async list(
    params: Record<string, any> = {},
    config: BaseListConfig = {}
  ): Promise<{ pagination: BasePagination; items: Array<T> }> {
    let _params = cloneDeep(params)
    _params = this.processParams(
      Object.assign(_params, {
        page: config.page || 1,
        page_size: config.pageSize || this.pagination.page_size,
      })
    )

    if (!config.dontSetToItems || config.setLoading) {
      this.loadings.list = true
    }

    const { pagination, items } = await this.api.list({ params: _params })

    if (!config.dontSetToItems) {
      this.loadings.list = false
      pagination.page_size = this.pagination.page_size
      this.pagination = pagination

      if (config.appendItems) {
        this.items = this.items.concat(items)
      } else {
        this.items = items
      }
      return { pagination, items: this.items }
    }
    return { pagination, items }
  }

  async setPage(page: number) {
    this.pagination.page = page
    return await this.list()
  }

  async create(obj: T | null = null, dontSetToItem = false): Promise<T> {
    if (!obj && this.item) obj = this.item
    if (!obj) throw Error('Object does not exists')
    this.loadings.create = true
    this.loadings.save = true
    const result = await this.api.create(obj.toJson())
    if (!dontSetToItem) this.item = result
    this.loadings.create = false
    this.loadings.save = false
    return result
  }

  async update(obj: T | null = null): Promise<T> {
    if (!obj && this.item) obj = this.item
    if (!obj) throw Error('Object does not exists')
    if (!obj.id) throw Error('Object does not has id.')
    this.loadings.update = true
    this.loadings.save = true
    const result = await this.api.update(obj.id, obj.toJson())
    this.item = result
    this.loadings.update = false
    this.loadings.save = false
    return this.item
  }

  async retrieve(
    id: number | string,
    params: Record<string, any> = {}
  ): Promise<T> {
    this.loadings.retrieve = true
    this.item = await this.api.retrieve(id, this.processParams(params))
    this.loadings.retrieve = false
    return this.item
  }

  async delete(obj: T | null = null): Promise<void> {
    if (!obj && this.item) obj = this.item
    if (!obj) throw Error('Object does not exists')
    if (!obj.id) throw Error('Object does not has id.')
    this.loadings.retrieve = true
    await this.api.delete(obj.id)
    if (this.item?.id === obj.id) this.item = null
    this.loadings.retrieve = false
  }

  getListParams(params: Record<string, any> = {}, config: BaseListConfig = {}) {
    params = this.processParams(
      Object.assign(params, {
        page: config.page || 1,
        page_size: config.pageSize || this.pagination.page_size,
      })
    )
    return { params }
  }

  processParams(params: Record<string, any>) {
    const keys = Object.keys(params)
    for (const key of keys) {
      if (Array.isArray(params[key])) {
        const value: any[] = params[key] as any[]
        params[key] = value.join(',')
      }
    }
    return params
  }
}

export default BaseRepo

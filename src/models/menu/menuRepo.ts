import { ItemSize, Menu, MenuFilters } from './menu'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { menuApi } from './menuApi'
import { reactive } from 'vue'
import { Image, ImageRaw } from '../image/image'
import { MenuItem, MenuItemRaw } from './menuItem/menuItem'

export class MenuRepo extends BaseRepo<Menu> {
  // currentProduct: MenuItem | null = null
  getMenuItemsLoading = false
  item_: Menu | null = null
  api = menuApi

  filters: MenuFilters = {
    search: '',
  }

  async getMenuItems(uuid: string): Promise<MenuItemRaw> {
    this.getMenuItemsLoading = true
    const res = menuApi.getMenuItems(uuid)
    this.getMenuItemsLoading = false
    return res
  }

  async setMenuItemImage(
    item: MenuItem,
    image: string | Blob,
    isMain = true
  ): Promise<ImageRaw> {
    const formData: FormData = new FormData()
    formData.append('image', image)
    formData.append('main_image', String(isMain))

    return await this.api.setMenuItemImage(item.id, formData)
  }

  async deleteImage(item: MenuItem, image: Image) {
    return await this.api.send({
      method: 'POST',
      url: `menu_items/${item.id}/delete_image/`,
      data: {
        image: image.id,
      },
    })
  }

  async setItemSizeImage(
    item: ItemSize,
    image: string | Blob,
    isMain = true
  ): Promise<ImageRaw> {
    const formData: FormData = new FormData()
    formData.append('image', image)
    formData.append('main_image', String(isMain))
    return await this.api.setItemSizeImage(item.id || '', formData)
  }

  async deleteItemSizeImage(item: ItemSize, image: Image) {
    return await this.api.send({
      method: 'POST',
      url: `menu_item_sizes/${item.id}/delete_image/`,
      data: {
        image: image.id,
      },
    })
  }
}

export const menuRepo = reactive(new MenuRepo())

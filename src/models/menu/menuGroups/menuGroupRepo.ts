import { MenuGroup } from './menuGroup'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { menuGroupApi } from './menuGroupApi'
import { reactive } from 'vue'
import { Image, ImageRaw } from 'src/models/image/image'

export class MenuGroupRepo extends BaseRepo<MenuGroup> {
  elementsInViewport: string[] = []
  scrollingToGroup = false
  api = menuGroupApi

  async setImage(
    item: MenuGroup,
    image: string | Blob,
    isMain = true
  ): Promise<ImageRaw> {
    const formData: FormData = new FormData()
    formData.append('image', image)
    formData.append('main_image', String(isMain))
    return await this.api.setImage(item.id, formData)
  }

  async deleteImage(item: MenuGroup, image: Image) {
    return await this.api.send({
      method: 'POST',
      action: 'delete_image',
      id: item.id,
      data: {
        image: image.id,
      },
    })
  }
}

export const menuGroupRepo = reactive(new MenuGroupRepo())

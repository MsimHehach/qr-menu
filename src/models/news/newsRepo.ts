import { News, NewsFilters } from './news'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { newsApi } from './newsApi'
import { reactive } from 'vue'
import { ImageRaw } from '../image/image'

export class NewsRepo extends BaseRepo<News> {
  api = newsApi
  news: News[] = []
  promotions: News[] = []
  filters: NewsFilters = { active: false }

  async setImage(
    news: News,
    image: string | Blob,
    mainImage = false
  ): Promise<ImageRaw> {
    const formData: FormData = new FormData()
    formData.append('image', image)
    formData.append('main_image', String(mainImage))
    return await this.api.setImage(news.id, formData)
  }

  async deleteImage(item: News, image: ImageRaw) {
    return await this.api.send({
      method: 'POST',
      action: 'delete_image',
      id: item.id,
      data: {
        image: image.uuid,
      },
    })
  }

  async publish(newsUuid: string): Promise<boolean> {
    const res = await this.api.publish(newsUuid)
    return res.active
  }

  async disable(newsUuid: string): Promise<boolean> {
    const res = await this.api.disable(newsUuid)
    return res.active
  }
}

export const newsRepo = reactive(new NewsRepo())

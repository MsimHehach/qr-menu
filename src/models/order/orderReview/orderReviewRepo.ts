import { OrderReview, OrderReviewsFilter } from './orderReview'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { orderReviewApi } from './orderReviewApi'
import { reactive } from 'vue'

export class OrderReviewRepo extends BaseRepo<OrderReview> {
  api = orderReviewApi
  filters: OrderReviewsFilter = new OrderReviewsFilter()
}

export const orderReviewRepo = reactive(new OrderReviewRepo())

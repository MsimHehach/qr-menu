import { OrderReviewRaw, OrderReview } from './orderReview';
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi';

export class OrderReviewApi extends BaseModelApi<OrderReview> {
  routeName = 'order_reviews'
  fromJson = (json: OrderReviewRaw) => new OrderReview(json)
}

export const orderReviewApi = new OrderReviewApi();

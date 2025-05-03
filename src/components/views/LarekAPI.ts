import { Api, ApiListResponse } from "../base/api";
import { OrderData, OrderResult, IProduct, IWebLarekAPI } from "../../types/index";

export class LarekAPI  extends Api implements IWebLarekAPI {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  getProductItem(id: string): Promise<IProduct> {
    return this.get(`/product/${id}`).then(
      (item: IProduct) => ({
        ...item,
        image: this.cdn + item.image,
      })
    );
  }

  getProductList(): Promise<IProduct[]> {
    return this.get('/product').then((data: ApiListResponse<IProduct>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image,
      }))
    );
  }

  orderProducts(order: OrderData): Promise<OrderResult> {
    return this.post(`/order`, order).then(
      (data: OrderResult) => data
    );
  }
}
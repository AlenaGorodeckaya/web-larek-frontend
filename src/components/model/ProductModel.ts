import {Model} from "../base/model";
import {IProduct, IAppData} from "../../types";

/**
 * Класс модели товаров, наследуется от базовой модели.
 * Работает с данными о товарах и превью товара.
 */
export class ProductModel extends Model<IAppData> {
// Массив товаров в каталоге
  private _products: IProduct[] = [];

// ID товара, выбранного для превью (или null если ничего не выбрано)
  private _preview: string | null = null;

// Устанавливает каталог товаров
setProducts(products: IProduct[]) {
  this._products = products;
  this.emitChanges('items:changed');
}

// Устанавливает товар для превью
  setPreview(product: IProduct) {
    this._preview = product.id;
    this.emitChanges('preview:changed', product);
  }

// Возвращает текущий список продуктов
  get products(): IProduct[] {
    return this._products;
  }

//Возвращает ID продукта в preview
  get preview(): string | null {
    return this._preview;
  }
}

// Product - модель товара в приложении. Наследуется от базового класса Model, типизированного интерфейсом IProduct,и реализует интерфейс IProduct.
export class Product extends Model<IProduct> implements IProduct {
    id: string; // Идентификатор товара
    title: string; // Название товара
    description: string; // Описание товара
    image: string; // Изображение товара
    category: string; // Категория товара
    price: number | null; //Цена товара, null - бесценно
}
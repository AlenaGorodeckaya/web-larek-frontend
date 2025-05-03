import { Model } from "../base/model";
import { IProduct, IAppData } from "../../types";

export class CartModel extends Model<IAppData> {
    private _items: IProduct[] = [];
    private _total: number = 0;
    private _quantity: number = 0;

//Обновляет состояние корзины и вызывает соответствующие события.
    private updateCartState() {
      this.emitChanges('cart:changed', this._items);
    }

// Возвращает текущее содержимое корзины.
    get items(): IProduct[] {
      return this._items;
    }

// Возвращает общую стоимость товаров в корзине.
    get total(): number {
      return this._total;
    }

// Возвращает количество товаров в корзине.
    get quantity(): number {
      return this._quantity;
    }

// Очищает корзину.
    clearCart() {
      this._items = [];
      this._total = 0;
      this._quantity = 0;
      this.updateCartState();
    }

// Проверяет наличие товара в корзине.
    isItemInCart(item: IProduct): boolean {
      return this._items.some((product) => product.id === item.id);
    }

// Добавляет товар в корзину.
    addItem(item: IProduct) {
      if (!this.isItemInCart(item)) {
        this._items.push(item);
        this.calculateTotals();
        this.updateCartState();
      }
    }
  
// Удаляет товар из корзины.
    removeItem(id: string) {
      this._items = this._items.filter((product) => product.id !== id);
      this.calculateTotals();
      this.updateCartState();
    }
  
// Возвращает товар из корзины по ID.
    getItem(id: string): IProduct | undefined {
      return this._items.find((product) => product.id === id);
    }
  
// Пересчитывает общую стоимость и количество товаров.
    private calculateTotals() {
      this._quantity = this._items.length;
      this._total = this._items.reduce((sum, item) => sum + (item.price || 0), 0);
    }
}
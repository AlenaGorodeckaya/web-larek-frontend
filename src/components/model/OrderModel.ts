import { Model } from "../base/model";
import { OrderData, IAppData, FormErrors } from "../../types";

export class OrderModel extends Model<IAppData> {
  private _order: OrderData = {
    email: "",
    phone: "",
    address: "",
    payment: "",
    items: [],
    total: 0,
  };
  private _errors: FormErrors = {};

  get data(): OrderData {
    return this._order;
  }

  get errors(): FormErrors {
    return this._errors;
  }

  setField(field: keyof OrderData, value: string): void {
    (this._order as any)[field] = value;
    this.emitChanges('order:changed', { field, value });
  }

  validateDelivery(): boolean {
    // Полностью сбрасываем ошибки перед проверкой
    this._errors = {};
    let hasErrors = false;

    if (!this._order.payment) {
      this._errors.payment = "Выберите способ оплаты";
      hasErrors = true;
    }
    
    if (!this._order.address?.trim()) {
      this._errors.address = "Введите адрес доставки";
      hasErrors = true;
    }

    return !hasErrors;
  }

  validateContacts(): boolean {
    this._errors = {};
    let hasErrors = false;

    if (!this._order.email) {
      this._errors.email = "Необходимо указать email";
      hasErrors = true;
    } else if (!/^\S+@\S+\.\S+$/.test(this._order.email)) {
      this._errors.email = "Некорректный email";
      hasErrors = true;
    }
    
    if (!this._order.phone) {
      this._errors.phone = "Необходимо указать телефон";
      hasErrors = true;
    } else if (!/^(\+7|8)[\d\s-]{10,}$/.test(this._order.phone)) {
      this._errors.phone = "Некорректный телефон";
      hasErrors = true;
    }

    return !hasErrors;
  }

  clear(): void {
    this._order = {
      email: "",
      phone: "",
      address: "",
      payment: "",
      items: [],
      total: 0,
    };
    this._errors = {};
    this.emitChanges('order:cleared');
  }

  setItems(items: string[]): void {
    this._order.items = items;
  }
}
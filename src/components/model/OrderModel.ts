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

//Возвращает текущие данные заказа
  get data(): OrderData {
    return this._order;
  }

// Возвращает ошибки валидации
  get errors(): FormErrors {
    return this._errors;
  }

// Возвращает статус валидации
  get isValid(): boolean {
    return Object.keys(this._errors).length === 0;
  }

// Устанавливает значение поля заказа
  setField(field: keyof OrderData, value: string): void {
    (this._order as any)[field] = value;
    this.validate();
    this.emitChanges('order:changed', this._order);
  }

// Валидация данных заказа
  validate(): boolean {
    const errors: FormErrors = {};

    if (!this._order.payment) {
      errors.payment = "Необходимо указать способ оплаты";
    }
    if (!this._order.address) {
      errors.address = "Необходимо указать адрес";
    }
    if (!this._order.email) {
      errors.email = "Необходимо указать email";
    }
    if (!this._order.phone) {
      errors.phone = "Необходимо указать телефон";
    }

    this._errors = errors;
    this.emitChanges('order:validation', this._errors);
    return this.isValid;
  }

// Очищает данные заказа
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
    this.emitChanges('order:changed');
  }

// Подготавливает данные для отправки заказа
  submit(): OrderData {
    return this._order;
  }
}

// Основные типы данных приложения


// Типы для товаров. Категории товаров магазина.
export type Category = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

// Данные товара
export interface Product {
    id: string; // Идентификатор товара
    title: string; // Название товара
    description: string; // Описание товара
    image: string; // Изображение товара
    category: string; // Категория товара
    price: number | null; //Цена товара, null - бесценно
}

// Типы для корзины
export interface CartItem {
  id: string; // Идентификатор товара
  title: string; // Название товара
  price: number; // Цена за единицу
  quantity: number;
}

// Типы для заказа. Способ оплаты заказа
export type PaymentMethod = 'card' | 'cash';

// Данные для оформления заказа
export interface OrderData {
  payment: PaymentMethod; 
  email: string;
  phone: string;
  address: string;
}

// Результат успешного оформления заказа.
export interface OrderResult {
  id: string; // Идентификатор заказа
  total: number; // Итоговая сумма заказа
}

// Типы для ошибок формы
export type FormErrors = Partial<Record<keyof OrderData, string>>;

// Интерфейсы базовых классов

// Интерфейс для системы событий (EventEmitter)
export interface IEvents {
  on<T extends object>(event: string, callback: (data: T) => void): void;
  off<T extends object>(event: string, callback: (data: T) => void): void;
  emit<T extends object>(event: string, data?: T): void;
}

// Базовый интерфейс для компонентов
export interface IComponent<T> {
  render(data?: Partial<T>): HTMLElement;
}

// Интерфейсы моделей

export interface IProductModel {
  products: Product[]; // Список всех товаров
  preview: string | null;
  setProducts(products: Product[]): void;
  getProductById(id: string): Product | undefined;
  setPreview(productId: string): void;
  clearPreview(): void;
}

export interface ICartModel {
  items: CartItem[];
  total: number;
  quantity: number;
  addItem(product: Product): void; // Добавление товара в корзину
  removeItem(productId: string): void; // Удаление товара из корзины
  clearCart(): void; // Очистка корзины
  getItem(productId: string): CartItem | undefined;
  updateItemQuantity(productId: string, quantity: number): void;
}

export interface IOrderModel {
  data: OrderData;
  errors: FormErrors;
  isValid: boolean;
  setField(field: keyof OrderData, value: string): void;
  validate(): boolean;
  validateField(field: keyof OrderData): void;
  clear(): void;
  submit(): OrderData;
}

// Интерфейсы представлений

// Действия для карточки товара
export interface CardActions {
  onClick: (event: MouseEvent) => void;
}

export interface IProductCard {
  inCart: boolean;
  update(data: Partial<Product>): void;
}

export interface IModal {
  open(): void;
  close(): void;
  setContent(content: HTMLElement): void;
}

export interface ICartItemView {
  update(item: CartItem): void;
}

export interface ICartView {
  update(items: CartItem[]): void;
}

export interface IOrderForm {
  errors: FormErrors;
  valid: boolean;
}

export interface SuccessActions {
  onClick: () => void;
}

export interface ISuccessView {
  total: number;
}

export interface IPageView {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}

// Интерфейс API клиента
export interface IApiClient {
  getProductList(): Promise<Product[]>;
  getProductItem(id: string): Promise<Product>;
  orderProducts(order: OrderData): Promise<OrderResult>;
}

// Перечисление событий

export enum AppEvents {
  // События изменения данных
  ProductsChanged = 'products:changed',
  PreviewChanged = 'preview:changed',
  CartChanged = 'cart:changed',
  OrderChanged = 'order:changed',
  OrderValidation = 'order:validation',

  // События пользовательского интерфейса
  CardSelect = 'card:select',
  CardAdd = 'card:add',
  BasketOpen = 'basket:open',
  OrderSubmit = 'order:submit',
  ModalClose = 'modal:close',
  OrderSuccess = 'order:success'
}

//Интерфейсы для событий
export interface ProductChangeEvent {
  products: Product[];
}

export interface PreviewChangeEvent {
  id: string | null;
}

export interface CartChangeEvent {
  items: CartItem[];
  total: number;
  quantity: number;
}

export interface OrderChangeEvent {
  field: keyof OrderData;
  value: string;
}

export interface OrderValidationEvent {
  errors: FormErrors;
  valid: boolean;
}

export interface CardSelectEvent {
  id: string;
}

export interface CardAddEvent {
  product: Product;
}

export interface OrderSuccessEvent {
  order: OrderResult;
}

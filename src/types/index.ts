import {Product} from '../components/model/ProductModel'

// Данные товара
export interface IProduct {
    id: string; // Идентификатор товара
    title: string; // Название товара
    description: string; // Описание товара
    image: string; // Изображение товара
    category: string; // Категория товара
    price: number | null; //Цена товара, null - бесценно
}

// Типы для товаров. Категории товаров магазина.
export type Category = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

// Интерфейс данных
export interface IAppData {
  order: OrderData | null, // Данные текущего заказа или null, если заказа нет
  basket: IProduct[] | null, // Товары в корзине или null, если корзина пуста
  catalog: IProduct[], // Массив товаров в каталоге
  preview: string | null, // ID товара для предпросмотра или null, если предпросмотр неактивен
  loading: boolean,
}

// Интерфейс для данных контактов в заказе (Модальное окно: почта телефон)
export interface OrderContactFormData  {
  email: string; // Электронная почта клиента (формат должен быть валидным email)
  phone: string; // Номер телефона клиента (должен соответствовать валидации телефона)
}

// Интерфейс для данных в заказе (Модальное окно: тип оплаты адрес)
export interface OrderDeliveryFormData  {
  payment: PaymentMethod, // Выбранный способ оплаты
  address: string, // Адрес доставки
}

// Типы для заказа. Способ оплаты заказа
export type PaymentMethod = 'card' | 'cash' | "";


// Интерфейс, объединяет ошибки email/телефона и доставки в одной структуре.
export interface OrderFormError extends OrderContactFormData, OrderDeliveryFormData {
}

// Интерфейс (для типизации данных пользователя)
export interface OrderData extends OrderFormError{
  items: string[], // Массив идентификаторов товаров в заказе
  payment: PaymentMethod; // Способ оплаты пользователя
  total: number; //Общая сумма заказа
}

// Результат успешного оформления заказа.
export interface OrderResult {
  id: string; // Идентификатор заказа
  total: number; // Итоговая сумма заказа
}

// Интерфейс карты товара 
export interface ICard {
  id: string; // Bдентификатор товара
  title: string; // Название товара
  category: string; // Категория товара
  description: string; // Описание товара
  image: string; // URL изображения товара
  price: number | null; // Цена товара (может быть null, если цена не указана)
  selected: boolean; // Флаг, указывающий, выбран ли товар
  button: string; // Текст кнопки
}

// Интерфейс, описывающий элемент корзины (товар в корзине покупок).
export interface CartItem {
  title: string; // Название товара
  price: number; // Цена товара
}

// Интерфейс странички
export interface IPage {
  counter: number; // Счетчик товаров в корзине
  catalog: HTMLElement[]; // Массив элементов DOM для отображения каталога
  locked: boolean; // Флаг блокировки интерфейса
}

// Интерфейс для обработки кликов по карточке товара
export interface ICardAction {
  onClick: (event: MouseEvent) => void;  // Функция-обработчик клика
}

// Интерфейс API для работы с товарами и заказами
export interface IWebLarekAPI {
  getProductList: () => Promise<IProduct[]>; // Получить список товаров
  getProductItem: (id: string) => Promise<IProduct>; // Получить конкретный товар
  orderProducts: (order: OrderData) => Promise<OrderResult>; // Оформить заказ
}

// Тип события изменения каталога товаров
export type CatalogUpdatedEvent = {
  catalog: Product[];  // Новый массив товаров в каталоге
};

// Интерфейс представления корзины
export interface ICartView {
  items: HTMLElement[]; // Элементы товаров в корзине
  selected: string[]; // Выбранные товары (по ID)
  total: number; // Общая сумма
}

// Интерфейс состояния формы
export interface IFormState {
  valid: boolean; // Валидна ли форма
  errors: string;
}

// Интерфейс данных модального окна
export interface IModalData {
  content: HTMLElement;  // HTML-контент для отображения в модалке
}

// Интерфейс данных для "успешного" модального окна (после оформления заказа)
export interface ISuccessModal {
  total: number;  // Сумма заказа
}

// Интерфейс действий для успешного модального окна
export interface ISuccessModalActions {
  onClick: () => void;  // Обработчик клика
}

// Тип. Ошибка формы
export type FormErrors = Partial<Record<keyof OrderData, string>>;
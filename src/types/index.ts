//Интерфейсы данных 

// Данные товара
interface Product {
    id: string; // Идентификатор товара
    title: string; // Название товара
    description: string; // Описание товара
    image: string; // Изображение товара
    category: string; // Категория товара
    price: number | null; //Цена товара, null - бесценно
}

// Данные заказа для отправки
interface Order { 
    payment: 'online' | 'cash'; // Способ оплаты онлайн/при получении
    email: string;
    phone: string;
    address: string;
    items: string[]; // Массив товаров в заказе
    total: number; // Сумма заказа
}

// Ответ сервера после оформления заказа
interface OrderResult {
  id: string;
  total: number;
}

// Интерфейсы для модели данных

// Товар внутри корзины
interface CartItem {
  product: Product;
  quantity: number;
}

// Состояние корзины
interface CartState {
    items: Map<string, CartItem>; 
    total: number; // Общая стоимость
    quantity: number; // Общее количество товаров
}

// Поля данных заказа
interface OrderData {
  payment: string;
  email: string;
  phone: string;
  address: string;
}

// Ошибки формы
interface FormErrors {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
}

//Интерфейсы для отображения

// Модальное окно
interface ModalData {
  content: HTMLElement;
  closable?: boolean;
}

// Действия карточки товара
interface CardActions {
  onClick: (event: MouseEvent) => void;
}

interface FormInputEvent {
    field: keyof OrderData;
    value: string;
}

// Представление корзины
interface BasketView {
  items: HTMLElement[];
  total: number;
}

// Действия успешного заказа
interface SuccessActions {
  onClose: () => void;
}

interface Events {
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;
  emit(event: string, payload?: unknown): void;
}

type ProductCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';
# **Проектная работа "Веб-ларек"**
Web-ларёк — интернет-магазина с товарами для веб-разработчиков. В данном интернет-магазине можно посмотреть каталог товаров, добавить товары в корзину и сделать заказ.

## Ссылки
[Макет Figma](https://www.figma.com/design/0KMR7HxUUMyRPMjuCvQEN1/Веб-ларёк?node-id=0-1)

## Используемый стек
- TypeScript (TS)
- HTML
- SCSS
- Webpack

## Инструкция по сборке и запуску

1. Клонировать репозиторий:
```
git clone https://github.com/AlenaGorodeckaya/web-larek-frontend.git
```

2. После клонирования проекта установить зависимости:
```
npm install
```

3. Для запуска проекта в режиме разработки выполнить команду:
```
npm run start
```

4. Для сборки проекта в продакшен выполнить команду:
```
npm run build
```

## Архитектура проекта
Проект реализован с использованием паттерна MVP (Model-View-Presenter) c элементами EventEmitter для управления событиями.

### Основные слои архитектуры:
1. `Model` - отвечает за работу с данными и API

2. `View` - отвечает за отображение данных и взаимодействие с пользователем.

3. `Presenter` - связывает Model и View, обрабатывает логику.

Взаимодействие между слоями организовано через систему событий `EventEmitter`.

## Описание базовых классов
`EventEmitter` - базовый класс для реализации событий, который позволяет:
- `emit` - генерировать события;
- `off` - удалять обработчики событий;
- `on` - устанавливать обработчики событий.

`Component` - базовый класс для всех компонентов, 
реализует:
- шаблонизацию через HTML-темплейты;
- базовую логику рендеринга;
- абстрактный метод для настройки компонента.

`Api` - базовый класс для взаимодействия с сервером через API, обеспечивающий отправку HTTP-запросов и обработку ответов сервера, реализует:
- отправку запросов (GET, POST и другие методы);
- обработку ответов (парсинг JSON, проверку статусов);
- расширяемую логику (можно добавить авторизацию, повторы запросов).

## Model (Модели данных)
Это абстрактный базовый класс, предназначенный для создания моделей данных.  Когда ее состояние меняется (например, обновляются данные, добавляются новые поля и др.), модель инициирует событие, чтобы другие части системы могли отреагировать.

Принимает:
- `data` - частичные данные модели (объект типа Partial<T>)
- `events` - экземпляр системы событий (интерфейс IEvents)

```
emitChanges(event: string, payload?: object): void; // Уведомляет об изменениях в модели
```
### `ProductModel` 
Отвечает за хранение данных товаров и логику работы с ними. Принимает:
- api - экземпляр API-клиента для работы с сервером;
- events - экземпляр EventEmitter для инициации событий.

Поля класса:
```
- private _products: Product[] = []; // Массив карточек продуктов
- private _preview: string | null = null; // ID выбранного для preview продукта
- protected events: EventEmitter; // Механизм событий, при изменении данных
```
Геттеры:
```
- get products(): Product[] // Возвращает текущий список продуктов
- get preview(): string | null // Возвращает ID продукта в preview
```

Основные методы класса:

`loadProducts(): Promise<void>`
- загружает список продуктов с сервера;
- обновляет внутреннее состояние;
- генерирует событие products:changed.

`setProducts(products: Product[]): void`
- заполняет массив продуктов новыми данными;
- генерирует событие products:changed.

`getProductById(id: string): Product | undefined`

- возвращает продукт по его ID;
- если продукт не найден, возвращает undefined.

`setPreview(productId: string): void`
- устанавливает продукт для предпросмотра;
- генерирует событие preview:changed.

`clearPreview(): void`
- сбрасывает выбранный для предпросмотра продукт;
- генерирует событие preview:changed.

### `CartModel` 
Отвечает за управление данными корзины покупочек.
Принимает:
- events - экземпляр EventEmitter для инициации событий

Поля класса:
```
- private _items: CartItem[] = []; // Товары в корзине
- private _total: number = 0; // Общая стоимость
- private _quantity: number = 0; // Количество товаров
```
Геттеры:
```
- get items(): CartItem[] // Возвращает текущее содержимое корзины
- get total(): number // Возвращает общую стоимость
- get quantity(): number // Возвращает количество товаров
```

Основные методы класса:

`addItem(product: Product): void`
- добавляет товар в корзину или увеличивает его количество;
- пересчитывает итоги;
- генерирует событие cart:changed.

`removeItem(productId: string): void`
- удаляет товар из корзины;
- пересчитывает итоги;
- генерирует событие cart:changed.

`clearCart(): void`
- полностью очищает корзину;
- генерирует событие cart:changed.

`getItem(productId: string): CartItem | undefined`
- возвращает товар из корзины по ID;
- если не найден, возвращает undefined.

`updateItemQuantity(productId: string, quantity: number): void`
- изменяет количество конкретного товара;
- пересчитывает итоги;
- генерирует событие cart:changed.

`calculateTotals(): void`
- пересчитывает общую стоимость и количество;
- вызывается автоматически при изменении корзины.

### `OrderModel` 
 Отвечает за управление данными заказа.Обрабатывает валидацию и отправку заказа на сервер.
Принимает:
- events - экземпляр EventEmitter для инициации событий

Поля класса:
```
 private _order: OrderData = {
  payment: '',
  email: '',
  phone: '',
  address: ''
};
private _errors: FormErrors = {};
private _valid: boolean = false;
```
Геттеры:
```
- get data(): OrderData // Возвращает текущие данные заказа
- get errors(): FormErrors // Возвращает ошибки валидации
- get isValid(): boolean // Возвращает статус валидации
```

Основные методы класса:

`setField(field: keyof OrderData, value: string): void`
- устанавливает значение поля заказа;
- автоматически запускает валидацию;
- генерирует событие order:changed.

`validate(): boolean`
- проверяет корректность всех данных заказа;
- заполняет объект ошибок;
- возвращает true если все данные валидны;
- генерирует событие order:validation.

`validateField(field: keyof OrderData): void`
- валидирует конкретное поле;
- обновляет объект ошибок;
- генерирует событие order:validation.

`clear(): void`
- сбрасывает все данные заказа;
- енерирует событие order:changed.

`submit(): Promise<OrderResult>`
- отправляет заказ на сервер;
- возвращает Promise с результатом;
- генерирует события:
`order:submit` перед отправкой;
`order:success` при успехе;
`order:fail` при ошибке.

## View 

### `ProductCard`
Отображает карточку товара с возможностью добавления в корзину.

Наследование: Component<Product>

Конструктор:
```
constructor(container: HTMLElement, actions?: CardActions)
```
Методы:
- set inCart(value: boolean) - меняет состояние кнопки;
- update(data: Partial<Product>): void - обновляет данные карточки;
- _handleButtonClick: () => void - обработчик клика по кнопке.

### `Modal`
Управляет отображением и поведением модальных окон в приложении.
Наследование: Component<HTMLElement>
Конструктор:
```
constructor(container: HTMLElement, events: EventEmitter)
```
Методы:
- open(): void - открыть модальное окно;
- close(): void - закрыть модальное окно;
- setContent(content: HTMLElement): void - Устанавливает содержимое модального окна;
- _handleEscape: (evt: KeyboardEvent) => void - Обработчик закрытия по ESC;
- _handleOverlayClick: (evt: MouseEvent) => void - Обработчик клика по оверлею.

### `CartView`
Управляет отображением корзины покупочек.

Наследование: Component<CartItem[]>

Конструктор:
```
constructor(container: HTMLElement, events: EventEmitter)
```
Методы:
- update(items: CartItem[]): void - обновляет содержимое корзины;
- _renderItem(item: CartItem): HTMLElement - рендерит один элемент корзины;
- _updateTotal(sum: number): void - обновляет общую сумму;
- _handleSubmit: () => void - обработчик оформления заказа.

### `OrderForm`
Управляет формой оформления заказов.

Наследование: Component<OrderData>

Конструктор:
```
constructor(container: HTMLFormElement, events: EventEmitter)
```
Методы:
- set errors(value: FormErrors) - отображает ошибки валидации;
- set valid(value: boolean) - управляет состоянием кнопки;
- getData(): OrderData - возвращает данные формы;
- _handleInputChange: (evt: Event) => void - обработчик изменений.

### `SuccessView`
Управляет формой сообщения об успешном заказе.

Наследование: Component<OrderResult>

Конструктор:
```
constructor(container: HTMLElement, actions: SuccessActions)
```
Методы:
- set total(value: number) - устанавливает сумму заказа;
- _handleClose: () => void - обработчик закрытия.

### `PageView`
Управляет основными элементами страницы.

Наследование: Component<void>

Конструктор:
```
cconstructor(container: HTMLElement, events: EventEmitter)
```
Методы:
- set counter(value: number) - обновляет счетчик;
- set catalog(items: HTMLElement[]) - обновляет каталог;
- set locked(value: boolean) - блокирует страницу;
- _handleBasketClick: () => void - обработчик корзины.

## Типы данных
- **Интерфейс товара**

```
interface IProduct {
    id: string; // Идентификатор товара
    title: string; // Название товара
    description: string; // Описание товара
    image: string; // Изображение товара
    category: string; // Категория товара
    price: number | null; //Цена товара, null - бесценно
}
```
- **Интерфейс заказа**
```
interface IOrder { 
    payment: 'online' | 'cash'; // Способ оплаты
    email: string;
    phone: string;
    address: string;
    items: string[]; // Массив товаров в заказе
    total: number; // Сумма заказа
}
```
- **Интерфейс результата оформления заказа**
```
interface IOrderResult {
  id: string;
  total: number;
}
```
- **Интерфейс данных модального окна**
```
interface IModalData {
  content: HTMLElement;
}
```
- **Интерфейс действий для карточки**
```
interface ICardActions {
  onClick: (event: MouseEvent) => void;
}
```
- **Интерфейс представления корзины**
```
interface IBasketView {
  items: HTMLElement[];
  total: number;
}
```
- **Интерфейс ошибок формы**
```
interface IFormErrors {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
}
```
## Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

## Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Взаимодействие компонентов
Взаимодействие между компонентами организовано через систему событий с использованием EventEmitter.

**События изменения данных (генерируются моделями):**

`products:changed` - изменение списка товаров.
- Генерируется: ProductData при загрузке или изменении списка товаров.
- Обработчик: обновляет PageView и перерисовывает каталог.

`preview:changed` - изменение товара для предпросмотра.
- Генерируется: ProductData при выборе товара.
- Обработчик: открывает Modal с деталями товара.

`cart:changed` - изменение содержимого корзины.
- Генерируется: CartData при любом изменении корзины.
- Обработчик: обновляет CartView и счетчик в PageView.

`order:changed` - изменение данных заказа.
- Генерируется: OrderData при изменении полей формы.
- Обработчик: обновляет OrderForm.

`order:validation` - результаты валидации заказа.
- Генерируется: OrderData при проверке данных.
- Обработчик: показывает ошибки в OrderForm.

**События пользовательского интерфейса:**
`card:select` - выбор карточки товара.
- Генерируется: ProductCard при клике.
- Обработчик: вызывает ProductData.setPreview().

`card:add` - добавление товара в корзину.
- Генерируется: ProductCard при клике "В корзину".
- Обработчик: вызывает CartData.addItem().

`basket:open` - открытие корзины.
- Генерируется: PageView при клике на иконку корзины.
- Обработчик: открывает CartView в Modal.

`order:submit` - отправка заказа.
- Генерируется: OrderForm при подтверждении.
- Обработчик: вызывает OrderData.submit().

`modal:close`- закрытие модального окна.
- Генерируется: Modal при закрытии.
- Обработчик: сбрасывает состояние связанных моделей.

**Последовательность событий при оформлении заказа:**
1. Пользователь нажимает "Оформить заказ" в CartView → генерируется order:open.
2. Открывается Modal с OrderForm.
3. Пользователь заполняет форму → генерируются order:change для каждого поля.
4. При изменении поля вызывается OrderData.setField().
5. OrderData валидирует данные и генерирует order:validation.
6. При успешной валидации активируется кнопка подтверждения.
7. Пользователь подтверждает заказ и далее генерируется order:submit.
8. Вызывается OrderData.submit(), отправляются данные на сервер.
9. При успехе генерируется order:success, открывается SuccessView.
10. Корзина очищается через CartData.clearCart().
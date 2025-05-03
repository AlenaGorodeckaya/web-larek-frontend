import { ProductModel } from '../model/ProductModel'; 
import { CartModel } from '../model/CartModel';
import { OrderModel } from '../model/OrderModel';
import { cloneTemplate } from "../../utils/utils";
import { CartView } from '../views/BasketView';
import { OrderAddress } from '../views/OrderForm';
import { SuccessView } from '../views/SuccessView';
import { OrderContacts } from '../views/OrderForm';
import { ProductCard } from '../views/ProductCard';
import { CartItemView } from '../views/BasketView';
import { OrderContactFormData, OrderDeliveryFormData, CatalogUpdatedEvent } from '../../types/index';
import { EventEmitter } from "../base/events";
import { LarekAPI } from "../views/LarekAPI";
import { PageView } from "../views/PageView";
import { Modal } from "../views/Modal";
import { IProduct } from '../../types/index';


export class AppPresenter {
    private productModel: ProductModel;
    private cartModel: CartModel;
    private orderModel: OrderModel;
    private cart: CartView;
    private delivery: OrderAddress;
    private contact: OrderContacts;
  
    constructor(
      private events: EventEmitter,
      private api: LarekAPI,
      private page: PageView,
      private modal: Modal,
      private templates: any
    ) {
      this.productModel = new ProductModel({}, events);
      this.cartModel = new CartModel({}, events);
      this.orderModel = new OrderModel({}, events);
      this.cart = new CartView(cloneTemplate(this.templates.basket), events);
      this.delivery = new OrderAddress(cloneTemplate(this.templates.delivery), events);
      this.contact = new OrderContacts(cloneTemplate(this.templates.contact), events);
  
      this.initializeEvents();
    }
  
    private initializeEvents(): void {
      // Открытие корзины
      this.events.on('cart:open', () => {
        this.modal.render({
          content: this.cart.render({}),
        });
      });
  
      // Обновление каталога
      this.events.on<CatalogUpdatedEvent>('items:changed', () => {
        this.page.catalog = this.productModel.products.map((product: IProduct) => {
          const card = new ProductCard('card', cloneTemplate(this.templates.cardCatalog), {
            onClick: () => this.events.emit('card:select', product)
          });
          return card.render({
            title: product.title,
            image: product.image,
            price: product.price,
            category: product.category
          });
        });
      });
  
      // Обновление корзины
      this.events.on('cart:changed', () => {
        this.updateCartItems();
        this.updateCartTotal();
      });
  
      // Добавление товара в корзину
      this.events.on('product:add', (item: IProduct) => {
        this.cartModel.addItem(item);
        this.modal.close();
      });
  
      // Удаление товара из корзины
      this.events.on('product:remove', (item: IProduct) => {
        this.cartModel.removeItem(item.id);
      });
  
      // Открытие модального окна доставки
      this.events.on('order:open', () => {
        this.orderModel.setField('payment', '');
        this.delivery.updatePaymentMethod('');
        this.modal.render({
          content: this.delivery.render({
            payment: '',
            address: '',
            valid: false,
            errors: [],
          }),
        });
        this.orderModel.setField('items', this.cartModel.items.map((item: IProduct) => item.id).join(','));
      });
  
      // Изменение способа оплаты
      this.events.on('order.payment:change', (data: { target: string }) => {
        this.orderModel.setField('payment', data.target);
      });
  
      // Изменение адреса доставки
      this.events.on('order.address:change', (data: { value: string }) => {
        this.orderModel.setField('address', data.value);
      });
  
      // Валидация доставки
      this.events.on('order:validation', (errors: any) => {
        const { payment, address } = errors;
        this.delivery.valid = this.orderModel.isValid;
        this.delivery.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
      });
  
      // Открытие модального окна контактов
      this.events.on('order:submit', () => {
        this.modal.render({
          content: this.contact.render({
            phone: '',
            email: '',
            valid: false,
            errors: [],
          })
        });
      });
  
      // Изменение контактных данных
      this.events.on(/^contacts\..*:change/, (data: {field: keyof OrderContactFormData, value: string}) => {
        this.orderModel.setField(data.field, data.value);
      });
  
      // Валидация контактов
      this.events.on('order:validation', (errors: any) => {
        const { email, phone } = errors;
        this.contact.valid = this.orderModel.isValid;
        this.contact.errors = Object.values({ phone, email }).filter(i => !!i).join('; ');
      });
  
      // Оформление заказа
      this.events.on('contacts:submit', () => {
        this.api.orderProducts(this.orderModel.data)
          .then(() => {
            const total = this.orderModel.data.total;
            this.cartModel.clearCart();
            this.orderModel.clear();
            const success = new SuccessView(cloneTemplate(this.templates.success), {
              onClick: () => {
                this.modal.close();
              },
            });
            this.modal.render({
              content: success.render({
                total: total,
              }),
            });
          })
          .catch((err) => {
            console.error(err);
          });
      });
  
      // Просмотр товара
      this.events.on('preview:changed', (item: IProduct) => {
        if (item) {
          this.api.getProductItem(item.id).then((res) => {
            const product = { ...item, ...res };
  
            const card = new ProductCard('card', cloneTemplate(this.templates.cardPreview), {
              onClick: () => {
                if (this.cartModel.isItemInCart(product)) {
                  this.cartModel.removeItem(product.id);
                  this.modal.close();
                } else {
                  this.events.emit('product:add', product);
                }
              },
            });
  
            const buttonTitle = this.cartModel.isItemInCart(product)
              ? 'Убрать из корзины'
              : 'Купить';
  
            card.buttonText = buttonTitle;
  
            this.modal.render({
              content: card.render({
                title: product.title,
                description: product.description,
                image: product.image,
                price: product.price,
                category: product.category,
              }),
            });
          });
        }
      });
  
      // Счетчик товаров
      this.events.on('counter:changed', () => {
        this.page.counter = this.cartModel.quantity;
      });
  
      // Блокировка страницы
      this.events.on('modal:open', () => { this.page.locked = true; });
      this.events.on('modal:close', () => { this.page.locked = false; });
  
      // Загрузка продуктов
      this.events.on('products:loaded', (products: IProduct[]) => {
        this.productModel.setProducts(products);
      });
    }
  
    private updateCartItems(): void {
      this.cart.items = this.cartModel.items.map((item: IProduct, index: number) => {
        const card = new CartItemView(cloneTemplate(this.templates.cardBasket), index, {
          onClick: () => this.cartModel.removeItem(item.id),
        });
        return card.render({
          title: item.title,
          price: item.price,
        });
      });
    }
  
    private updateCartTotal(): void {
      const total = this.cartModel.total;
      this.cart.total = total;
      this.orderModel.setField('total', total.toString());
    }
}
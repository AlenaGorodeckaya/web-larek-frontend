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
        this.contact = new OrderContacts(
          cloneTemplate(this.templates.contact), 
          events,
          this.orderModel // Передаем модель в конструктор
      );

        this.loadProducts();
        this.initializeEvents();
    }

    private initializeEvents(): void {
        this.events.on('cart:open', () => {
            this.modal.render({
                content: this.cart.render({}),
            });
        });

        this.events.on('card:select', (item: IProduct) => {
            const product = { ...item };
            const card = new ProductCard('card', cloneTemplate(this.templates.cardPreview), {
                onClick: () => {
                    if (this.cartModel.isItemInCart(product)) {
                        this.cartModel.removeItem(product.id);
                    } else {
                        this.cartModel.addItem(product);
                    }
                    this.events.emit('counter:changed');
                    this.modal.close();
                }
            });
            
            card.buttonText = this.cartModel.isItemInCart(product) 
                ? 'Убрать из корзины' 
                : 'Купить';
            
            this.modal.render({
                content: card.render(product)
            });
        });

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
            this.events.emit('counter:changed');
        });

        this.events.on('cart:changed', () => {
            this.updateCartItems();
            this.updateCartTotal();
        });

        this.events.on('order:open', () => {
          this.orderModel.clear();
          this.modal.render({
            content: this.delivery.render({
              payment: '',
              address: '',
              valid: false,
              errors: ''
            })
          });
        });
        
        this.events.on(/^order\.(payment|address):change/, (data: {field: string, value: string}) => {
          this.orderModel.setField(data.field as keyof OrderDeliveryFormData, data.value);
          const isValid = this.orderModel.validateDelivery();
          
          // Получаем текущие ошибки после валидации
          const errors = this.orderModel.errors;
          const errorMessages = [
            errors.payment,
            errors.address
          ].filter(Boolean).join('; ');
        
          this.delivery.errors = errorMessages;
          this.delivery.valid = isValid;
        });
        
        this.events.on('order:submit', () => {
          if (this.orderModel.validateDelivery()) {
            this.modal.render({
              content: this.contact.render({
                phone: this.orderModel.data.phone || '',
                email: this.orderModel.data.email || '',
                valid: this.orderModel.validateContacts(),
                errors: ''
              })
            });
          }
        });

        this.events.on(/^contacts\.(phone|email):change/, (data: {field: keyof OrderContactFormData, value: string}) => {
          this.orderModel.setField(data.field, data.value);
          const isValid = this.orderModel.validateContacts();
          const errors = this.orderModel.errors;
          
          this.contact.errors = Object.values(errors)
              .filter(Boolean)
              .join('; ');
          
          this.contact.valid = isValid;
      });
      
      this.events.on('contacts:submit', () => {
          if (this.orderModel.validateContacts()) {
              this.orderModel.setItems(this.cartModel.items.map(item => item.id));
              this.orderModel.data.total = this.cartModel.total;
              
              this.api.orderProducts(this.orderModel.data)
                  .then((result) => {
                      const success = new SuccessView(cloneTemplate(this.templates.success), {
                          onClick: () => {
                              this.modal.close();
                          },
                      });
                      this.modal.render({
                          content: success.render({
                              total: result.total,
                          }),
                      });
                      this.cartModel.clearCart();
                  })
                  .catch((err) => {
                      console.error(err);
                  });
          }
      });

        this.events.on('counter:changed', () => {
            this.page.counter = this.cartModel.quantity;
        });

        this.events.on('modal:open', () => { this.page.locked = true; });
        this.events.on('modal:close', () => { this.page.locked = false; });

        this.events.on('products:loaded', (products: IProduct[]) => {
            this.productModel.setProducts(products);
            this.events.emit('items:changed');
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
    }

    private loadProducts(): void {
        this.api.getProductList()
            .then((products) => {
                this.events.emit('products:loaded', products);
            })
            .catch((err) => {
                console.error('Error loading products:', err);
            });
    }
}

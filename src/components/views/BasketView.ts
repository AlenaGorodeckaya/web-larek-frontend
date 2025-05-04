import {Component} from "../base/component";
import {ensureElement, createElement} from "../../utils/utils";
import {EventEmitter} from "../base/events";
import {ICartView, CartItem, ICardAction} from "../../types/index";

export class CartView extends Component<ICartView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.containerElement);
        this._total = this.containerElement.querySelector('.basket__price');
        this._button = this.containerElement.querySelector('.basket__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.items = [];
    }

    toggleButton(state: boolean) {
        this.changeDisabledState(this._button, !state);
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
          this._list.replaceChildren(...items);
          this.changeDisabledState(this._button, false);
        } else {
          this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
            textContent: 'Корзина пуста'
          }));
          this.changeDisabledState(this._button, true);
        }
    }

    set total(total: number) {
        this.updateTextContent(this._total, `${total} синапсов`);
    }
}

export class CartItemView extends Component<CartItem> {
    protected _index: HTMLElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, index: number, action?: ICardAction) {
        super(container);
        
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this.updateTextContent(this._index, index + 1);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        if (action?.onClick) {
            if (this._deleteButton) {
                this._deleteButton.addEventListener('click', action.onClick);
            }
        }
    }

    set index(value: number) {
        this.updateTextContent(this._index, value);
    }

    set title(value: string) {
        this.updateTextContent(this._title, value);
    }

    set price(value: number) {
        this.updateTextContent(this._price, `${value} синапсов`);
    }
}
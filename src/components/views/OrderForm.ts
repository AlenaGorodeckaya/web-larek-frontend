import { Component } from "../base/component";
import { IFormState, OrderDeliveryFormData, OrderContactFormData, PaymentMethod } from "../../types/index";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { OrderModel } from "../model/OrderModel";


class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    set errors(value: string) {
        this.updateTextContent(this._errors, value);
    }

    render(state: Partial<T> & IFormState) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);
        return this.container;
    }
}

export class OrderAddress extends Form<OrderDeliveryFormData> {
    protected _paymentButtons: HTMLButtonElement[];
    protected _submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;
    protected _addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        
        this._paymentButtons = Array.from(
            this.container.querySelectorAll('.button_alt')
        );
        this._submitButton = ensureElement<HTMLButtonElement>('.order__button', container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);

        this._errors.textContent = '';
        this._submitButton.disabled = true;

        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.selectPaymentMethod(button.name as PaymentMethod);
                events.emit(`${this.container.name}.payment:change`, {
                    field: 'payment',
                    value: button.name
                });
            });
        });

        this._addressInput.addEventListener('input', () => {
            events.emit(`${this.container.name}.address:change`, {
                field: 'address',
                value: this._addressInput.value
            });
        });
    }

    selectPaymentMethod(method: PaymentMethod) {
        this._paymentButtons.forEach(button => {
            this.modifyClass(
                button, 
                'button_alt-active', 
                button.name === method
            );
        });
    }

    set address(value: string) {
        this._addressInput.value = value;
    }
}

export class OrderContacts extends Form<OrderContactFormData> {
    protected _phoneInput: HTMLInputElement;
    protected _emailInput: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLFormElement, protected events: IEvents, private orderModel: OrderModel) {
        super(container, events);
        
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);

        this._errors.textContent = '';
        this._submitButton.disabled = true;
    }

    set phone(value: string) {
        this._phoneInput.value = value;
    }

    set email(value: string) {
        this._emailInput.value = value;
    }
}

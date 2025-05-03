import { Component } from "../base/component";
import { IFormState, OrderDeliveryFormData, OrderContactFormData } from "../../types/index";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";

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
    protected _payment: HTMLDivElement;
    protected _button: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._payment = this.container.querySelector<HTMLDivElement>('.order__buttons')!;
        this._button = [...this._payment.querySelectorAll<HTMLButtonElement>('.button_alt')];

        this._payment.addEventListener('click', (e: MouseEvent) => {
            const target = e.target as HTMLButtonElement;
            this.updatePaymentMethod(target.name)
            events.emit(`order.payment:change`, {target: target.name}) 
        })
    }

    updatePaymentMethod(selectedMethod: string): void {
        this._button.forEach((btn) => {
            const isActive = btn.name === selectedMethod;
            this.modifyClass(btn, 'button_alt-active', isActive);
        });
    }
    
    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}

export class OrderContacts extends Form<OrderContactFormData> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}
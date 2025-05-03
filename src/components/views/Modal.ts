import {Component} from "../base/component";
import {ensureElement} from "../../utils/utils";
import {IModalData} from "../../types/index";
import {IEvents} from "../base/events";

export class Modal extends Component<IModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
    this._content = ensureElement<HTMLElement>('.modal__content', container);

    this._closeButton.addEventListener('click', this.close.bind(this));
    this.containerElement.addEventListener('click', this.close.bind(this));
    this._content.addEventListener('click', (event) => event.stopPropagation());
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }


  open() {
    this.containerElement.classList.add('modal_active');
    this.events.emit('modal:open');
  }

  close() {
    this.containerElement.classList.remove('modal_active');
    this.content = null;
    this.events.emit('modal:close');
  }

  render(data: IModalData): HTMLElement {
    super.render(data);
    this.open();
    return this.containerElement;
  }
}
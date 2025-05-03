import { Component } from "../base/component";
import { ensureElement } from "../../utils/utils";
import { ISuccessModal, ISuccessModalActions } from "../../types/index";

export class SuccessView extends Component<ISuccessModal> {
  protected _close: HTMLElement;
  protected _total: HTMLElement;


  render(data: ISuccessModal): HTMLElement {
    super.render(data);
    this.total = data.total;
    return this.containerElement;
  }

  set total(value: number) {
    this.updateTextContent(this._total, `Списано ${value} синапсов`);
  }


  constructor(container: HTMLElement, actions: ISuccessModalActions) {
    super(container);

    this._close = ensureElement<HTMLElement>('.order-success__close', this.containerElement);
    this._total = ensureElement<HTMLElement>('.order-success__description', this.containerElement);

    if (actions?.onClick) {
      this._close.addEventListener('click', actions.onClick);
    }
  }
}
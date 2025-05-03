import {Component} from "../base/component";
import {IProduct, ICardAction} from "../../types/index";
import {ensureElement} from "../../utils/utils";

export class ProductCard extends Component<IProduct> {
  protected _title: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _description?: HTMLElement;
  protected _button?: HTMLButtonElement;
  protected _category?: HTMLElement;
  protected _price: HTMLElement;
  protected _buttonModal?: HTMLButtonElement;
  
  private color: { [key: string]: string } = {
    'софт-скил': '_soft',
    'хард-скил': '_hard',
    'кнопка': '_button',
    'дополнительное': '_additional',
    'другое': '_other'
  }

  constructor(protected blockName: string, container: HTMLElement, action?: ICardAction) {
    super(container);

    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
    this._button = container.querySelector(`.${blockName}__button`);
    this._description = container.querySelector(`.${blockName}__description`);
    this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
    this._category = container.querySelector(`.${blockName}__category`);

    if (action?.onClick) {
      if (this._button) {
        this._button.addEventListener("click", action.onClick);
      } else {
        container.addEventListener("click", action.onClick);
      }
    }
  }

  set id(value: string) {
    this.containerElement.dataset.id = value;
  }

  get id(): string {
    return this.containerElement.dataset.id || "";
  }

  set title(value: string) {
    this.updateTextContent(this._title, value);
  }

  get title(): string {
    return this._title.textContent || "";
  }

  set image(value: string) {
    this.configureImage(this._image, value, this.title);
  }

  set description(value: string | string[]) {
    if (Array.isArray(value)) {
      this._description.replaceWith(...value.map(str => {
        const descTemplate = this._description.cloneNode() as HTMLElement;
        this.updateTextContent(descTemplate, str);
        return descTemplate;
      }))
    } else {
      this.updateTextContent(this._description, value);
    }
  }

  set buttonText(value: string) {
    this.updateTextContent(this._button, value);
  }

  set price(value: number | null) {
    if (value == null) {
      this.updateTextContent(this._price, 'Бесценно');
    } else {
      this.updateTextContent(this._price, value + ' Cинапсов')
    }
    this.changeDisabledState(this._button, value === null);
  }

  set category(value: string) {
    this.updateTextContent(this._category, value);
    const category = this._category.classList[0];
    this._category.className = '';
    this._category.classList.add(`${category}`);
    this._category.classList.add(`${category}${this.color[value]}`)
  }

  get category() {
    return this._category.textContent || '';
  }
}
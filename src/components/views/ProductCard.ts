import {Component} from "../base/component";
import {ensureElement} from "../../utils/utils";
import {IProduct, ICardAction} from "../../types/index";

export class ProductCard extends Component<IProduct> {
  protected _title: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _description?: HTMLElement;
  protected _button?: HTMLButtonElement;
  protected _categoryElement: HTMLElement;
  protected _price: HTMLElement;
  protected _buttonModal?: HTMLButtonElement;
  
  constructor(protected blockName: string, container: HTMLElement, action?: ICardAction) {
    super(container);

    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
    this._button = container.querySelector(`.${blockName}__button`);
    this._description = container.querySelector(`.${blockName}__description`);
    this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
    this._categoryElement = ensureElement<HTMLElement>(`.${blockName}__category`, container);

    if (action?.onClick) {
      if (this._button) {
        this._button.addEventListener("click", (e) => {
          e.stopPropagation();
          action.onClick(e);
        });
      } else {
        container.addEventListener("click", (e) => {
          e.stopPropagation();
          action.onClick(e);
        });
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
    this.updateTextContent(this._categoryElement, value);
    const baseClass = `${this.blockName}__category`;
    this._categoryElement.className = baseClass;
    
    if (value === 'софт-скил') {
      this._categoryElement.classList.add(`${baseClass}_soft`);
    } else if (value === 'хард-скил') {
      this._categoryElement.classList.add(`${baseClass}_hard`);
    } else if (value === 'дополнительное') {
      this._categoryElement.classList.add(`${baseClass}_additional`);
    } else if (value === 'кнопка') {
      this._categoryElement.classList.add(`${baseClass}_button`);
    } else {
      this._categoryElement.classList.add(`${baseClass}_other`);
    }
  }
}
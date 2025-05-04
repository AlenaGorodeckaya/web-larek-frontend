import "./scss/styles.scss";
import { LarekAPI } from "../src/components/views/LarekAPI";
import { API_URL, CDN_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/events";
import { AppPresenter } from "./components/presenter/AppPresenter";
import { PageView } from "../src/components/views/PageView";
import { Modal } from "../src/components/views/Modal";
import { ensureElement } from "./utils/utils";


// Инициализация событий и API
const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// Шаблоны
const templates = {
  cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
  cardPreview: ensureElement<HTMLTemplateElement>('#card-preview'),
  cardBasket: ensureElement<HTMLTemplateElement>('#card-basket'),
  basket: ensureElement<HTMLTemplateElement>('#basket'),
  delivery: ensureElement<HTMLTemplateElement>('#order'),
  contact: ensureElement<HTMLTemplateElement>('#contacts'),
  success: ensureElement<HTMLTemplateElement>('#success'),
};

// Основные компоненты
const page = new PageView(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Инициализация презентера
new AppPresenter(events, api, page, modal, templates);

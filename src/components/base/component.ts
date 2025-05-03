// Абстрактный базовый класс для компонентов.

// element - целевой DOM-элемент
// containerElement - контейнер, в котором будет размещаться компонент.
// className - имя класса для переключения
// content - новое содержимое
// source - URL изображения
// description - необязательный альтернативный текст
// data - необязательные данные для обновления компонента (частичные значения типа T)

export abstract class Component<T> {
    protected constructor(protected readonly containerElement: HTMLElement) {
        // Код выполняется до инициализации наследников
    }

    // Методы для управления DOM элементами
    protected modifyClass(element: HTMLElement, className: string, state?: boolean) {
        element.classList.toggle(className, state);
    }

// Обновляет текстовое содержимое элемента
    protected updateTextContent(element: HTMLElement, content: unknown) {
        element && (element.textContent = String(content));
    }
// Устанавливает или снимает атрибут disabled у элемента
    protected changeDisabledState(element: HTMLElement, isDisabled: boolean) {
        if (!element) return;
        isDisabled ? element.setAttribute('disabled', '') : element.removeAttribute('disabled');
    }

// Скрывает элемент через display: none
    protected hideElement(element: HTMLElement) {
        element.style.display = 'none';
    }

// Показывает элемент, сбрасывая display в значение по умолчанию
    protected showElement(element: HTMLElement) {
        element.style.display = '';
    }

// Устанавливает изображение и альтернативный текст
    protected configureImage(element: HTMLImageElement, source: string, description?: string) {
        if (element) {
            element.src = source;
            description && (element.alt = description);
        }
    }
// Обновляет компонент с новыми данными и возвращает корневой элемент
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.containerElement;
    }
}
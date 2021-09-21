/**
 * @returns a <span> element with a part attribute assigned to 'icon',
 * which contains an <slot> element with a name attribute assigned to 'icon'
 */
export function createIconSlotElement(): { container: HTMLElement, slot: HTMLSlotElement } {
    const iconContainerElement = document.createElement('span');
    iconContainerElement.setAttribute('part', 'icon');
    const iconSlotElement = document.createElement('slot');
    iconSlotElement.setAttribute('name', 'icon');
    iconContainerElement.appendChild(iconSlotElement);

    return { container: iconContainerElement, slot: iconSlotElement };
}

export function appendIconSlotElement(rootElement: HTMLElement): { container: HTMLElement, slot: HTMLSlotElement } {
    const iconElements = createIconSlotElement();
    rootElement.appendChild(iconElements.container);
    return { container: iconElements.container, slot: iconElements.slot };
}
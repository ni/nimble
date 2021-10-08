import { DOM } from '@microsoft/fast-element';

export async function clickElement(element: HTMLElement): Promise<unknown> {
    element.click();
    return DOM.nextUpdate();
}

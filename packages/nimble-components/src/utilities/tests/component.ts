import { DOM } from '@microsoft/fast-element';

export async function clickElement(element: HTMLElement): Promise<void> {
    element.click();
    await DOM.nextUpdate();
}

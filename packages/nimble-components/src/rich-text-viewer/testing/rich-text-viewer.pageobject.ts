import type { RichTextViewer } from '..';

/**
 * Page object for the `nimble-rich-text-viewer` component.
 */
export class RichTextViewerPageObject {
    public constructor(
        private readonly richTextViewerElement: RichTextViewer
    ) {}

    public getFirstChildElementTagName(
        element: Element | null | undefined
    ): string {
        return element?.tagName || '';
    }

    public getChildElementTextContent(
        element: Element | null | undefined
    ): string {
        return element?.textContent || '';
    }

    public getFirstChildElement(): Element | null | undefined {
        return this.richTextViewerElement.shadowRoot?.querySelector('#viewer')
            ?.firstElementChild;
    }
}

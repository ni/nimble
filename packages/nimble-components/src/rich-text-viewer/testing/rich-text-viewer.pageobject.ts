import type { RichTextViewer } from '..';

/**
 * Page object for the `nimble-rich-text-viewer` component.
 */
export class RichTextViewerPageObject {
    public constructor(
        private readonly richTextViewerElement: RichTextViewer
    ) {}

    public getFirstChildElement(): Element | null | undefined {
        return this.richTextViewerElement.shadowRoot?.querySelector('#viewer')
            ?.firstElementChild;
    }
}

import type { RichTextEditor } from '..';

/**
 * Page object for the `nimble-rich-text-Editor` component.
 */
export class RichTextEditorPageObject {
    public constructor(
        private readonly richTextEditorElement: RichTextEditor
    ) {}

    public getTagName(element: Element | null | undefined): string {
        return element?.tagName || '';
    }

    public getTextContent(element: Element | null | undefined): string {
        return element?.textContent || '';
    }

    public getFirstChildElement(): Element | null | undefined {
        return this.richTextEditorElement.shadowRoot?.querySelector('#editor')
            ?.firstElementChild;
    }
}

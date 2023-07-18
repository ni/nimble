import type { RichTextViewer } from '..';

/**
 * Page object for the `nimble-rich-text-viewer` component.
 */
export class RichTextViewerPageObject {
    public constructor(
        private readonly richTextViewerElement: RichTextViewer
    ) {}

    public getFirstChildTagContents(): string {
        return this.getFirstMarkdownRenderedElement()?.textContent || '';
    }

    public getLastChildTagContents(): string {
        return this.getLastMarkdownRenderedElement()?.textContent || '';
    }

    public getLastChildAttribute(attribute: string): string {
        return (
            this.getLastMarkdownRenderedElement()?.getAttribute(attribute) || ''
        );
    }

    public getChildTags(): string[] {
        const nestedTagNames = [];
        let currentElement = this.getFirstMarkdownRenderedElement();

        while (currentElement) {
            nestedTagNames.push(currentElement.tagName);
            currentElement = currentElement?.firstElementChild;
        }
        return nestedTagNames;
    }

    private getFirstMarkdownRenderedElement(): Element | null | undefined {
        return this.richTextViewerElement.shadowRoot?.querySelector('.viewer')
            ?.firstElementChild;
    }

    private getLastMarkdownRenderedElement(): Element | null | undefined {
        let lastElement = this.richTextViewerElement.shadowRoot?.querySelector(
            '.viewer'
        )?.lastElementChild;

        while (lastElement?.lastElementChild) {
            lastElement = lastElement?.lastElementChild;
        }
        return lastElement;
    }
}

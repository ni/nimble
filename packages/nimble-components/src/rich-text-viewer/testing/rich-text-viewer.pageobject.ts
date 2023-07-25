import type { RichTextViewer } from '..';

/**
 * Page object for the `nimble-rich-text-viewer` component.
 */
export class RichTextViewerPageObject {
    public constructor(
        private readonly richTextViewerElement: RichTextViewer
    ) {}

    public getRenderedMarkdownLastChildContents(): string {
        return this.getLastChildMarkdownRenderedElement()?.textContent || '';
    }

    public getRenderedMarkdownLastChildAttribute(attribute: string): string {
        return (
            this.getLastChildMarkdownRenderedElement()?.getAttribute(
                attribute
            ) || ''
        );
    }

    /**
     * Retrieves tag names for the rendered markdown content in document order
     * @returns An array of tag names in document order
     */
    public getRenderedMarkdownTagNames(): string[] {
        return Array.from(
            this.getMarkdownRenderedElement()!.querySelectorAll('*')
        ).map(el => el.tagName);
    }

    /**
     * Retrieves text contents for the rendered markdown content in document order
     * @returns An array of text contents of last elements in a tree
     */
    public getRenderedMarkdownLeafContents(): string[] {
        return Array.from(
            this.getMarkdownRenderedElement()!.querySelectorAll('*')
        )
            .filter((el, _) => {
                return el.children.length === 0;
            })
            .map(el => el.textContent || '');
    }

    private getMarkdownRenderedElement(): Element | null | undefined {
        return this.richTextViewerElement.shadowRoot?.querySelector('.viewer');
    }

    private getLastChildMarkdownRenderedElement(): Element | null | undefined {
        let lastElement = this.getMarkdownRenderedElement()?.lastElementChild;

        while (lastElement?.lastElementChild) {
            lastElement = lastElement?.lastElementChild;
        }
        return lastElement;
    }
}

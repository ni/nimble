import type { RichTextViewer } from '..';

/**
 * Page object for the `nimble-rich-text-viewer` component.
 */
export class RichTextViewerPageObject {
    public constructor(
        private readonly richTextViewerElement: RichTextViewer
    ) {}

    public getLastChildTagContents(): string {
        return this.getLastChildMarkdownRenderedElement()?.textContent || '';
    }

    public getLastChildAttribute(attribute: string): string {
        return (
            this.getLastChildMarkdownRenderedElement()?.getAttribute(
                attribute
            ) || ''
        );
    }

    /**
     * Retrieves the tag names of all descendant elements by traversing in a breadth-first manner(all parents, all children and so on.).
     * @returns An array of tag names of the descendant elements.
     */
    public getDescendantTagsBreadthFirst(): string[] {
        const nestedTagNames = [];
        const queue = [this.getMarkdownRenderedElement()];
        let isFirstElement = false;

        while (queue.length > 0) {
            const currentElement = queue.shift();
            if (currentElement) {
                // The first element, which is the "Div" element of the viewer component, is ignored.
                if (isFirstElement) {
                    nestedTagNames.push(currentElement.tagName);
                } else {
                    isFirstElement = true;
                }

                const { children } = currentElement;
                queue.push(...Array.from(children));
            }
        }
        return nestedTagNames;
    }

    /**
     * Retrieves the text contents of elements that have no descendants (children or grandchildren).
     * It performs a breadth-first traversal starting from the root element.
     * @returns An array of text contents of elements without any descendants.
     */
    public getNoDescendantTextContents(): string[] {
        const nestedTextContents = [];
        const queue = [this.getMarkdownRenderedElement()];

        while (queue.length > 0) {
            const currentElement = queue.shift();
            if (currentElement) {
                const { children, textContent } = currentElement;
                if (children.length === 0) {
                    nestedTextContents.push(textContent || '');
                }
                queue.push(...Array.from(children));
            }
        }
        return nestedTextContents;
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

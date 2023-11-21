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
     * @returns An array of tag names with the closing tags (eg: '/P') in a document order
     */
    public getRenderedMarkdownTagNamesWithClosingTags(): string[] {
        const tagNames: string[] = [];
        const renderedElement = this.getMarkdownRenderedElement();

        const processNode = (node: Node): void => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const el = node as Element;
                tagNames.push(el.tagName);

                el.childNodes.forEach(processNode);

                tagNames.push(`/${el.tagName}`);
            }
        };

        if (renderedElement) {
            processNode(renderedElement);
        }

        return tagNames.slice(1, -1);
    }

    /**
     * Retrieves text contents for the rendered markdown content in document order
     * @returns An array of text contents of last elements in a tree
     */
    public getRenderedMarkdownLeafContents(): string[] {
        return Array.from(
            this.getMarkdownRenderedElement()!.querySelectorAll('*')
        )
            .filter((el, _) => el.children.length === 0)
            .map(el => el.textContent || '');
    }

    public getRenderedMarkdownAttributeValues(attribute: string): string[] {
        return Array.from(
            this.getMarkdownRenderedElement()!.querySelectorAll('*')
        )
            .filter((el, _) => el.children.length === 0)
            .map(el => el.getAttribute(attribute) || '');
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

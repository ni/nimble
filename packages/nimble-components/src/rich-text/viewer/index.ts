import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { observable } from '@microsoft/fast-element';
import { template } from './template';
import { styles } from './styles';
import { RichTextMarkdownParser } from '../models/markdown-parser';
import type { ListOption } from '../../list-option';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-rich-text-viewer': RichTextViewer;
    }
}

/**
 * A nimble styled rich text viewer
 */
export class RichTextViewer extends FoundationElement {
    /**
     *
     * @public
     * Markdown string to render its corresponding rich text content in the component.
     */
    @observable
    public markdown = '';

    /**
     * @internal
     */
    public viewer!: HTMLDivElement;

    /**
     * @internal
     */
    @observable
    public slottedOptions!: ListOption[];

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();
        this.updateView();
    }

    /**
     * @internal
     */
    public markdownChanged(): void {
        if (this.$fastController.isConnected) {
            this.updateView();
        }
    }

    /**
     * @internal
     */
    public slottedOptionsChanged(): void {
        if (this.$fastController.isConnected) {
            this.updateView();
        }
    }

    private updateView(): void {
        if (this.markdown) {
            const slottedOptionsList = this.getSlottedOptionsList();
            const serializedContent = RichTextMarkdownParser.parseMarkdownToDOM(
                this.markdown,
                slottedOptionsList
            );
            this.viewer.replaceChildren(serializedContent);
        } else {
            this.viewer.innerHTML = '';
        }
    }

    private getSlottedOptionsList(): { id: string, name: string }[] {
        const slottedOptionsList: { id: string, name: string }[] = [];
        this.slottedOptions.forEach(ele => {
            slottedOptionsList.push({
                id: ele.value,
                name: ele.textContent ?? ''
            });
        });
        return slottedOptionsList;
    }
}

const nimbleRichTextViewer = RichTextViewer.compose({
    baseName: 'rich-text-viewer',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleRichTextViewer());
export const richTextViewerTag = DesignSystem.tagFor(RichTextViewer);

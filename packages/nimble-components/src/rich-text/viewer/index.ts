import { DesignSystem } from '@microsoft/fast-foundation';
import { observable } from '@microsoft/fast-element';
import { template } from './template';
import { styles } from './styles';
import { RichTextMarkdownParser } from '../models/markdown-parser';
import { RichText } from '../base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-rich-text-viewer': RichTextViewer;
    }
}

/**
 * A nimble styled rich text viewer
 */
export class RichTextViewer extends RichText {
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

    private mentionedHrefs: string[] = [];

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
        this.updateView();
    }

    public getMentionedHrefs(): string[] {
        return this.mentionedHrefs;
    }

    protected override updateView(): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        if (this.markdown) {
            const parserDetail = RichTextMarkdownParser.parseMarkdownToDOM(
                this.markdown,
                this.mentionConfig
            );
            this.viewer.replaceChildren(parserDetail.fragment);
            this.mentionedHrefs = parserDetail.mentionedHrefs;
        } else {
            this.viewer.innerHTML = '';
            this.mentionedHrefs = [];
        }
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

import { DesignSystem } from '@microsoft/fast-foundation';
import { observable } from '@microsoft/fast-element';
import { template } from './template';
import { styles } from './styles';
import { RichTextMarkdownParser } from '../models/markdown-parser';
import { RichText } from '../base';

export const richTextViewerTag = 'nimble-rich-text-viewer';
declare global {
    interface HTMLElementTagNameMap {
        [richTextViewerTag]: RichTextViewer;
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

    /**
     * @internal
     */
    public configurationChanged(): void {
        this.updateView();
    }

    public getMentionedHrefs(): string[] {
        return Array.from(this.mentionedHrefs);
    }

    private updateView(): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        if (this.markdown) {
            const parseResult = RichTextMarkdownParser.parseMarkdownToDOM(
                this.markdown,
                this.configuration?.parserMentionConfig
            );
            this.viewer.replaceChildren(parseResult.fragment);
            this.mentionedHrefs = parseResult.mentionedHrefs;
        } else {
            this.viewer.innerHTML = '';
            this.mentionedHrefs = [];
        }
    }
}

const nimbleRichTextViewer = RichTextViewer.compose({
    baseName: richTextViewerTag,
    template,
    styles
});

DesignSystem.getOrCreate()
    .register(nimbleRichTextViewer());

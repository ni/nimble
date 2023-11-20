import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { Notifier, Observable, observable } from '@microsoft/fast-element';
import { template } from './template';
import { styles } from './styles';
import { RichTextMarkdownParser } from '../models/markdown-parser';
import { RichTextMention } from '../../rich-text-mention/base';
import { MentionInternals } from '../../rich-text-mention/base/models/mention-internals';
import { MarkdownParserMentionConfiguration } from '../models/markdown-parser-mention-configuration';

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
    public mentionElements: RichTextMention[] = [];

    /**
     * @internal
     */
    public mentionInternalsList: MarkdownParserMentionConfiguration[] = [];

    /**
     * @internal
     */
    @observable
    public readonly childItems: Element[] = [];

    private mentionInternalsNotifiers: Notifier[] = [];

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
    public handleChange(source: unknown, args: unknown): void {
        if (source instanceof MentionInternals && typeof args === 'string') {
            this.updateMentionInternalsList();
        }
    }

    private childItemsChanged(): void {
        void this.updateMentionsFromChildItems();
    }

    private async updateMentionsFromChildItems(): Promise<void> {
        const definedElements = this.childItems.map(async item => (item.matches(':not(:defined)')
            ? customElements.whenDefined(item.localName)
            : Promise.resolve()));
        await Promise.all(definedElements);
        this.mentionElements = this.childItems.filter(
            (x): x is RichTextMention => x instanceof RichTextMention
        );

        this.observeMentions();
        this.updateMentionInternalsList();
    }

    private observeMentions(): void {
        this.removeMentionObservers();

        for (const mention of this.mentionElements) {
            const notifierInternals = Observable.getNotifier(
                mention.mentionInternals
            );
            notifierInternals.subscribe(this);
            this.mentionInternalsNotifiers.push(notifierInternals);
        }
    }

    private removeMentionObservers(): void {
        this.mentionInternalsNotifiers.forEach(notifier => {
            notifier.unsubscribe(this);
        });
        this.mentionInternalsNotifiers = [];
    }

    private updateMentionInternalsList(): void {
        this.mentionInternalsList = [];
        const markdownParserMentionsConfiguration: MarkdownParserMentionConfiguration[] = [];
        this.mentionElements.forEach(mention => {
            if (
                mention.mentionInternals.pattern
                && mention.mentionInternals.mentionConfig
                && mention.mentionInternals.validConfiguration
            ) {
                const markdownParserMentionConfiguration = new MarkdownParserMentionConfiguration(
                    mention.mentionInternals
                );
                markdownParserMentionsConfiguration.push(
                    markdownParserMentionConfiguration
                );
            }
        });
        this.mentionInternalsList = [
            ...new Set(markdownParserMentionsConfiguration)
        ];
        this.updateView();
    }

    private updateView(): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        if (this.markdown) {
            const serializedContent = RichTextMarkdownParser.parseMarkdownToDOM(
                this.markdown,
                this.mentionInternalsList
            );
            this.viewer.replaceChildren(serializedContent);
        } else {
            this.viewer.innerHTML = '';
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

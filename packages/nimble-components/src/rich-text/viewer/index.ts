import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { Notifier, Observable, observable } from '@microsoft/fast-element';
import { template } from './template';
import { styles } from './styles';
import { RichTextMarkdownParser } from '../models/markdown-parser';
import {
    RichTextMention,
    type RichTextMentionConfig
} from '../../rich-text-mention/base';
import { MentionInternals } from '../../rich-text-mention/base/models/mention-internals';

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
    public mentions: RichTextMention[] = [];

    /**
     * @internal
     */
    public mentionsMap: Map<string, MentionInternals<RichTextMentionConfig>> = new Map();

    /**
     * @internal
     */
    @observable
    public readonly childItems: Element[] = [];

    private mentionNotifiers: Notifier[] = [];

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
    public handleChange(source: unknown, args: unknown): void {
        if (
            (source instanceof RichTextMention
                || source instanceof MentionInternals)
            && typeof args === 'string'
        ) {
            this.updateMentionsMap();
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
        this.mentions = this.childItems.filter(
            (x): x is RichTextMention => x instanceof RichTextMention
        );

        this.observeMentions();
        this.updateMentionsMap();
    }

    private observeMentions(): void {
        this.removeMentionObservers();

        for (const mention of this.mentions) {
            const notifier = Observable.getNotifier(mention);
            notifier.subscribe(this);
            this.mentionNotifiers.push(notifier);
            const notifierInternals = Observable.getNotifier(
                mention.mentionInternals
            );
            notifierInternals.subscribe(this);
            this.mentionNotifiers.push(notifierInternals);
        }
    }

    private removeMentionObservers(): void {
        this.mentionNotifiers.forEach(notifier => {
            notifier.unsubscribe(this);
        });
        this.mentionNotifiers = [];
    }

    private updateMentionsMap(): void {
        this.mentionsMap = new Map();
        this.mentions.forEach(mention => {
            if (
                mention.mentionInternals.pattern
                && mention.mentionInternals.mentionConfig
            ) {
                this.mentionsMap.set(
                    mention.mentionInternals.character,
                    mention.mentionInternals
                );
            }
        });
        if (this.$fastController.isConnected) {
            this.updateView();
        }
    }

    private updateView(): void {
        if (this.markdown) {
            const serializedContent = RichTextMarkdownParser.parseMarkdownToDOM(
                this.markdown,
                this.mentionsMap
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

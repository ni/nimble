import { Observable, observable, type Notifier } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import { RichTextMention } from '../../rich-text-mention/base';
import { MentionInternals } from '../../rich-text-mention/base/models/mention-internals';
import { MarkdownParserMentionConfiguration } from '../models/markdown-parser-mention-configuration';

/**
 * Base class for rich text components
 */
export abstract class RichText extends FoundationElement {
    /**
     * @internal
     */
    @observable
    public readonly childItems: Element[] = [];

    protected mentionConfig: MarkdownParserMentionConfiguration[] = [];

    protected mentionElements: RichTextMention[] = [];

    private mentionInternalsNotifiers: Notifier[] = [];

    /**
     * @internal
     */
    public handleChange(source: unknown, args: unknown): void {
        if (source instanceof MentionInternals && typeof args === 'string') {
            this.updateMentionConfig();
        }
    }

    /**
     * @internal
     */
    public abstract getMentionedHrefs(): string[];

    protected abstract updateView(): void;

    /**
     * Create a MarkdownParserMentionConfiguration using the mention elements and implement the logic for the getMentionedHref() method
     * which will be invoked in the RichTextMention base class from the client.
     */
    protected updateMentionConfig(): void {
        // TODO: Add a rich text validator to check if the `mentionElements` contains duplicate configuration element
        // For example, having two `nimble-rich-text-mention-users` within the children of rich text viewer or editor is an invalid configuration
        this.mentionConfig = [];
        this.mentionElements.forEach(mention => {
            if (mention.mentionInternals.validConfiguration) {
                const markdownParserMentionConfiguration = new MarkdownParserMentionConfiguration(
                    mention.mentionInternals
                );
                this.mentionConfig.push(markdownParserMentionConfiguration);
            }
        });
        this.updateView();
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
        this.updateMentionConfig();
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
}

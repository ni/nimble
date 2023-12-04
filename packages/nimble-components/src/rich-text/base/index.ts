import { Observable, observable, type Notifier } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import { RichTextMention } from '../../rich-text-mention/base';
import { MentionInternals } from '../../rich-text-mention/base/models/mention-internals';
import { Configuration } from '../models/configuration';
import { MarkdownParserMentionConfiguration } from '../models/markdown-parser-mention-configuration';

/**
 * Base class for rich text components
 */
export abstract class RichText<
    TConfiguration extends Configuration = Configuration
> extends FoundationElement {
    /**
     * @internal
     */
    public mentionInternalsNotifiers: Notifier[] = [];

    /**
     * @internal
     */
    @observable
    public readonly childItems: Element[] = [];

    @observable
    protected configuration?: TConfiguration;

    @observable
    protected mentionElements!: RichTextMention[];

    /**
     * @internal
     */
    public abstract getMentionedHrefs(): string[];

    /**
     * @internal
     */
    public handleChange(source: unknown, args: unknown): void {
        if (
            source instanceof MentionInternals
            && MarkdownParserMentionConfiguration.isObservedMentionInternalsProperty(
                args
            )
        ) {
            this.configuration = this.createConfig();
        }
    }

    protected mentionElementsChanged(_old: unknown, _new: unknown): void {
        this.observeMentionInternals();
        this.configuration = this.createConfig();
    }

    protected createConfig(): TConfiguration {
        return new Configuration(this.mentionElements) as TConfiguration;
    }

    private childItemsChanged(_prev: unknown, _next: unknown): void {
        void this.updateMentionElementsFromChildItems();
    }

    private async updateMentionElementsFromChildItems(): Promise<void> {
        const definedElements = this.childItems.map(async item => (item.matches(':not(:defined)')
            ? customElements.whenDefined(item.localName)
            : Promise.resolve()));
        await Promise.all(definedElements);
        this.mentionElements = this.childItems.filter(
            (x): x is RichTextMention => x instanceof RichTextMention
        );
    }

    private observeMentionInternals(): void {
        this.removeMentionInternalsObservers();

        for (const mention of this.mentionElements) {
            const notifierInternals = Observable.getNotifier(
                mention.mentionInternals
            );
            notifierInternals.subscribe(this);
            this.mentionInternalsNotifiers.push(notifierInternals);
        }
    }

    private removeMentionInternalsObservers(): void {
        this.mentionInternalsNotifiers.forEach(notifier => {
            notifier.unsubscribe(this);
        });
        this.mentionInternalsNotifiers = [];
    }
}

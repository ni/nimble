import {
    Observable,
    observable,
    type Notifier,
    DOM
} from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import { RichTextMention } from '../../rich-text-mention/base';
import { MentionInternals } from '../../rich-text-mention/base/models/mention-internals';
import { MarkdownParserMentionConfiguration } from '../models/markdown-parser-mention-configuration';
import type { RichTextValidity } from './types';
import { RichTextValidator } from './models/rich-text-validator';

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
    private readonly richTextValidator = new RichTextValidator();
    private updateQueued = false;

    /**
     * @public
     */
    public get validity(): RichTextValidity {
        return this.richTextValidator.getValidity();
    }

    /**
     * @public
     */
    public checkValidity(): boolean {
        return this.richTextValidator.isValid();
    }

    /**
     * @internal
     */
    public handleChange(source: unknown, args: unknown): void {
        if (source instanceof MentionInternals && typeof args === 'string') {
            this.queueUpdate();
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
    private updateMentionConfig(): void {
        this.richTextValidator.validate(this.mentionElements);
        this.mentionConfig = [];
        if (this.richTextValidator.isValid()) {
            this.mentionElements.forEach(mention => {
                const markdownParserMentionConfiguration = new MarkdownParserMentionConfiguration(
                    mention.mentionInternals
                );
                this.mentionConfig.push(markdownParserMentionConfiguration);
            });
        }
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
        if (this.mentionElements.length) {
            this.queueUpdate();
        }
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

    private queueUpdate(): void {
        if (!this.updateQueued) {
            this.updateQueued = true;
            DOM.queueUpdate(() => {
                this.updateMentionConfig();
                this.updateQueued = false;
            });
        }
    }
}

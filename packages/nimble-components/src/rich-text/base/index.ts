import { Observable, observable, type Notifier, DOM } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import { RichTextMention } from '../../rich-text-mention/base';
import { MentionInternals } from '../../rich-text-mention/base/models/mention-internals';
import { Configuration } from '../models/configuration';
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
    public mentionInternalsNotifiers: Notifier[] = [];

    /**
     * @internal
     */
    @observable
    public readonly childItems: Element[] = [];

    /**
     * @internal
     */
    @observable
    public configuration?: Configuration;

    @observable
    protected mentionElements!: RichTextMention[];

    /**
     * @public
     */
    public get validity(): RichTextValidity {
        return this.richTextValidator.getValidity();
    }

    private readonly richTextValidator = new RichTextValidator();
    private updateQueued = false;

    /**
     * @public
     */
    public checkValidity(): boolean {
        return this.richTextValidator.isValid();
    }

    /**
     * @internal
     */
    public abstract getMentionedHrefs(): string[];

    /**
     * @internal
     */
    public handleChange(source: unknown, args: unknown): void {
        if (source instanceof MentionInternals && typeof args === 'string' && MarkdownParserMentionConfiguration.isObservedMentionInternalsProperty(
            args
        )) {
            this.queueUpdate();
        }
    }

    protected mentionElementsChanged(prev: string[] | undefined, next: string[]): void {
        // Skips queuing the update when the value changes from undefined to an empty array
        // as it refers that there are no mention configuration elements are added during initialization.
        if (prev?.length || next.length) {
            this.observeMentionInternals();
            this.queueUpdate();
        }
    }

    protected createConfig(): Configuration {
        return new Configuration(this.mentionElements);
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

    private queueUpdate(): void {
        if (!this.updateQueued) {
            this.updateQueued = true;
            DOM.queueUpdate(() => {
                this.configuration = this.createConfig();
                this.updateQueued = false;
            });
        }
    }
}

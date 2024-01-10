import { Observable, observable, type Notifier } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import { RichTextMention } from '../../rich-text-mention/base';
import { MentionInternals } from '../../rich-text-mention/base/models/mention-internals';
import { Configuration } from '../models/configuration';
import { RichTextUpdateTracker } from '../models/rich-text-tracker';
import { RichTextValidator } from '../models/rich-text-validator';
import type { RichTextValidity } from './types';

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

    @observable
    protected mentionElements!: RichTextMention[];

    @observable
    protected configuration?: Configuration;

    protected readonly richTextUpdateTracker = new RichTextUpdateTracker(this);

    protected readonly richTextValidator = new RichTextValidator();

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
    public abstract getMentionedHrefs(): string[];

    /**
     * @internal
     */
    public handleChange(source: unknown, args: unknown): void {
        if (source instanceof MentionInternals && typeof args === 'string') {
            if (args === 'validConfiguration') {
                this.richTextValidator.validateMentionConfigurations(
                    this.mentionElements
                );
            } else {
                this.richTextUpdateTracker.trackMentionInternalsPropertyChanged(
                    args
                );
            }
        }
    }

    public createConfig(): void {
        this.validate();
        if (this.richTextValidator.isValid()) {
            if (
                this.richTextUpdateTracker.updateMappingConfigs
                || this.richTextUpdateTracker.updatePattern
            ) {
                this.configuration = new Configuration(this.mentionElements);
            }
        } else {
            this.configuration = undefined;
        }
    }

    protected mentionElementsChanged(_old: unknown, _new: unknown): void {
        this.observeMentionInternals();
        this.richTextUpdateTracker.trackMentionElementsInstancesChanged();
    }

    protected validate(): void {
        this.richTextValidator.validateMentionConfigurations(
            this.mentionElements
        );
        this.richTextValidator.validateDuplicateMentionConfigurations(
            this.mentionElements
        );
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

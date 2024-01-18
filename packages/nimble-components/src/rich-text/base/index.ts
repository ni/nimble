import { Observable, observable, type Notifier } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import { RichTextMention } from '../../rich-text-mention/base';
import { MentionInternals } from '../../rich-text-mention/base/models/mention-internals';
import { Configuration } from '../models/configuration';
import { RichTextUpdateTracker } from '../models/rich-text-tracker';
import { RichTextValidator } from '../models/rich-text-validator';
import type { RichTextValidity } from './types';
import { waitUntilCustomElementsDefinedAsync } from '../../utilities/wait-until-custom-elements-defined-async';

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
    protected configuration?: Configuration;

    protected mentionElements!: RichTextMention[];

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
            this.richTextUpdateTracker.trackMentionInternalsPropertyChanged(
                args
            );
        }
    }

    /**
     * @internal
     */
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

    protected validate(): void {
        this.richTextValidator.validate(this.mentionElements);
    }

    private childItemsChanged(
        prev: Element[] | undefined,
        next: Element[]
    ): void {
        if (prev?.length || next.length) {
            void this.updateMentionElementsFromChildItems();
        }
    }

    private async updateMentionElementsFromChildItems(): Promise<void> {
        await waitUntilCustomElementsDefinedAsync(this.childItems);
        this.mentionElements = this.childItems.filter(
            (x): x is RichTextMention => x instanceof RichTextMention
        );
        this.observeMentionInternals();
        this.richTextUpdateTracker.trackMentionElementsInstancesChanged();
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

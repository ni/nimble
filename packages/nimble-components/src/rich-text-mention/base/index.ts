import {
    attr,
    Notifier,
    Observable,
    observable,
    Subscriber
} from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import type { MappingConfig } from './models/mapping-config';
import type {
    RichTextMentionValidator,
    RichTextMentionValidity
} from './models/mention-validator';
import {
    MentionInternals,
    MentionInternalsOptions
} from './models/mention-internals';
import { Mapping } from '../../mapping/base';
import type { RichText } from '../../rich-text/base';
import type {
    MappingConfigs,
    MentionUpdateEventDetail,
} from './types';
import type { MentionConfig } from './models/mention-config';

/**
 * The base class for Mention configuration
 */
export abstract class RichTextMention<
    TValidator extends RichTextMentionValidator = RichTextMentionValidator
>
    extends FoundationElement
    implements Subscriber {
    /**
     * @internal
     */
    public readonly mentionInternals: MentionInternals = new MentionInternals(
        this.getMentionInternalsOptions(),
        (filter: string): void => {
            this.emitMentionUpdate(filter);
        }
    );

    /** @internal */
    public readonly validator = this.createValidator();

    /**
     * A regex used to extract user ID from user key (url) while parsing and serializing a markdown.
     */
    @attr
    public pattern?: string;

    /** @internal */
    public mappingNotifiers: Notifier[] = [];

    /** @internal */
    @observable
    public mappingElements: Mapping<unknown>[] = [];

    /**
     * @public
     * Returns hrefs for existing mentions in the editor/viewer.
     */
    public abstract getMentionedHrefs(): string[];

    /**
     * @public
     */
    public checkValidity(): boolean {
        return this.mentionInternals.validConfiguration;
    }

    /**
     * @public
     */
    public get validity(): RichTextMentionValidity {
        return this.validator.getValidity();
    }

    /**
     * @internal
     */
    public emitMentionUpdate(filter: string): void {
        const mentionUpdateEventDetails: MentionUpdateEventDetail = {
            filter
        };
        this.$emit('mention-update', mentionUpdateEventDetails);
    }

    /**
     * @internal
     */
    public handleChange(source: unknown, args: unknown): void {
        if (source instanceof Mapping && typeof args === 'string') {
            this.updateMappingConfigs();
        }
    }

    protected abstract createValidator(): TValidator;

    protected abstract getMentionInternalsOptions(): MentionInternalsOptions;

    protected abstract createMentionConfig(): MentionConfig;

    protected abstract createMappingConfig(
        mapping: Mapping<unknown>
    ): MappingConfig;

    protected get richTextParent(): RichText {
        return this.parentElement as RichText;
    }

    private getMappingConfigs(): MappingConfigs {
        const mappingConfigs = new Map<string, MappingConfig>();
        this.mappingElements.forEach(mapping => {
            const href = mapping.key ?? undefined;
            if (href === undefined || typeof href !== 'string') {
                throw Error(
                    'mentionHref was invalid for type. Validation should have prevented this.'
                );
            }
            const mappingConfig = this.createMappingConfig(mapping);
            mappingConfigs.set(href, mappingConfig);
        });
        return mappingConfigs;
    }

    private updateMappingConfigs(): void {
        this.validator.validate(this.mappingElements, this.pattern);
        this.mentionInternals.mappingConfigs = this.validator.isValid()
            ? this.getMappingConfigs()
            : undefined;
    }

    private mappingElementsChanged(): void {
        this.updateMappingConfigs();
        this.observeMappingElements();
    }

    private patternChanged(): void {
        this.validator.validate(this.mappingElements, this.pattern);
        this.mentionInternals.pattern = this.pattern;
    }

    private removeMappingElementObservers(): void {
        this.mappingNotifiers.forEach(notifier => {
            notifier.unsubscribe(this);
        });
        this.mappingNotifiers = [];
    }

    private observeMappingElements(): void {
        this.removeMappingElementObservers();

        for (const mapping of this.mappingElements) {
            const notifier = Observable.getNotifier(mapping);
            notifier.subscribe(this);
            this.mappingNotifiers.push(notifier);
        }
    }
}
